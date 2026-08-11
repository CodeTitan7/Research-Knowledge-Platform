using CompoundResearchAPI.Models.Enums;

namespace CompoundResearchAPI.Models.Entities
{
    public class Compound
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Synonym { get; set; }
        public string? Description { get; set; }
        public string? MolecularFormula { get; set; }

        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public CompoundStatus Status { get; set; } = CompoundStatus.Draft;
        public string? ReviewComments { get; set; }

        public string CreatedById { get; set; } = string.Empty;
        public ApplicationUser? CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public ICollection<CompoundTarget> CompoundTargets { get; set; } = new List<CompoundTarget>();
        public ICollection<Document> RelatedDocuments { get; set; } = new List<Document>();
    }
}
