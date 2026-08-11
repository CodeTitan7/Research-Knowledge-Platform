namespace CompoundResearchAPI.Models.DTOs
{
    public class DocumentDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string? RelatedCompoundName { get; set; }
        public string? UploadedByName { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class UploadDocumentDto
    {
        public string Title { get; set; } = string.Empty;
        public int? RelatedCompoundId { get; set; }
    }
}
