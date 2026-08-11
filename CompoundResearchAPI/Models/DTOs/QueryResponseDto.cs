namespace CompoundResearchAPI.Models.DTOs
{
    public class QueryResponseDto
    {
        public string Answer { get; set; } = string.Empty;
        public List<SourceReferenceDto> Sources { get; set; } = new();
        public bool HasSufficientEvidence { get; set; }
    }

    public class SourceReferenceDto
    {
        public int ChunkId { get; set; }
        public int DocumentId { get; set; }
        public string DocumentTitle { get; set; } = string.Empty;
        public string ExcerptText { get; set; } = string.Empty;
        public double RelevanceScore { get; set; }
    }
}
