namespace CompoundResearchAPI.Models.Entities
{
    // Join entity: many-to-many between Compound and Target,
    // also used to model compound <-> disease relationships via Target.Name convention
    // or extended with a RelationType field if needed.
    public class CompoundTarget
    {
        public int CompoundId { get; set; }
        public Compound Compound { get; set; } = null!;

        public int TargetId { get; set; }
        public Target Target { get; set; } = null!;

        public string? RelationshipType { get; set; } // e.g. "Inhibitor", "Agonist", "Associated Disease"
    }
}
