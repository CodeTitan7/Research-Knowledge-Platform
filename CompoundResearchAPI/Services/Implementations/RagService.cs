using System.Text;
using System.Text.Json;
using CompoundResearchAPI.Data;
using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Repositories.Interfaces;
using CompoundResearchAPI.Services.Interfaces;

namespace CompoundResearchAPI.Services.Implementations
{
    // Core RAG pipeline: embed the question, retrieve the most relevant chunks,
    // and ask the LLM to answer using ONLY that retrieved evidence.
    public class RagService : IRagService
    {
        private const double MinRelevanceThreshold = 0.05; // lowered for local fallback embeddings (keyword-overlap only)

        private readonly IChunkRepository _chunkRepository;
        private readonly IEmbeddingService _embeddingService;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<RagService> _logger;

        public RagService(
            IChunkRepository chunkRepository,
            IEmbeddingService embeddingService,
            HttpClient httpClient,
            IConfiguration config,
            ApplicationDbContext context,
            ILogger<RagService> logger)
        {
            _chunkRepository = chunkRepository;
            _embeddingService = embeddingService;
            _httpClient = httpClient;
            _config = config;
            _context = context;
            _logger = logger;
        }

        // Narrow, deliberately short list of greeting/pleasantry patterns. This is NOT a general
        // topic classifier — it must only catch things a reasonable person would recognize as
        // small talk, never anything that could plausibly be a real (even off-topic) question.
        // Off-topic factual questions like "melting point of unobtainium-42" must NOT match this
        // and must continue through the normal RAG pipeline, which correctly reports no evidence.
        private static readonly string[] ChitChatPatterns =
        {
            "hi", "hello", "hey", "how are you", "how's it going", "what's up",
            "good morning", "good afternoon", "good evening", "thanks", "thank you",
            "bye", "goodbye", "see you", "who are you", "what can you do"
        };

        // Returns true only for short messages that are essentially just a greeting/pleasantry,
        // not for longer questions that merely contain a greeting word somewhere in them.
        private static bool IsChitChat(string question)
        {
            var trimmed = question.Trim().TrimEnd('.', '!', '?').ToLowerInvariant();

            // Guard against false positives: a real question can be long and still start with
            // "hi" (e.g. "hi, does metformin interact with alcohol?"). Only treat it as chit-chat
            // if the whole message is short and matches a pattern closely, not just contains one.
            if (trimmed.Length > 40) return false;

            return ChitChatPatterns.Any(pattern =>
                trimmed == pattern || trimmed.StartsWith(pattern + " ") || trimmed.StartsWith(pattern + ","));
        }

        public async Task<QueryResponseDto> AskAsync(QueryRequestDto request, string userId)
        {
            // Handle greetings/pleasantries without going through retrieval at all — these are not
            // research questions, so it would be misleading to run them through the evidence
            // pipeline and report "no evidence found" as if the user asked something out of scope.
            if (IsChitChat(request.Question))
            {
                const string chitChatReply =
                    "Hello! I'm a research assistant for compound and target information. " +
                    "Ask me a question about a compound, target, or research topic in the reference collection, " +
                    "and I'll answer using the available sources.";

                await LogQueryAsync(userId, request.Question, chitChatReply, "");

                return new QueryResponseDto
                {
                    Answer = chitChatReply,
                    Sources = new List<SourceReferenceDto>(),
                    HasSufficientEvidence = false
                };
            }

            var questionEmbedding = await _embeddingService.GenerateEmbeddingAsync(request.Question);
            var candidateChunks = await _chunkRepository.GetChunksAsync(request.CompoundId);

            var topK = int.TryParse(_config["AiSettings:TopKChunks"], out var k) ? k : 5;

            var ranked = candidateChunks
                .Select(chunk => new
                {
                    Chunk = chunk,
                    Score = VectorMathHelper.CosineSimilarity(questionEmbedding, VectorMathHelper.FromStorageString(chunk.EmbeddingVector))
                })
                .OrderByDescending(x => x.Score)
                .Take(topK)
                .ToList();

            var relevantResults = ranked.Where(r => r.Score >= MinRelevanceThreshold).ToList();

            // Edge case: no matching evidence in the knowledge base — do not let the model invent facts.
            if (relevantResults.Count == 0)
            {
                await LogQueryAsync(userId, request.Question, "No relevant source information was found in the reference collection.", "");

                return new QueryResponseDto
                {
                    Answer = "I couldn't find relevant information in the reference collection to answer this question. " +
                             "Try rephrasing, or upload a document covering this topic.",
                    Sources = new List<SourceReferenceDto>(),
                    HasSufficientEvidence = false
                };
            }

            var answer = await GenerateAnswerAsync(request.Question, relevantResults.Select(r => r.Chunk).ToList());

            // Second line of defense: a fixed similarity threshold alone cannot always separate
            // relevant from irrelevant queries, especially with a small, single-topic corpus where
            // baseline cosine similarity is naturally high. If the model's own answer indicates it
            // found nothing relevant, trust that judgment over the raw retrieval score.
            if (AnswerIndicatesNoEvidence(answer))
            {
                await LogQueryAsync(userId, request.Question, answer, "");
                return new QueryResponseDto
                {
                    Answer = "I couldn't find relevant information in the reference collection to answer this question. " +
                             "Try rephrasing, or upload a document covering this topic.",
                    Sources = new List<SourceReferenceDto>(),
                    HasSufficientEvidence = false
                };
            }

            var sourceIds = string.Join(",", relevantResults.Select(r => r.Chunk.Id));
            await LogQueryAsync(userId, request.Question, answer, sourceIds);

            return new QueryResponseDto
            {
                Answer = answer,
                HasSufficientEvidence = true,
                Sources = relevantResults.Select(r => new SourceReferenceDto
                {
                    ChunkId = r.Chunk.Id,
                    DocumentId = r.Chunk.DocumentId,
                    DocumentTitle = r.Chunk.Document.Title,
                    ExcerptText = r.Chunk.ChunkText.Length > 300 ? r.Chunk.ChunkText[..300] + "..." : r.Chunk.ChunkText,
                    RelevanceScore = Math.Round(r.Score, 3)
                }).ToList()
            };
        }

