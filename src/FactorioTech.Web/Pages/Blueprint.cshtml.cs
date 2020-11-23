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

        public BlueprintModel(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        public Blueprint Blueprint { get; private set; } = null!;
        public BlueprintMetadata Metadata { get; private set; } = null!;
        public IList<BlueprintVersion> Versions { get; private set; } = null!;
        public BlueprintMetadataCache MetadataCache { get; } = new();
        public ImportInputModel ImportInput { get; set; } = new();

        public async Task<IActionResult> OnGetAsync(string user, string slug)
        {
            Blueprint = await _ctx.Blueprints.AsNoTracking()
                .Where(bp => bp.Slug == slug.ToLowerInvariant() && bp.OwnerSlug == user.ToLowerInvariant())
                .Include(bp => bp.Owner)
                .Include(bp => bp.LatestVersion!).ThenInclude(v => v.Payload)
                .FirstOrDefaultAsync();

            if (Blueprint == null)
                return RedirectToPage("/NotFound");

            Versions = await _ctx.BlueprintVersions.AsNoTracking()
                .Where(v => v.BlueprintId == Blueprint.Id)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();

            ViewData["Title"] = $"{Blueprint.Owner!.UserName}/{Blueprint.Slug}: {Blueprint.Title}";

            if (Blueprint.LatestVersion?.Payload != null)
            {
                Metadata = new BlueprintMetadata(Blueprint.LatestVersion.Payload.Encoded, Blueprint.LatestVersion.Payload.Hash);
                MetadataCache.TryAdd(Blueprint.LatestVersion.Payload.Envelope, Metadata);
            }

            ImportInput.ParentSlug = Blueprint.Slug;

            return Page();
        }
    }
}
