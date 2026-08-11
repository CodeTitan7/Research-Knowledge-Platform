using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Repositories.Interfaces;
using CompoundResearchAPI.Services.Interfaces;
using Microsoft.AspNetCore.Http;

namespace CompoundResearchAPI.Services.Implementations
{
    public class DocumentService : IDocumentService
    {
        private const int ChunkSizeChars = 800; // simple fixed-size chunking for MVP scope

        private readonly IDocumentRepository _documentRepository;
        private readonly IChunkRepository _chunkRepository;
        private readonly IEmbeddingService _embeddingService;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<DocumentService> _logger;

        public DocumentService(
            IDocumentRepository documentRepository,
            IChunkRepository chunkRepository,
            IEmbeddingService embeddingService,
            IWebHostEnvironment env,
            ILogger<DocumentService> logger)
        {
            _documentRepository = documentRepository;
            _chunkRepository = chunkRepository;
            _embeddingService = embeddingService;
            _env = env;
            _logger = logger;
        }

        public async Task<List<DocumentDto>> GetAllAsync()
        {
            var docs = await _documentRepository.GetAllAsync();
            return docs.Select(MapToDto).ToList();
        }

        public async Task<DocumentDto> UploadAsync(IFormFile file, UploadDocumentDto dto, string userId)
        {
            if (file is null || file.Length == 0)
                throw new InvalidOperationException("No file was uploaded or the file is empty.");

            var allowedExtensions = new[] { ".txt", ".pdf", ".docx" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext))
                throw new InvalidOperationException($"Unsupported file type '{ext}'. Allowed: {string.Join(", ", allowedExtensions)}");

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Storage", "Documents");
            Directory.CreateDirectory(uploadsFolder);

            var storedFileName = $"{Guid.NewGuid()}{ext}";
            var fullPath = Path.Combine(uploadsFolder, storedFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
                await file.CopyToAsync(stream);

            var document = new Document
            {
                Title = string.IsNullOrWhiteSpace(dto.Title) ? file.FileName : dto.Title,
                FileName = file.FileName,
                FilePath = fullPath,
                ContentType = file.ContentType,
                RelatedCompoundId = dto.RelatedCompoundId,
                UploadedById = userId
            };

            var saved = await _documentRepository.AddAsync(document);

            // AddAsync doesn't populate navigation properties on the in-memory entity,
            // so re-fetch with Includes before mapping to the response DTO.
            var reloaded = await _documentRepository.GetByIdAsync(saved.Id) ?? saved;

            // Only plain text is parsed for MVP; PDFs/DOCX would need an extraction step.
            if (ext == ".txt")
            {
                var text = await File.ReadAllTextAsync(fullPath);
                await ChunkAndEmbedAsync(saved.Id, text);
            }

            _logger.LogInformation("Document {Title} uploaded by user {UserId}", saved.Title, userId);
            return MapToDto(reloaded);
        }

        public async Task DeleteAsync(int id)
        {
            var document = await _documentRepository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"Document {id} not found.");

            if (File.Exists(document.FilePath))
                File.Delete(document.FilePath);

            await _documentRepository.DeleteAsync(document);
        }

        private async Task ChunkAndEmbedAsync(int documentId, string text)
        {
            var chunks = new List<DocumentChunk>();
            var index = 0;

            for (int i = 0; i < text.Length; i += ChunkSizeChars)
            {
                var chunkText = text.Substring(i, Math.Min(ChunkSizeChars, text.Length - i)).Trim();
                if (chunkText.Length == 0) continue;

                var embedding = await _embeddingService.GenerateEmbeddingAsync(chunkText);
                chunks.Add(new DocumentChunk
                {
                    DocumentId = documentId,
                    ChunkIndex = index++,
                    ChunkText = chunkText,
                    EmbeddingVector = Helpers.VectorMathHelper.ToStorageString(embedding)
                });
            }

            if (chunks.Count > 0)
                await _chunkRepository.AddRangeAsync(chunks);
        }

        private static DocumentDto MapToDto(Document d) => new()
        {
            Id = d.Id,
            Title = d.Title,
            FileName = d.FileName,
            RelatedCompoundName = d.RelatedCompound?.Name,
            UploadedByName = d.UploadedBy?.FullName,
            UploadedAt = d.UploadedAt
        };
    }
}