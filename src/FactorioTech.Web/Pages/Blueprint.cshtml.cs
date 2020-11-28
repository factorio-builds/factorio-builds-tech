using FactorioTech.Web.Core;
using FactorioTech.Web.Core.Domain;
using FactorioTech.Web.Data;
using FactorioTech.Web.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages
{
    public class BlueprintModel : PageModel
    {
        private readonly AppDbContext _ctx;
        private readonly BlueprintConverter _converter;

        public BlueprintModel(
            AppDbContext ctx,
            BlueprintConverter converter)
        {
            _ctx = ctx;
            _converter = converter;
        }

        [TempData]
        public string? StatusMessage { get; set; }

        public Blueprint Blueprint { get; private set; } = null!;
        public BlueprintVersion SelectedVersion { get; private set; } = null!;
        public IList<BlueprintVersion> Versions { get; private set; } = null!;
        public FactorioApi.BlueprintEnvelope Envelope { get; private set; } = null!;

        public PayloadCache PayloadCache { get; } = new();
        public ImportInputModel ImportInput { get; private set; } = new();

        public async Task<IActionResult> OnGetAsync(string user, string slug, string? hash)
        {
            var query = _ctx.Blueprints
                .Where(bp => bp.Slug == slug.ToLowerInvariant()
                             && bp.OwnerSlug == user.ToLowerInvariant());

            if (hash == null)
            {
                query = query.Include(bp => bp.LatestVersion!).ThenInclude(v => v.Payload);
            }

            Blueprint = await query
                .Include(bp => bp.Owner)
                .FirstOrDefaultAsync();

            if (Blueprint == null)
                return RedirectToPage("/NotFound");

            // don't include in the initial query as this will cause a massive cross join
            await _ctx.Entry(Blueprint).Collection(e => e.Tags).LoadAsync();

            Versions = await _ctx.BlueprintVersions.AsNoTracking()
                .Where(v => v.BlueprintId == Blueprint.BlueprintId)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();

            if (hash == null)
            {
                SelectedVersion = Blueprint.LatestVersion!;
            }
            else
            {
                SelectedVersion = await _ctx.BlueprintVersions.AsNoTracking()
                    .Where(v => v.BlueprintId == Blueprint.BlueprintId && v.Hash == new Hash(hash))
                    .Include(v => v.Payload)
                    .FirstOrDefaultAsync();

                if (SelectedVersion == null)
                {
                    StatusMessage = $"The version <strong>{hash}</strong> could not be found in this blueprint. Displaying the latest version.";
                    return RedirectToPage(new { user, slug, hash = (string?)null });
                }
            }

            if (SelectedVersion.Payload != null)
            {
                Envelope = await _converter.Decode(SelectedVersion.Payload.Encoded);
                PayloadCache.TryAdd(Envelope, SelectedVersion.Payload);
            }

            ImportInput.ParentSlug = Blueprint.Slug;

            ViewData["Title"] = $"{Blueprint.Owner!.UserName}/{Blueprint.Slug}: {Blueprint.Title}";

            return Page();
        }
    }
}
