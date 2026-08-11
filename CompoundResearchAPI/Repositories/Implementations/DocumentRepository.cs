using CompoundResearchAPI.Data;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CompoundResearchAPI.Repositories.Implementations
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly ApplicationDbContext _context;
        public DocumentRepository(ApplicationDbContext context) => _context = context;

        public async Task<Document?> GetByIdAsync(int id) =>
            await _context.Documents
                .Include(d => d.RelatedCompound)
                .Include(d => d.UploadedBy)
                .FirstOrDefaultAsync(d => d.Id == id);

        public async Task<List<Document>> GetAllAsync() =>
            await _context.Documents
                .Include(d => d.RelatedCompound)
                .Include(d => d.UploadedBy)
                .OrderByDescending(d => d.UploadedAt)
                .ToListAsync();

        public async Task<Document> AddAsync(Document document)
        {
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();
            return document;
        }

        public async Task DeleteAsync(Document document)
        {
            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();
        }
    }
}
