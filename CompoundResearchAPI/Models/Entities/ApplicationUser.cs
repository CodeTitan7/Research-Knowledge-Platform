using Microsoft.AspNetCore.Identity;

namespace CompoundResearchAPI.Models.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Compound> CreatedCompounds { get; set; } = new List<Compound>();
        public ICollection<Document> UploadedDocuments { get; set; } = new List<Document>();
        public ICollection<QueryHistory> Queries { get; set; } = new List<QueryHistory>();
    }
}
