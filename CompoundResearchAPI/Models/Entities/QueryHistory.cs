namespace CompoundResearchAPI.Models.Entities
{
    public class QueryHistory
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }

        public string QuestionText { get; set; } = string.Empty;
        public string AnswerText { get; set; } = string.Empty;

        // Comma-separated DocumentChunk IDs used as evidence for this answer.
        public string SourceChunkIds { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
