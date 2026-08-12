using System.ComponentModel.DataAnnotations;

namespace CompoundResearchAPI.Models.DTOs
{
    public class QueryRequestDto
    {
        [Required, StringLength(1000, MinimumLength = 2)]
        public string Question { get; set; } = string.Empty;

        // Optional: narrow the search to documents linked to a specific compound.
        public int? CompoundId { get; set; }
    }
}
