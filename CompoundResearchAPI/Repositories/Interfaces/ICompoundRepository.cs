using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Models.Enums;

namespace CompoundResearchAPI.Repositories.Interfaces
{
    public interface ICompoundRepository
    {
        Task<Compound?> GetByIdAsync(int id);
        Task<List<Compound>> SearchAsync(string? name, int? categoryId, int? targetId, CompoundStatus? status);
        Task<Compound> AddAsync(Compound compound);
        Task UpdateAsync(Compound compound);
        Task DeleteAsync(Compound compound);
        Task<bool> ExistsByNameAsync(string name, int? excludeId = null);
    }
}
