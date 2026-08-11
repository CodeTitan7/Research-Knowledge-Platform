namespace CompoundResearchAPI.Models.Entities
{
    public class Document
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string? ContentType { get; set; }

        public int? RelatedCompoundId { get; set; }
        public Compound? RelatedCompound { get; set; }

        public string UploadedById { get; set; } = string.Empty;
        public ApplicationUser? UploadedBy { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        public ICollection<DocumentChunk> Chunks { get; set; } = new List<DocumentChunk>();
    }
}
