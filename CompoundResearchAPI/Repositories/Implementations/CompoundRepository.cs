using CompoundResearchAPI.Data;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Models.Enums;
using CompoundResearchAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CompoundResearchAPI.Repositories.Implementations
{
    public class CompoundRepository : ICompoundRepository
    {
        private readonly ApplicationDbContext _context;
        public CompoundRepository(ApplicationDbContext context) => _context = context;

        public async Task<Compound?> GetByIdAsync(int id) =>
            await _context.Compounds
                .Include(c => c.Category)
                .Include(c => c.CreatedBy)
                .Include(c => c.CompoundTargets).ThenInclude(ct => ct.Target)
                .FirstOrDefaultAsync(c => c.Id == id);

        public async Task<List<Compound>> SearchAsync(string? name, int? categoryId, int? targetId, CompoundStatus? status)
        {
            var query = _context.Compounds
                .Include(c => c.Category)
                .Include(c => c.CreatedBy)
                .Include(c => c.CompoundTargets).ThenInclude(ct => ct.Target)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(c => c.Name.Contains(name) || (c.Synonym != null && c.Synonym.Contains(name)));

            if (categoryId.HasValue)
                query = query.Where(c => c.CategoryId == categoryId);

            if (targetId.HasValue)
                query = query.Where(c => c.CompoundTargets.Any(ct => ct.TargetId == targetId));

            if (status.HasValue)
                query = query.Where(c => c.Status == status);

            return await query.OrderBy(c => c.Name).ToListAsync();
        }

        public async Task<Compound> AddAsync(Compound compound)
        {
            _context.Compounds.Add(compound);
            await _context.SaveChangesAsync();
            return compound;
        }

        public async Task UpdateAsync(Compound compound)
        {
            compound.UpdatedAt = DateTime.UtcNow;
            _context.Compounds.Update(compound);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Compound compound)
        {
            _context.Compounds.Remove(compound);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null) =>
            await _context.Compounds.AnyAsync(c => c.Name == name && c.Id != excludeId);
    }
}