        private async Task<string> GenerateAnswerAsync(string question, List<DocumentChunk> evidenceChunks)
        {
            var apiKey = _config["AiSettings:ChatApiKey"];

            var contextBlock = new StringBuilder();
            for (int i = 0; i < evidenceChunks.Count; i++)
                contextBlock.AppendLine($"[Source {i + 1}] {evidenceChunks[i].ChunkText}");

            var systemPrompt =
                "You are a research assistant. Answer the user's question using ONLY the information in the " +
                "provided sources. Do not use outside knowledge and do not invent facts. If the sources do not " +
                "fully answer the question, say so explicitly. Cite sources inline like [Source 1].";

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogWarning("No chat API key configured; returning an extractive fallback summary.");
                return BuildExtractiveFallback(evidenceChunks);
            }

            try
            {
                // Gemini's generateContent API: API key is a query-string parameter (not a header),
                // and the request/response JSON shapes differ from Anthropic's Messages API.
                var model = _config["AiSettings:ChatModel"] ?? "gemini-3.5-flash";
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

                var requestBody = new
                {
                    systemInstruction = new { parts = new[] { new { text = systemPrompt } } },
                    contents = new[]
                    {
                        new
                        {
                            role = "user",
                            parts = new[] { new { text = $"Sources:\n{contextBlock}\n\nQuestion: {question}" } }
                        }
                    },
                    generationConfig = new
                    {
                        maxOutputTokens = 2048
                        // Note: thinkingConfig was attempted here to cap internal "thinking" tokens,
                        // but caused generateContent to fail on every call (confirmed via repeated
                        // extractive-fallback responses across both normal and edge-case questions).
                        // Removed — this API/model version likely doesn't accept that field in this
                        // shape. maxOutputTokens alone at 2048 has been sufficient for full answers.
                    }
                };

                var request = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
                };

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                using var stream = await response.Content.ReadAsStreamAsync();
                using var doc = await JsonDocument.ParseAsync(stream);

                var candidate = doc.RootElement.GetProperty("candidates")[0];

                // Diagnostic: log why generation stopped. "MAX_TOKENS" confirms the answer was
                // cut off by the token budget; "STOP" means the model finished normally; anything
                // else is worth investigating.
                if (candidate.TryGetProperty("finishReason", out var finishReasonProp))
                    _logger.LogInformation("Gemini generateContent finishReason: {FinishReason}", finishReasonProp.GetString());

                // Gemini can split the answer across multiple entries in content.parts (especially
                // for longer, structured responses). Reading only parts[0] silently truncates the
                // answer whenever this happens — concatenate all parts' text instead.
                var parts = candidate
                    .GetProperty("content")
                    .GetProperty("parts");

                var answerBuilder = new StringBuilder();
                foreach (var part in parts.EnumerateArray())
                {
                    if (part.TryGetProperty("text", out var textProp))
                        answerBuilder.Append(textProp.GetString());
                }

                return answerBuilder.ToString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Chat completion call failed; returning an extractive fallback summary.");
                return BuildExtractiveFallback(evidenceChunks);
            }
        }

        // If the LLM call is unavailable, still return a useful, grounded response
        // built directly from the retrieved evidence, so the pipeline degrades gracefully.
        private static string BuildExtractiveFallback(List<DocumentChunk> chunks)
        {
            var sb = new StringBuilder();
            sb.AppendLine("Based on the retrieved sources:");
            for (int i = 0; i < chunks.Count; i++)
                sb.AppendLine($"[Source {i + 1}] {chunks[i].ChunkText}");
            return sb.ToString();
        }

        // Lightweight heuristic: catches the model explicitly saying it found no relevant
        // information, which is a stronger signal than a raw similarity score in a small corpus.
        //
        // NOTE: exact-phrase matching is inherently brittle (e.g. "does not contain information"
        // misses "does not contain ANY information"). This checks for a negation word/phrase
        // co-occurring with an evidence-related word within the answer, which tolerates small
        // wording variation. It is still a heuristic, not a guarantee — see project limitations.
        private static bool AnswerIndicatesNoEvidence(string answer)
        {
            var lowered = answer.ToLowerInvariant();

            string[] negationMarkers =
            {
                "does not", "doesn't", "do not", "don't", "cannot", "can't",
                "no relevant", "no mention", "no information", "no data",
                "not covered", "not addressed", "unrelated to", "outside the scope"
            };

            string[] evidenceWords =
            {
                "information", "mention", "data", "answer", "address", "relevant"
            };

            return negationMarkers.Any(marker =>
            {
                var idx = lowered.IndexOf(marker, StringComparison.Ordinal);
                if (idx < 0) return false;

                // Look at a small window of text after the negation marker rather than
                // requiring the evidence word to sit immediately next to it.
                var windowEnd = Math.Min(lowered.Length, idx + marker.Length + 40);
                var window = lowered[idx..windowEnd];
                return evidenceWords.Any(word => window.Contains(word));
            });
        }

        private async Task LogQueryAsync(string userId, string question, string answer, string sourceChunkIds)
        {
            _context.QueryHistories.Add(new QueryHistory
            {
                UserId = userId,
                QuestionText = question,
                AnswerText = answer,
                SourceChunkIds = sourceChunkIds
            });
            await _context.SaveChangesAsync();
        }
    }
}
