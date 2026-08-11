using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Models.Enums;
using Microsoft.AspNetCore.Identity;

namespace CompoundResearchAPI.Data.Seed
{
    // Run once at startup (Development only) to create roles, an admin user,
    // and a small curated sample dataset for demoing the app.
    public static class DbSeeder
    {
        public static async Task SeedAsync(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            // 1. Roles
            foreach (var role in UserRole.All)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // 2. Default admin user
            if (await userManager.FindByEmailAsync("admin@compoundresearch.local") is null)
            {
                var admin = new ApplicationUser
                {
                    UserName = "admin@compoundresearch.local",
                    Email = "admin@compoundresearch.local",
                    FullName = "System Administrator",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(admin, "Admin@12345");
                if (result.Succeeded)
                    await userManager.AddToRoleAsync(admin, UserRole.Administrator);
            }

            if (context.Categories.Any()) return; // already seeded sample data

            // 3. Sample categories
            var biguanide = new Category { Name = "Biguanide", Description = "Antihyperglycemic agents" };
            var kinaseInhibitor = new Category { Name = "Tyrosine Kinase Inhibitor", Description = "Targeted cancer therapy" };
            var statin = new Category { Name = "Statin", Description = "Lipid-lowering agents" };
            context.Categories.AddRange(biguanide, kinaseInhibitor, statin);

            // 4. Sample targets
            var ampk = new Target { Name = "AMPK", Description = "AMP-activated protein kinase" };
            var bcrAbl = new Target { Name = "BCR-ABL", Description = "Fusion protein tyrosine kinase" };
            var hmgcoa = new Target { Name = "HMG-CoA Reductase", Description = "Rate-limiting enzyme in cholesterol synthesis" };
            context.Targets.AddRange(ampk, bcrAbl, hmgcoa);
            await context.SaveChangesAsync();

            var adminUser = await userManager.FindByEmailAsync("admin@compoundresearch.local");

            // 5. Sample compounds
            var metformin = new Compound
            {
                Name = "Metformin",
                Synonym = "Dimethylbiguanide",
                Description = "Oral antihyperglycemic agent used primarily in type 2 diabetes management.",
                MolecularFormula = "C4H11N5",
                Category = biguanide,
                Status = CompoundStatus.Approved,
                CreatedById = adminUser!.Id,
                CompoundTargets = new List<CompoundTarget> { new() { Target = ampk, RelationshipType = "Activator" } }
            };

            var imatinib = new Compound
            {
                Name = "Imatinib",
                Description = "Tyrosine kinase inhibitor used in chronic myeloid leukemia treatment.",
                MolecularFormula = "C29H31N7O",
                Category = kinaseInhibitor,
                Status = CompoundStatus.Approved,
                CreatedById = adminUser.Id,
                CompoundTargets = new List<CompoundTarget> { new() { Target = bcrAbl, RelationshipType = "Inhibitor" } }
            };

            var atorvastatin = new Compound
            {
                Name = "Atorvastatin",
                Description = "Statin used to lower blood cholesterol.",
                MolecularFormula = "C33H35FN2O5",
                Category = statin,
                Status = CompoundStatus.Approved,
                CreatedById = adminUser.Id,
                CompoundTargets = new List<CompoundTarget> { new() { Target = hmgcoa, RelationshipType = "Inhibitor" } }
            };

            context.Compounds.AddRange(metformin, imatinib, atorvastatin);
            await context.SaveChangesAsync();
        }
    }
}
