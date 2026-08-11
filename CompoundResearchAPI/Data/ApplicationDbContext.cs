using CompoundResearchAPI.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CompoundResearchAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Compound> Compounds => Set<Compound>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Target> Targets => Set<Target>();
        public DbSet<CompoundTarget> CompoundTargets => Set<CompoundTarget>();
        public DbSet<Document> Documents => Set<Document>();
        public DbSet<DocumentChunk> DocumentChunks => Set<DocumentChunk>();
        public DbSet<QueryHistory> QueryHistories => Set<QueryHistory>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Composite key for the join entity
            builder.Entity<CompoundTarget>()
                .HasKey(ct => new { ct.CompoundId, ct.TargetId });

            builder.Entity<CompoundTarget>()
                .HasOne(ct => ct.Compound)
                .WithMany(c => c.CompoundTargets)
                .HasForeignKey(ct => ct.CompoundId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CompoundTarget>()
                .HasOne(ct => ct.Target)
                .WithMany(t => t.CompoundTargets)
                .HasForeignKey(ct => ct.TargetId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Compound>()
                .HasOne(c => c.Category)
                .WithMany(cat => cat.Compounds)
                .HasForeignKey(c => c.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Compound>()
                .HasOne(c => c.CreatedBy)
                .WithMany(u => u.CreatedCompounds)
                .HasForeignKey(c => c.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Document>()
                .HasOne(d => d.RelatedCompound)
                .WithMany(c => c.RelatedDocuments)
                .HasForeignKey(d => d.RelatedCompoundId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Document>()
                .HasOne(d => d.UploadedBy)
                .WithMany(u => u.UploadedDocuments)
                .HasForeignKey(d => d.UploadedById)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<DocumentChunk>()
                .HasOne(dc => dc.Document)
                .WithMany(d => d.Chunks)
                .HasForeignKey(dc => dc.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<QueryHistory>()
                .HasOne(q => q.User)
                .WithMany(u => u.Queries)
                .HasForeignKey(q => q.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Compound>().HasIndex(c => c.Name);
            builder.Entity<Compound>().HasIndex(c => c.Status);
        }
    }
}
