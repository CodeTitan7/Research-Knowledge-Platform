using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CompoundResearchAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService) => _authService = authService;

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register(RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AuthResponseDto>.FailureResponse("Validation failed.",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));

            var result = await _authService.RegisterAsync(dto);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Registration successful."));
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login(LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Login successful."));
        }
    }
}
