using CompoundResearchAPI.Data;
using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CompoundResearchAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TargetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TargetsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Target>>>> GetAll()
        {
            var targets = await _context.Targets.OrderBy(t => t.Name).ToListAsync();
            return Ok(ApiResponse<List<Target>>.SuccessResponse(targets));
        }

        [HttpPost]
        [Authorize(Roles = UserRole.Administrator)]
        public async Task<ActionResult<ApiResponse<Target>>> Create(Target target)
        {
            _context.Targets.Add(target);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<Target>.SuccessResponse(target, "Target created."));
        }
    }
}
