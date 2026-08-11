using CompoundResearchAPI.Models.DTOs;

namespace CompoundResearchAPI.Services.Interfaces
{
    public interface IRagService
    {
        Task<QueryResponseDto> AskAsync(QueryRequestDto request, string userId);
    }
}
