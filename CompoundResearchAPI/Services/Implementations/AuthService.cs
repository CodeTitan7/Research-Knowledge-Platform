using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Models.Enums;
using CompoundResearchAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace CompoundResearchAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;

        public AuthService(UserManager<ApplicationUser> userManager, IConfiguration config, ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _config = config;
            _logger = logger;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            if (await _userManager.FindByEmailAsync(dto.Email) is not null)
                throw new InvalidOperationException("A user with this email already exists.");

            // Public self-registration is always a Research User; only an Administrator
            // can promote someone to Reviewer/Administrator via the Users management endpoint.
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                throw new InvalidOperationException(string.Join("; ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, UserRole.ResearchUser);
            _logger.LogInformation("New user registered: {Email}", dto.Email);

            return await BuildAuthResponseAsync(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email)
                ?? throw new UnauthorizedAccessException("Invalid email or password.");

            if (!user.IsActive)
                throw new UnauthorizedAccessException("This account has been deactivated.");

            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!validPassword)
                throw new UnauthorizedAccessException("Invalid email or password.");

            return await BuildAuthResponseAsync(user);
        }

        private async Task<AuthResponseDto> BuildAuthResponseAsync(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? UserRole.ResearchUser;

            var jwtSettings = _config.GetSection("JwtSettings");
            var expiryMinutes = int.Parse(jwtSettings["ExpiryMinutes"] ?? "120");
            var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new(ClaimTypes.Name, user.FullName),
                new(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: expiresAt,
                signingCredentials: creds);

            return new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expiresAt,
                Email = user.Email ?? "",
                FullName = user.FullName,
                Role = role
            };
        }
    }
}
