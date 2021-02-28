using FactorioTech.Core.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace FactorioTech.Core.Services
{
    public class SlugService
    {
        private readonly AppDbContext _dbContext;

        public SlugService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<SlugValidationResult> ValidateUsername(Func<SlugValidationModel, bool> tryValidateModel, string? username)
        {
            if (username == null || !tryValidateModel(new SlugValidationModel(username)))
                return SlugValidationResult.Invalid(username ?? string.Empty);

            var exists = await _dbContext.Users
                .AnyAsync(x => x.NormalizedUserName == username.ToUpperInvariant());

            return exists
                ? SlugValidationResult.Unavailable(username)
                : SlugValidationResult.Success(username);
        }

        public async Task<SlugValidationResult> Validate(Func<SlugValidationModel, bool> tryValidateModel, string? slug, Guid userId)
        {
            if (slug == null || !tryValidateModel(new SlugValidationModel(slug)))
                return SlugValidationResult.Invalid(slug ?? string.Empty);

            var exists = await _dbContext.Builds
                .AnyAsync(x => x.NormalizedSlug == slug.ToUpperInvariant()
                            && x.OwnerId == userId);

            return exists
                ? SlugValidationResult.Unavailable(slug)
                : SlugValidationResult.Success(slug);
        }

        public class SlugValidationModel
        {
            [Required]
            [StringLength(AppConfig.Policies.Slug.MaximumLength, MinimumLength = AppConfig.Policies.Slug.MinimumLength)]
            [RegularExpression(AppConfig.Policies.Slug.AllowedCharactersRegex)]
            [Blocklist(AppConfig.Policies.Slug.Blocklist)]
            public string? Slug { get; }

            public SlugValidationModel(string? slug) => Slug = slug;
        }

        public class SlugValidationResult
        {
            [Required]
            public string Slug { get; }

            [Required]
            public bool IsValid { get; }

            [Required]
            public bool IsAvailable { get; }

            private SlugValidationResult(string slug, bool isValid, bool isAvailable)
            {
                Slug = slug;
                IsValid = isValid;
                IsAvailable = isAvailable;
            }

            public static SlugValidationResult Success(string slug) => new(slug, true, true);
            public static SlugValidationResult Invalid(string slug) => new(slug, false, false);
            public static SlugValidationResult Unavailable(string slug) => new(slug, true, false);
        }
    }
}
