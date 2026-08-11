using System.ComponentModel.DataAnnotations;

namespace CompoundResearchAPI.Models.DTOs
{
    public class CreateCompoundDto
    {
        [Required, StringLength(200, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Synonym { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? MolecularFormula { get; set; }

        public int? CategoryId { get; set; }

        public List<int> TargetIds { get; set; } = new();
    }

    public class UpdateCompoundDto : CreateCompoundDto
    {
    }

    public class ReviewCompoundDto
    {
        [Required]
        public bool Approve { get; set; }

        [StringLength(1000)]
        public string? Comments { get; set; }
    }
}
