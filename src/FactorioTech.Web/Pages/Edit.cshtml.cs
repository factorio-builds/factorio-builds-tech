using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Web.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;

namespace FactorioTech.Web.Pages
{
    public class EditModel : PageModel
    {
        private readonly ILogger<EditModel> _logger;
        private readonly AppDbContext _dbContext;
        private readonly ImageService _imageService;

        public EditModel(
            ILogger<EditModel> logger,
            AppDbContext dbContext,
            ImageService imageService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _imageService = imageService;
        }


        [TempData]
        public string? StatusMessage { get; set; }

        public Blueprint Blueprint { get; private set; } = null!;
        public CreateInputModel CreateInput { get; private set; } = new();
        public IEnumerable<SelectListItem> TagsSelectItems { get; private set; } = Enumerable.Empty<SelectListItem>();

        public async Task<IActionResult> OnGetAsync(string user, string slug)
        {
            Blueprint = await _dbContext.Blueprints.AsNoTracking()
                .Where(bp => bp.Slug == slug.ToLowerInvariant() && bp.OwnerSlug == user.ToLowerInvariant())
                .Include(bp => bp.Tags)
                .FirstOrDefaultAsync();

            if (Blueprint == null)
                return RedirectToPage("/NotFound");

            var existingTags = Blueprint.Tags!.Select(t => t.Value).ToHashSet();
            TagsSelectItems = Tags.All.Select(tag => new SelectListItem(tag, tag, existingTags.Contains(tag)));

            CreateInput = new CreateInputModel
            {
                Slug = Blueprint.Slug,
                Title = Blueprint.Title,
                Description = Blueprint.Description ?? string.Empty,
                Tags = existingTags,
            };

            ViewData["Title"] = $"{Blueprint.OwnerSlug}/{Blueprint.Slug}: {Blueprint.Title}";

            return Page();
        }

        public async Task<IActionResult> OnPostAsync(string user, string slug, [FromForm] CreateInputModel createInput)
        {
            CreateInput = createInput;

            if (!ModelState.IsValid)
            {
                return Page();
            }

            var blueprint = await _dbContext.Blueprints
                .Where(bp => bp.Slug == slug.ToLowerInvariant() && bp.OwnerSlug == user.ToLowerInvariant())
                .Include(bp => bp.Tags)
                .FirstOrDefaultAsync();

            blueprint.UpdateDetails(
                SystemClock.Instance.GetCurrentInstant(),
                createInput.Title.Trim(),
                createInput.Description?.Trim(),
                createInput.Tags!.Where(Tags.All.Contains).Select(Tag.FromString).ToHashSet());

            await _dbContext.SaveChangesAsync();

            if (createInput.Image.Uploaded != null)
            {
                await _imageService.SaveCroppedCover(
                    blueprint.BlueprintId,
                    createInput.Image.Uploaded.OpenReadStream(),
                    (createInput.Image.X, createInput.Image.Y, createInput.Image.W, createInput.Image.H));
            }
            else if (createInput.Image.Hash != null)
            {
                await _imageService.SaveCroppedCover(
                    blueprint.BlueprintId,
                    blueprint.LatestVersionId!.Value, Hash.Parse(createInput.Image.Hash),
                    (createInput.Image.X, createInput.Image.Y, createInput.Image.W, createInput.Image.H));
            }

            StatusMessage = "The blueprint has been updated.";

            return RedirectToPage("./Blueprint", new
            {
                user = blueprint.OwnerSlug,
                slug = blueprint.Slug,
            });
        }
    }
}
