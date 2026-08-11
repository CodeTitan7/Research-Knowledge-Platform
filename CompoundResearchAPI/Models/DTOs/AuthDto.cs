using System.ComponentModel.DataAnnotations;

namespace CompoundResearchAPI.Models.DTOs
{
    public class RegisterDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, StringLength(100, MinimumLength = 2)]
        public string FullName { get; set; } = string.Empty;

        [Required, StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;

        // Defaults to ResearchUser if not supplied; only an Administrator
        // should be able to set this to something else (enforced in service layer).
        public string? Role { get; set; }
    }

    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
