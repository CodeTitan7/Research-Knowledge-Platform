namespace CompoundResearchAPI.Models.Enums
{
    // Mirrors the roles seeded into ASP.NET Core Identity.
    public static class UserRole
    {
        public const string ResearchUser = "ResearchUser";
        public const string Reviewer = "Reviewer";
        public const string Administrator = "Administrator";

        public static readonly string[] All = { ResearchUser, Reviewer, Administrator };
    }
}
