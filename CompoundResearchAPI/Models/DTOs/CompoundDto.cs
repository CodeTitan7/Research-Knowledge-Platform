using CompoundResearchAPI.Models.Enums;

namespace CompoundResearchAPI.Models.DTOs
{
    public class CompoundDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Synonym { get; set; }
        public string? Description { get; set; }
        public string? MolecularFormula { get; set; }
        public string? CategoryName { get; set; }
        public CompoundStatus Status { get; set; }
        public List<string> Targets { get; set; } = new();
        public string? CreatedByName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
