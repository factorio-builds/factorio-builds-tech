using FactorioTech.Web.Core;
using FactorioTech.Web.Core.Domain;
using FactorioTech.Web.Data;
using FactorioTech.Web.Extensions;
using FactorioTech.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using SluggyUnidecode;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages
{
    [Authorize]
    public class ImportModel : PageModel
    {
        private readonly ILogger<ImportModel> _logger;
        private readonly AppDbContext _ctx;
        private readonly BlueprintConverter _blueprintConverter;
        private readonly ImageService _imageService;

        public ImportModel(
            ILogger<ImportModel> logger,
            AppDbContext ctx,
            BlueprintConverter blueprintConverter,
            ImageService imageService)
        {
            _logger = logger;
            _blueprintConverter = blueprintConverter;
            _imageService = imageService;
            _ctx = ctx;
        }

        [TempData] public string? BlueprintString { get; set; }
        [TempData] public Guid? ParentBlueprintId { get; set; }
        public Blueprint? ParentBlueprint { get; set; }
        public ImportInputModel ImportInput { get; set; } = new();
        public CreateInputModel CreateInput { get; set; } = new();
        public FactorioApi.BlueprintEnvelope? Envelope { get; set; }
        public PayloadCache PayloadCache { get; } = new();

        public class CreateInputModel
        {
            [Required]
            [StringLength(100, MinimumLength = 3)]
            [RegularExpression("[a-z0-9_-]+",
                ErrorMessage = "Only lowercase latin characters (a-z), digits (0-9), underscore (_) and hyphen (-) are allowed.")]
            //[PageRemote( // todo: doesn't work nested due to prefixed __RequestVerificationToken :(
            //    PageHandler ="CheckSlug",
            //    HttpMethod = nameof(HttpMethod.Post),
            //    ErrorMessage = "You already have a blueprint with that slug",
            //    AdditionalFields = "__RequestVerificationToken")]
            public string Slug { get; set; } = string.Empty;

            [Required]
            [StringLength(100, MinimumLength = 3)]
            public string Title { get; set; } = string.Empty;

            public string? Description { get; set; }
            
            [DisplayName("Version name or number")]
            [StringLength(100, MinimumLength = 2)]
            public string? VersionName { get; set; }

            [DisplayName("Description")]
            public string? VersionDescription { get; set; }
        }

        public void OnGet()
        {
            ImportInput = new ImportInputModel
            {
                BlueprintString = BlueprintString ?? string.Empty,
            };

            BlueprintString = null;

            ViewData["Title"] = "Import blueprint string";
        }

        public async Task<IActionResult> OnPostAsync([FromForm]ImportInputModel importInput)
        {
            if (!ModelState.IsValid)
            {
                ImportInput = importInput;
                return Page();
            }

            Envelope = await _blueprintConverter.Decode(importInput.BlueprintString);
            BlueprintString = importInput.BlueprintString;

            if (!string.IsNullOrWhiteSpace(importInput.ParentSlug))
            {
                ParentBlueprint = await _ctx.Blueprints.AsNoTracking()
                    .Where(bp =>
                        bp.OwnerId == User.GetUserId()
                        && bp.Slug == importInput.ParentSlug.ToLowerInvariant())
                    .FirstOrDefaultAsync();

                ParentBlueprintId = ParentBlueprint?.BlueprintId;
            }

            CreateInput = new CreateInputModel
            {
                Slug = ParentBlueprint?.Slug ?? Envelope.Label?.ToSlug() ?? string.Empty,
                Title = ParentBlueprint?.Title ?? Envelope.Label ?? string.Empty,
                Description = ParentBlueprint?.Description ?? Envelope.Description,
            };

            if (ParentBlueprintId == null)
            {
                CreateInput.VersionName = "v1.0";
                CreateInput.VersionDescription = "The first release of this blueprint.";
            }

            var payload = new BlueprintPayload(Guid.Empty, Hash.Compute(BlueprintString), BlueprintString);
            PayloadCache.TryAdd(Envelope, payload);

            await _imageService.SaveAllBlueprintRenderings(Guid.Empty, PayloadCache, Envelope);

            TempData.Keep(nameof(BlueprintString));

            return Page();
        }

        public async Task<IActionResult> OnPostCreateAsync([FromForm]CreateInputModel createInput)
        {
            if (!ModelState.IsValid || BlueprintString == null)
            {
                CreateInput = createInput;
                return Page();
            }

            createInput.Slug = createInput.Slug.Trim().ToLowerInvariant();

            var hash = Hash.Compute(BlueprintString);
            var potentialDupe = await _ctx.BlueprintVersions
                .AsNoTracking()
                .Where(x => x.Hash == hash)
                .Select(x => new { x.VersionId, x.BlueprintId })
                .FirstOrDefaultAsync();

            if (potentialDupe != null)
            {
                _logger.LogWarning("Attempted to save duplicate version {VersionId} for blueprint {BlueprintId}",
                    potentialDupe.VersionId, potentialDupe.BlueprintId);

                // todo: add error message
                return Page();
            }

            var result = await _blueprintConverter.Decode(BlueprintString);
            var currentInstant = SystemClock.Instance.GetCurrentInstant();

            await using (var tx = await _ctx.Database.BeginTransactionAsync())
            {
                Blueprint? blueprint;

                if (ParentBlueprintId != null)
                {
                    blueprint = await _ctx.Blueprints
                        .FirstOrDefaultAsync(bp => bp.BlueprintId == ParentBlueprintId);

                    if (blueprint == null)
                    {
                        _logger.LogWarning("Attempted to add version to unknown blueprint:{BlueprintId}",
                            ParentBlueprintId);

                        // todo add error message: parent blueprint not found
                        return Page();
                    }

                    if (blueprint.OwnerId != User.GetUserId())
                    {
                        _logger.LogWarning("Attempted to add version to blueprint {BlueprintId} that is owned by {OwnerId}",
                            blueprint.BlueprintId, blueprint.OwnerId);

                        // todo add error message: parent blueprint is owned by different user
                        return Page();
                    }

                    blueprint.UpdatedAt = currentInstant;
                    blueprint.Title = createInput.Title.Trim();
                    blueprint.Description = createInput.Description?.Trim();
                }
                else
                {
                    if (await SlugExistsForUser(User.GetUserId(), createInput.Slug))
                    {
                        _logger.LogWarning("Attempted to save blueprint with existing slug: {UserName}/{Slug}",
                            User.GetUserName(), createInput.Slug);

                        // todo: add error message
                        return Page();
                    }

                    blueprint = new Blueprint(
                        Guid.NewGuid(),
                        User.GetUserId(),
                        User.GetUserName(),
                        currentInstant,
                        currentInstant,
                        createInput.Slug,
                        createInput.Title.Trim(),
                        createInput.Description?.Trim());

                    _ctx.Add(blueprint);
                }

                var payload = new BlueprintPayload(
                    Guid.NewGuid(),
                    hash,
                    BlueprintString);

                _ctx.Add(payload);

                var version = new BlueprintVersion(
                    Guid.NewGuid(),
                    blueprint.BlueprintId,
                    currentInstant,
                    createInput.VersionName?.Trim(),
                    createInput.VersionDescription?.Trim(),
                    payload);

                _ctx.Add(version);

                await _ctx.SaveChangesAsync();

                blueprint.LatestVersion = version;

                await _ctx.SaveChangesAsync();
                await tx.CommitAsync();

                PayloadCache.TryAdd(result, payload);
            }

            return RedirectToPage("./Blueprint", new
            {
                user = User.GetUserName(),
                slug = createInput.Slug,
            });
        }

        public async Task<JsonResult> OnPostCheckSlugAsync([FromForm]string slug)
        {
            var slugExists = await SlugExistsForUser(User.GetUserId(), slug);
            return new JsonResult(!slugExists);
        }

        private async Task<bool> SlugExistsForUser(Guid userId, string slug) =>
            await _ctx.Blueprints.AnyAsync(bp => bp.Slug == slug && bp.OwnerId == userId);
    }
}
