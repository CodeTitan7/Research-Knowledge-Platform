using CompoundResearchAPI.Data;
using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CompoundResearchAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // all authenticated roles can use the research Q&A feature
    public class QueryController : ControllerBase
    {
        private readonly IRagService _ragService;
        private readonly ApplicationDbContext _context;

        public QueryController(IRagService ragService, ApplicationDbContext context)
        {
            _ragService = ragService;
            _context = context;
        }

        // POST api/query/ask
        [HttpPost("ask")]
        public async Task<ActionResult<ApiResponse<QueryResponseDto>>> Ask(QueryRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<QueryResponseDto>.FailureResponse("Validation failed.",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? throw new UnauthorizedAccessException("Unable to identify the current user.");

            var response = await _ragService.AskAsync(request, userId);
            return Ok(ApiResponse<QueryResponseDto>.SuccessResponse(response));
        }

        // GET api/query/history
        [HttpGet("history")]
        public async Task<ActionResult<ApiResponse<List<object>>>> GetHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");

            bool isReviewerOrAdmin = User.IsInRole(Models.Enums.UserRole.Reviewer) || User.IsInRole(Models.Enums.UserRole.Administrator);

            var query = _context.QueryHistories.Include(q => q.User).AsQueryable();

            if (!isReviewerOrAdmin && !string.IsNullOrEmpty(userId))
            {
                query = query.Where(q => q.UserId == userId);
            }

            var history = await query
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new
                {
                    q.Id,
                    q.QuestionText,
                    q.AnswerText,
                    q.SourceChunkIds,
                    q.CreatedAt,
                    q.UserId,
                    UserEmail = q.User != null ? q.User.Email : null,
                    UserFullName = q.User != null ? q.User.FullName : null
                })
                .ToListAsync();

            return Ok(ApiResponse<List<object>>.SuccessResponse(history.Cast<object>().ToList()));
        }
    }
}

