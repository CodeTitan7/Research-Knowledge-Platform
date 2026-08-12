using CompoundResearchAPI.Data;
using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CompoundResearchAPI.Controllers
{
    public class DashboardStatsDto
    {
        public int Compounds { get; set; }
        public int Targets { get; set; }
        public int Documents { get; set; }
        public int Queries { get; set; }
        public List<RecentCompoundDto> RecentCompounds { get; set; } = new();
    }

    public class RecentCompoundDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Identifier { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public DashboardController(ApplicationDbContext context) => _context = context;

        [HttpGet("stats")]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetStats()
        {
            var compoundsCount = await _context.Compounds.CountAsync();
            var targetsCount = await _context.Targets.CountAsync();
            var documentsCount = await _context.Documents.CountAsync();
            var queriesCount = await _context.QueryHistories.CountAsync();

            var recentCompoundsRaw = await _context.Compounds
                .Include(c => c.Category)
                .Include(c => c.CompoundTargets)
                    .ThenInclude(ct => ct.Target)
                .OrderByDescending(c => c.CreatedAt)
                .Take(5)
                .ToListAsync();

            var recentCompounds = recentCompoundsRaw.Select(c => new RecentCompoundDto
            {
                Id = c.Id,
                Name = c.Name,
                Identifier = c.MolecularFormula ?? c.Synonym ?? $"CMP-{c.Id:D3}",
                Target = c.CompoundTargets.FirstOrDefault()?.Target?.Name ?? "Unassigned",
                Category = c.Category?.Name ?? "General"
            }).ToList();

            var stats = new DashboardStatsDto
            {
                Compounds = compoundsCount,
                Targets = targetsCount,
                Documents = documentsCount,
                Queries = queriesCount,
                RecentCompounds = recentCompounds
            };

            return Ok(ApiResponse<DashboardStatsDto>.SuccessResponse(stats));
        }
    }
}
