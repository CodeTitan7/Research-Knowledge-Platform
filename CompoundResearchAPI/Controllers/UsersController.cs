using CompoundResearchAPI.Helpers;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CompoundResearchAPI.Controllers
{
    // Administrator-only: list users and manage their role/active status.
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = UserRole.Administrator)]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public UsersController(UserManager<ApplicationUser> userManager) => _userManager = userManager;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<object>>>> GetAll()
        {
            var users = _userManager.Users.ToList();
            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new
                {
                    user.Id,
                    user.Email,
                    user.FullName,
                    user.IsActive,
                    Roles = roles
                });
            }

            return Ok(ApiResponse<List<object>>.SuccessResponse(result));
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> ChangeRole(string id, [FromBody] string newRole)
        {
            if (!UserRole.All.Contains(newRole))
                return BadRequest(ApiResponse<object>.FailureResponse($"Invalid role '{newRole}'."));

            var user = await _userManager.FindByIdAsync(id)
                ?? throw new KeyNotFoundException($"User {id} not found.");

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, newRole);

            return Ok(ApiResponse<object>.SuccessResponse(null!, $"Role updated to {newRole}."));
        }

        [HttpPut("{id}/active")]
        public async Task<IActionResult> SetActive(string id, [FromBody] bool isActive)
        {
            var user = await _userManager.FindByIdAsync(id)
                ?? throw new KeyNotFoundException($"User {id} not found.");

            user.IsActive = isActive;
            await _userManager.UpdateAsync(user);

            return Ok(ApiResponse<object>.SuccessResponse(null!, $"User {(isActive ? "activated" : "deactivated")}."));
        }
    }
}
