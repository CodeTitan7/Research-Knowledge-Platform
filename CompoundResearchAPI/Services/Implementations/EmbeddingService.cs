using System.Text.Json;
using CompoundResearchAPI.Services.Interfaces;

namespace CompoundResearchAPI.Services.Implementations
{
    // Wraps a call to an external embedding API (Gemini's embedContent endpoint).
    // A deterministic local fallback is used if no API key is configured, so the
    // app still runs offline for demos, but with weaker (keyword-overlap-only) matching.
    public class EmbeddingService : IEmbeddingService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<EmbeddingService> _logger;
        private const int LocalVectorSize = 128;

        public EmbeddingService(HttpClient httpClient, IConfiguration config, ILogger<EmbeddingService> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;
        }

        public async Task<float[]> GenerateEmbeddingAsync(string text)
        {
            var apiKey = _config["AiSettings:EmbeddingApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogWarning("No embedding API key configured; using local hash-based fallback embedding.");
                return GenerateLocalFallbackEmbedding(text);
            }

            try
            {
                // Gemini's embedContent API: API key is a query-string parameter, and the
                // request/response JSON shapes differ from OpenAI's /v1/embeddings endpoint.
                var model = _config["AiSettings:EmbeddingModel"] ?? "text-embedding-004";
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:embedContent?key={apiKey}";

                var requestBody = new
                {
                    content = new { parts = new[] { new { text } } }
                };

                var request = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent(JsonSerializer.Serialize(requestBody), System.Text.Encoding.UTF8, "application/json")
                };

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                using var stream = await response.Content.ReadAsStreamAsync();
                using var doc = await JsonDocument.ParseAsync(stream);
                var vector = doc.RootElement.GetProperty("embedding").GetProperty("values")
                    .EnumerateArray().Select(x => x.GetSingle()).ToArray();
                return vector;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Embedding API call failed, falling back to local embedding.");
                return GenerateLocalFallbackEmbedding(text);
            }
        }

        // Deterministic bag-of-words style vector so semantic search still works
        // (approximately, via term overlap) without a live API key during development.
        private static float[] GenerateLocalFallbackEmbedding(string text)
        {
            var vector = new float[LocalVectorSize];
            var words = text.ToLowerInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries);

            foreach (var word in words)
            {
                var bucket = Math.Abs(word.GetHashCode()) % LocalVectorSize;
                vector[bucket] += 1f;
            }

            var magnitude = (float)Math.Sqrt(vector.Sum(v => v * v));
            if (magnitude > 0)
                for (int i = 0; i < vector.Length; i++) vector[i] /= magnitude;

            return vector;
        }
    }
}