using Microsoft.AspNetCore.Http;

namespace CompoundResearchAPI.Validators
{
    public static class DocumentUploadValidator
    {
        private static readonly string[] AllowedExtensions = { ".txt", ".pdf", ".docx" };
        private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

        public static List<string> Validate(IFormFile? file)
        {
            var errors = new List<string>();

            if (file is null || file.Length == 0)
            {
                errors.Add("A non-empty file is required.");
                return errors;
            }

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                errors.Add($"Unsupported file type '{ext}'. Allowed types: {string.Join(", ", AllowedExtensions)}");

            if (file.Length > MaxFileSizeBytes)
                errors.Add("File exceeds the 10 MB size limit.");

            return errors;
        }
    }
}
