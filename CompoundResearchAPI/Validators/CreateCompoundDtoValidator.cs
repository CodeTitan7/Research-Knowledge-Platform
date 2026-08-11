using CompoundResearchAPI.Models.DTOs;

namespace CompoundResearchAPI.Validators
{
    // Lightweight manual validation beyond DataAnnotations, for rules that
    // need database access or cross-field logic. Called explicitly from the service/controller.
    public static class CreateCompoundDtoValidator
    {
        public static List<string> Validate(CreateCompoundDto dto)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(dto.Name))
                errors.Add("Compound name is required.");

            if (dto.MolecularFormula is not null && dto.MolecularFormula.Any(char.IsWhiteSpace))
                errors.Add("Molecular formula should not contain spaces.");

            if (dto.TargetIds.Count != dto.TargetIds.Distinct().Count())
                errors.Add("Duplicate target IDs are not allowed.");

            return errors;
        }
    }
}
