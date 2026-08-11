using CompoundResearchAPI.Models.DTOs;
using Microsoft.AspNetCore.Http;

namespace CompoundResearchAPI.Services.Interfaces
{
    public interface IDocumentService
    {
        Task<List<DocumentDto>> GetAllAsync();
        Task<DocumentDto> UploadAsync(IFormFile file, UploadDocumentDto dto, string userId);
        Task DeleteAsync(int id);
    }
}
