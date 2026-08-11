using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CompoundResearchAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // all authenticated roles can use the research Q&A feature
    public class QueryController : ControllerBase
    {
        private readonly IRagService _ragService;
        public QueryController(IRagService ragService) => _ragService = ragService;

        // POST api/query/ask
        [HttpPost("ask")]
        public async Task<ActionResult<ApiResponse<QueryResponseDto>>> Ask(QueryRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<QueryResponseDto>.FailureResponse("Validation failed.",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("Unable to identify the current user.");

            var response = await _ragService.AskAsync(request, userId);
            return Ok(ApiResponse<QueryResponseDto>.SuccessResponse(response));
        }
    }
}
