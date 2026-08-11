using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Models.Enums;
using CompoundResearchAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CompoundResearchAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CompoundsController : ControllerBase
    {
        private readonly ICompoundService _compoundService;
        public CompoundsController(ICompoundService compoundService) => _compoundService = compoundService;

        // GET api/compounds?name=metformin&categoryId=1&targetId=2&status=Approved
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CompoundDto>>>> Search(
            [FromQuery] string? name, [FromQuery] int? categoryId, [FromQuery] int? targetId, [FromQuery] CompoundStatus? status)
        {
            var results = await _compoundService.SearchAsync(name, categoryId, targetId, status);
            return Ok(ApiResponse<List<CompoundDto>>.SuccessResponse(results));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<CompoundDto>>> GetById(int id)
        {
            var compound = await _compoundService.GetByIdAsync(id);
            if (compound is null)
                return NotFound(ApiResponse<CompoundDto>.FailureResponse($"Compound {id} not found."));

            return Ok(ApiResponse<CompoundDto>.SuccessResponse(compound));
        }

        [HttpPost]
        [Authorize(Roles = $"{UserRole.Reviewer},{UserRole.Administrator}")]
        public async Task<ActionResult<ApiResponse<CompoundDto>>> Create(CreateCompoundDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<CompoundDto>.FailureResponse("Validation failed.",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? throw new UnauthorizedAccessException("Unable to identify the current user.");

            var created = await _compoundService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, ApiResponse<CompoundDto>.SuccessResponse(created, "Compound created."));
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = $"{UserRole.Reviewer},{UserRole.Administrator}")]
        public async Task<ActionResult<ApiResponse<CompoundDto>>> Update(int id, UpdateCompoundDto dto)
        {
            var updated = await _compoundService.UpdateAsync(id, dto);
            return Ok(ApiResponse<CompoundDto>.SuccessResponse(updated, "Compound updated."));
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = $"{UserRole.Reviewer},{UserRole.Administrator}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _compoundService.DeleteAsync(id);
            return NoContent();
        }

        // Reviewer/Admin approve or reject a compound that's pending review.
        [HttpPost("{id:int}/review")]
        [Authorize(Roles = $"{UserRole.Reviewer},{UserRole.Administrator}")]
        public async Task<ActionResult<ApiResponse<CompoundDto>>> Review(int id, ReviewCompoundDto dto)
        {
            var reviewed = await _compoundService.ReviewAsync(id, dto);
            return Ok(ApiResponse<CompoundDto>.SuccessResponse(reviewed, "Review recorded."));
        }
    }
}
