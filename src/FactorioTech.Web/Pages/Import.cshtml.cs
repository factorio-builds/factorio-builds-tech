using FactorioTech.Web.Core;
using FactorioTech.Web.Core.Domain;
using FactorioTech.Web.Data;
using FactorioTech.Web.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using SluggyUnidecode;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages
{
    public class ImportModel : PageModel
    {
        private readonly ILogger<ImportModel> _logger;
        private readonly AppDbContext _ctx;
        private readonly BlueprintConverter _blueprintConverter;

        public ImportModel(
            ILogger<ImportModel> logger,
            AppDbContext ctx,
            BlueprintConverter blueprintConverter)
        {
            _logger = logger;
            _blueprintConverter = blueprintConverter;
            _ctx = ctx;
        }

        [TempData]
        public string? BlueprintString { get; set; }

        public ImportInputModel ImportInput { get; set; } = new();

        public CreateInputModel CreateInput { get; set; } = new();

        public FactorioApi.BlueprintEnvelope? Envelope { get; set; }

        public class ImportInputModel
        {
            [Required]
            [RegularExpression(
                // base64 starting with "0"
                "^0(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$",
                ErrorMessage = "This doesn't appear to be a valid blueprint string.")]
            public string BlueprintString { get; set; } = string.Empty;
        }

        public class CreateInputModel
        {
            [Required]
            [StringLength(100, MinimumLength = 3)]
            [RegularExpression("[a-z0-9_-]+")]
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
        }

        // todo: pulling this out of the model is a hackaround for [PageRemote] not working with nested model
        // todo2: doesn't actually work.... breaks step 2
        //[Required]
        //[StringLength(100, MinimumLength = 3)]
        //[RegularExpression("[a-z0-9_-]+")]
        //[PageRemote(
        //    PageHandler ="CheckSlug",
        //    HttpMethod = nameof(HttpMethod.Post),
        //    ErrorMessage = "You already have a blueprint with that slug",
        //    AdditionalFields = "__RequestVerificationToken")]
        //public string Slug { get; set; } = string.Empty;

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
            CreateInput = new CreateInputModel
            {
                Slug = Envelope.Label?.ToSlug() ?? string.Empty,
                Title = Envelope.Label ?? string.Empty,
                Description = Envelope.Description,
            };

            return Page();
        }

        public async Task<IActionResult> OnPostCreateAsync([FromForm]CreateInputModel createInput)
        {
            if (!ModelState.IsValid || BlueprintString == null)
            {
                CreateInput = createInput;
                return Page();
            }

            var hash = Utils.ComputeHash(BlueprintString);
            var potentialDupe = await _ctx.BlueprintVersions
                .Where(x => x.Hash == hash)
                .Select(x => new { VersionId = x.Id, x.BlueprintId })
                .FirstOrDefaultAsync();

            if (potentialDupe != null)
            {
                _logger.LogWarning("Attempted to save duplicate version {VersionId} for blueprint {BlueprintId}",
                    potentialDupe.VersionId, potentialDupe.BlueprintId);

                CreateInput = createInput;
                return Page();
            }

            if (await SlugExistsForUser(User.GetUserId(), createInput.Slug))
            {
                _logger.LogWarning("Attempted to save blueprint with existing slug: {UserName}/{Slug}",
                    User.GetUserName(), createInput.Slug);

                CreateInput = createInput;
                return Page();
            }

            var result = await _blueprintConverter.Decode(BlueprintString);
            var currentInstant = SystemClock.Instance.GetCurrentInstant();

            //var user = await _ctx.Users.FindAsync(User.GetUserId());

            var blueprint = new Blueprint(
                Guid.NewGuid(),
                User.GetUserId(),
                User.GetUserName(),
                currentInstant,
                createInput.Slug.ToLowerInvariant(),
                createInput.Title,
                createInput.Description);

            var version = new BlueprintVersion(
                Guid.NewGuid(),
                blueprint.Id,
                currentInstant,
                hash,
                result);

            _ctx.Add(blueprint);
            _ctx.Add(version);
            await _ctx.SaveChangesAsync();

            blueprint.LatestVersion = version;
            await _ctx.SaveChangesAsync();

            return RedirectToPage("./View", new
            {
                user = User.GetUserName(),
                slug = blueprint.Slug,
            });
        }

        public async Task<JsonResult> OnPostCheckSlugAsync([FromForm]string slug)
        {
            var slugExists = await SlugExistsForUser(User.GetUserId(), slug);
            return new JsonResult(!slugExists);
        }

        private async Task<bool> SlugExistsForUser(Guid userId, string slug) =>
            await _ctx.Blueprints.AnyAsync(bp =>
                    bp.Slug == slug.ToLowerInvariant()
                    && bp.OwnerId == userId);
    }
}
