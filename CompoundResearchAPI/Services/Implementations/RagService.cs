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

        public async Task<QueryResponseDto> AskAsync(QueryRequestDto request, string userId)
        {
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
                    generationConfig = new { maxOutputTokens = 600 }
                };

                var request = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
                };

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                using var stream = await response.Content.ReadAsStreamAsync();
                using var doc = await JsonDocument.ParseAsync(stream);

                return doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? "";
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
        private static bool AnswerIndicatesNoEvidence(string answer)
        {
            var lowered = answer.ToLowerInvariant();
            string[] noEvidencePhrases =
            {
                "no information", "no mention", "does not mention", "no relevant",
                "not mentioned", "cannot answer", "can't answer", "don't have information",
                "do not have information", "no data", "not covered", "not addressed"
            };
            return noEvidencePhrases.Any(phrase => lowered.Contains(phrase));
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