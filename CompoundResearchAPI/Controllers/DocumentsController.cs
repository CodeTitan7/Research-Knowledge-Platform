using CompoundResearchAPI.Data;
using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Models.Enums;
using CompoundResearchAPI.Services.Interfaces;
using CompoundResearchAPI.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CompoundResearchAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _documentService;
        private readonly ApplicationDbContext _context;

        public DocumentsController(IDocumentService documentService, ApplicationDbContext context)
        {
            _documentService = documentService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<DocumentDto>>>> GetAll()
        {
            var docs = await _documentService.GetAllAsync();
            return Ok(ApiResponse<List<DocumentDto>>.SuccessResponse(docs));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<object>>> GetById(int id)
        {
            var doc = await _context.Documents
                .Include(d => d.RelatedCompound)
                .Include(d => d.UploadedBy)
                .Include(d => d.Chunks)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doc is null)
                return NotFound(ApiResponse<object>.FailureResponse($"Document {id} not found."));

            var detail = new
            {
                doc.Id,
                doc.Title,
                doc.FileName,
                doc.ContentType,
                doc.RelatedCompoundId,
                RelatedCompoundName = doc.RelatedCompound?.Name,
                UploadedByName = doc.UploadedBy?.FullName,
                doc.UploadedAt,
                ChunksCount = doc.Chunks.Count,
                Chunks = doc.Chunks.OrderBy(c => c.ChunkIndex).Select(c => new
                {
                    c.Id,
                    c.ChunkIndex,
                    c.ChunkText
                }).ToList()
            };

            return Ok(ApiResponse<object>.SuccessResponse(detail));
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
                ?? User.FindFirstValue("sub")
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

