using CompoundResearchAPI.Data;
using CompoundResearchAPI.Models.DTOs;
using CompoundResearchAPI.Models.Entities;
using CompoundResearchAPI.Models.Enums;
using CompoundResearchAPI.Repositories.Interfaces;
using CompoundResearchAPI.Services.Interfaces;

namespace CompoundResearchAPI.Services.Implementations
{
    public class CompoundService : ICompoundService
    {
        private readonly ICompoundRepository _repository;
        private readonly ApplicationDbContext _context; // used to attach existing Targets by id
        private readonly ILogger<CompoundService> _logger;

        public CompoundService(ICompoundRepository repository, ApplicationDbContext context, ILogger<CompoundService> logger)
        {
            _repository = repository;
            _context = context;
            _logger = logger;
        }

        public async Task<CompoundDto?> GetByIdAsync(int id)
        {
            var compound = await _repository.GetByIdAsync(id);
            return compound is null ? null : MapToDto(compound);
        }

        public async Task<List<CompoundDto>> SearchAsync(string? name, int? categoryId, int? targetId, CompoundStatus? status)
        {
            var results = await _repository.SearchAsync(name, categoryId, targetId, status);
            return results.Select(MapToDto).ToList();
        }

        public async Task<CompoundDto> CreateAsync(CreateCompoundDto dto, string userId)
        {
            if (await _repository.ExistsByNameAsync(dto.Name))
                throw new InvalidOperationException($"A compound named '{dto.Name}' already exists.");

            var compound = new Compound
            {
                Name = dto.Name,
                Synonym = dto.Synonym,
                Description = dto.Description,
                MolecularFormula = dto.MolecularFormula,
                CategoryId = dto.CategoryId,
                Status = CompoundStatus.Draft,
                CreatedById = userId
            };

            foreach (var targetId in dto.TargetIds.Distinct())
                compound.CompoundTargets.Add(new CompoundTarget { TargetId = targetId });

            var created = await _repository.AddAsync(compound);
            _logger.LogInformation("Compound {Name} created by user {UserId}", created.Name, userId);

            var reloaded = await _repository.GetByIdAsync(created.Id);
            return MapToDto(reloaded!);
        }

        public async Task<CompoundDto> UpdateAsync(int id, UpdateCompoundDto dto)
        {
            var compound = await _repository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"Compound {id} not found.");

            if (await _repository.ExistsByNameAsync(dto.Name, id))
                throw new InvalidOperationException($"A compound named '{dto.Name}' already exists.");

            compound.Name = dto.Name;
            compound.Synonym = dto.Synonym;
            compound.Description = dto.Description;
            compound.MolecularFormula = dto.MolecularFormula;
            compound.CategoryId = dto.CategoryId;

            compound.CompoundTargets.Clear();
            foreach (var targetId in dto.TargetIds.Distinct())
                compound.CompoundTargets.Add(new CompoundTarget { CompoundId = id, TargetId = targetId });

            // Edits send an approved compound back for re-review.
            if (compound.Status == CompoundStatus.Approved)
                compound.Status = CompoundStatus.PendingReview;

            await _repository.UpdateAsync(compound);
            return MapToDto(compound);
        }

        public async Task DeleteAsync(int id)
        {
            var compound = await _repository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"Compound {id} not found.");
            await _repository.DeleteAsync(compound);
        }

        public async Task<CompoundDto> ReviewAsync(int id, ReviewCompoundDto dto)
        {
            var compound = await _repository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"Compound {id} not found.");

            compound.Status = dto.Approve ? CompoundStatus.Approved : CompoundStatus.Rejected;
            compound.ReviewComments = dto.Comments;

            await _repository.UpdateAsync(compound);
            _logger.LogInformation("Compound {Id} reviewed: {Status}", id, compound.Status);
            return MapToDto(compound);
        }

        private static CompoundDto MapToDto(Compound c) => new()
        {
            Id = c.Id,
            Name = c.Name,
            Synonym = c.Synonym,
            Description = c.Description,
            MolecularFormula = c.MolecularFormula,
            CategoryName = c.Category?.Name,
            Status = c.Status,
            Targets = c.CompoundTargets.Select(ct => ct.Target?.Name ?? string.Empty).ToList(),
            CreatedByName = c.CreatedBy?.FullName,
            CreatedAt = c.CreatedAt
        };
    }
}
