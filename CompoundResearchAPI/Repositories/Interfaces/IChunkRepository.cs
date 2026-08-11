using CompoundResearchAPI.Models.Entities;

namespace CompoundResearchAPI.Repositories.Interfaces
{
    public interface IChunkRepository
    {
        Task AddRangeAsync(IEnumerable<DocumentChunk> chunks);

        // Returns all chunks, optionally restricted to documents linked to a given compound.
        // Simple in-memory similarity search is used at this project's scale.
        Task<List<DocumentChunk>> GetChunksAsync(int? relatedCompoundId = null);
    }
}
