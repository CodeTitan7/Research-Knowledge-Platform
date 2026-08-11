using CompoundResearchAPI.Data;
using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CompoundResearchAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CategoriesController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Category>>>> GetAll()
        {
            var categories = await _context.Categories.OrderBy(c => c.Name).ToListAsync();
            return Ok(ApiResponse<List<Category>>.SuccessResponse(categories));
        }

        [HttpPost]
        [Authorize(Roles = $"{Models.Enums.UserRole.Reviewer},{Models.Enums.UserRole.Administrator}")]
        public async Task<ActionResult<ApiResponse<Category>>> Create(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<Category>.SuccessResponse(category, "Category created."));
        }
    }
}
