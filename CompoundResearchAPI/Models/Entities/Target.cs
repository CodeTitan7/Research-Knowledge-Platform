namespace CompoundResearchAPI.Models.Entities
{
    public class Target
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public ICollection<CompoundTarget> CompoundTargets { get; set; } = new List<CompoundTarget>();
    }
}
