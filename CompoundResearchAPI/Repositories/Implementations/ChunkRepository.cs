using CompoundResearchAPI.Data;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CompoundResearchAPI.Repositories.Implementations
{
    public class ChunkRepository : IChunkRepository
    {
        private readonly ApplicationDbContext _context;
        public ChunkRepository(ApplicationDbContext context) => _context = context;

        public async Task AddRangeAsync(IEnumerable<DocumentChunk> chunks)
        {
            _context.DocumentChunks.AddRange(chunks);
            await _context.SaveChangesAsync();
        }

        public async Task<List<DocumentChunk>> GetChunksAsync(int? relatedCompoundId = null)
        {
            var query = _context.DocumentChunks.Include(c => c.Document).AsQueryable();

            if (relatedCompoundId.HasValue)
                query = query.Where(c => c.Document.RelatedCompoundId == relatedCompoundId);

            return await query.ToListAsync();
        }
    }
}
