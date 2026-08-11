using CompoundResearchAPI.Models.Entities;

namespace CompoundResearchAPI.Repositories.Interfaces
{
    public interface IDocumentRepository
    {
        Task<Document?> GetByIdAsync(int id);
        Task<List<Document>> GetAllAsync();
        Task<Document> AddAsync(Document document);
        Task DeleteAsync(Document document);
    }
}
