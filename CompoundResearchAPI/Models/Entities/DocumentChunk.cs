namespace CompoundResearchAPI.Models.Entities
{
    public class DocumentChunk
    {
        public int Id { get; set; }

        public int DocumentId { get; set; }
        public Document Document { get; set; } = null!;

        public int ChunkIndex { get; set; }
        public string ChunkText { get; set; } = string.Empty;

        // Embedding vector stored as a comma-separated string (SQL Server has no native vector type
        // in this scope). For larger datasets, swap for a dedicated vector store.
        public string EmbeddingVector { get; set; } = string.Empty;
    }
}
