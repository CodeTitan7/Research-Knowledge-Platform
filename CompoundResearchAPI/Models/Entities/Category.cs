namespace CompoundResearchAPI.Models.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public ICollection<Compound> Compounds { get; set; } = new List<Compound>();
    }
}
