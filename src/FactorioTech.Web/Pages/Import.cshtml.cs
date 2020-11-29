using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Web.Extensions;
using FactorioTech.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SluggyUnidecode;
using System;
using System.Collections.Generic;
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
        private readonly BlueprintService _blueprintService;
        private readonly ImageService _imageService;

        public ImportModel(
            ILogger<ImportModel> logger,
            AppDbContext ctx,
            BlueprintConverter blueprintConverter,
            BlueprintService blueprintService,
            ImageService imageService)
        {
            _logger = logger;
            _blueprintConverter = blueprintConverter;
            _blueprintService = blueprintService;
            _imageService = imageService;
            _ctx = ctx;
        }

        [TempData]
        public string? StatusMessage { get; set; }

        [TempData]
        public string? BlueprintString { get; set; }

        [TempData]
        public Guid? ParentBlueprintId { get; set; }

        public ImportInputModel ImportInput { get; private set; } = new();
        public CreateInputModel CreateInput { get; private set; } = new();
        public Blueprint? ParentBlueprint { get; private set; }
        public FactorioApi.BlueprintEnvelope? Envelope { get; private set; }
        public PayloadCache PayloadCache { get; } = new();
        public IEnumerable<SelectListItem> AvailableTags { get; } = Tags.All.Select(tag => new SelectListItem(tag, tag));

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

            var payload = new BlueprintPayload(Hash.Compute(BlueprintString), BlueprintString, new Version());
            PayloadCache.TryAdd(Envelope, payload);

            await _imageService.SaveAllBlueprintRenderings(Guid.Empty, PayloadCache, Envelope);

            TempData.Keep(nameof(BlueprintString));

            return Page();
        }

        public async Task<IActionResult> OnPostCreateAsync([FromForm]CreateInputModel createInput)
        {
            CreateInput = createInput;

            if (!ModelState.IsValid || BlueprintString == null)
            {
                TempData.Keep(nameof(BlueprintString));
                return Page();
            }

            var hash = Hash.Compute(BlueprintString);
            var envelope = await _blueprintConverter.Decode(BlueprintString);
            var payload = new BlueprintPayload(hash, BlueprintString, Utils.DecodeGameVersion(envelope.Version));
            PayloadCache.TryAdd(envelope, payload);

            var request = new BlueprintService.CreateRequest(
                createInput.Slug.Trim().ToLowerInvariant(),
                createInput.Title.Trim(),
                createInput.Description?.Trim(),
                createInput.Tags ?? Enumerable.Empty<string>(),
                (createInput.VersionName?.Trim(), createInput.VersionDescription?.Trim()));

            var result = await _blueprintService.CreateOrAddVersion(
                request, payload, (User.GetUserId(), User.GetUserName()), ParentBlueprintId);

            switch (result)
            {
                case BlueprintService.CreateResult.Success success:
                    StatusMessage = ParentBlueprintId == null
                        ? "The blueprint has been published."
                        : "The version has been added to the blueprint.";

                    return RedirectToPage("./Blueprint", new
                    {
                        user = success.Blueprint.OwnerSlug,
                        slug = success.Blueprint.Slug,
                    });

                case BlueprintService.CreateResult.DuplicateHash error:
                    _logger.LogWarning("Attempted to save duplicate payload with hash {Hash}. The hash already exists in {VersionId} of blueprint {BlueprintId}",
                        hash, error.VersionId, error.BlueprintId);

                    var fullSlug = $"{error.Owner.UserName}/{error.Slug}";
                    StatusMessage = $"Error: This blueprint string has already been imported as <a href=\"/{fullSlug}\">{fullSlug}</a>.";
                    TempData.Keep(nameof(BlueprintString));
                    return Page();

                case BlueprintService.CreateResult.DuplicateSlug error:
                    _logger.LogWarning("Attempted to save blueprint with existing slug: {UserName}/{Slug}",
                        error.Owner.UserName, error.Slug);

                    StatusMessage = "Error: You already have a blueprint with this slug. Did you intend to add a version to that blueprint instead?";
                    TempData.Keep(nameof(BlueprintString));
                    return Page();

                case BlueprintService.CreateResult.ParentNotFound error:
                    _logger.LogWarning("Attempted to add version to unknown blueprint: {BlueprintId}",
                        error.BlueprintId);

                    StatusMessage = "Error: The specified blueprint does not exist.";
                    TempData.Keep(nameof(BlueprintString));
                    return Page();

                case BlueprintService.CreateResult.OwnerMismatch error:
                    _logger.LogWarning("Attempted to add version to blueprint {BlueprintId} that is owned by {OwnerId}",
                        error.BlueprintId, error.Owner.Id);

                    StatusMessage = "Error: This blueprint is not yours!";
                    return RedirectToPage("/Blueprint", new
                    {
                        user = error.Owner.UserName,
                        slug = error.Slug,
                    });
            }

            _logger.LogCritical($"Failed to parse {nameof(CreatedResult)} of type {result.GetType().Name}");
            return RedirectToPage("/Error");
        }

        public IActionResult OnPostPreview([FromForm]string content) => 
            Partial("_MarkdownPreview", content);

        public async Task<JsonResult> OnPostCheckSlugAsync([FromForm]string slug)
        {
            var slugExists = await _blueprintService.SlugExistsForUser(User.GetUserId(), slug);
            return new JsonResult(!slugExists);
        }
    }
}
