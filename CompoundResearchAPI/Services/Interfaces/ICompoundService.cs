using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Models.Enums;

namespace CompoundResearchAPI.Services.Interfaces
{
    public interface ICompoundService
    {
        Task<CompoundDto?> GetByIdAsync(int id);
        Task<List<CompoundDto>> SearchAsync(string? name, int? categoryId, int? targetId, CompoundStatus? status);
        Task<CompoundDto> CreateAsync(CreateCompoundDto dto, string userId);
        Task<CompoundDto> UpdateAsync(int id, UpdateCompoundDto dto);
        Task DeleteAsync(int id);
        Task<CompoundDto> ReviewAsync(int id, ReviewCompoundDto dto);
    }
}
