using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Models.Enums;
using CompoundResearchAPI.Services.Interfaces;
using CompoundResearchAPI.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CompoundResearchAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _documentService;
        public DocumentsController(IDocumentService documentService) => _documentService = documentService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<DocumentDto>>>> GetAll()
        {
            var docs = await _documentService.GetAllAsync();
            return Ok(ApiResponse<List<DocumentDto>>.SuccessResponse(docs));
        }

        [HttpPost("upload")]
        [Authorize(Roles = $"{UserRole.ResearchUser},{UserRole.Administrator}")]
        [RequestSizeLimit(10_000_000)]
        public async Task<ActionResult<ApiResponse<DocumentDto>>> Upload([FromForm] IFormFile file, [FromForm] UploadDocumentDto dto)
        {
            var errors = DocumentUploadValidator.Validate(file);
            if (errors.Count > 0)
                return BadRequest(ApiResponse<DocumentDto>.FailureResponse("Validation failed.", errors));

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("Unable to identify the current user.");

            var uploaded = await _documentService.UploadAsync(file, dto, userId);
            return Ok(ApiResponse<DocumentDto>.SuccessResponse(uploaded, "Document uploaded and indexed."));
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = UserRole.Administrator)]
        public async Task<IActionResult> Delete(int id)
        {
            await _documentService.DeleteAsync(id);
            return NoContent();
        }
    }
}
