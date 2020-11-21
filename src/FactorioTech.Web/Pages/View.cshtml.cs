using FactorioTech.Web.Core.Domain;
using FactorioTech.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages
{
    public class ViewModel : PageModel
    {
        private readonly AppDbContext _ctx;

        public ViewModel(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        public Blueprint? Blueprint { get; set; }

        public IList<BlueprintVersion>? Versions { get; set; }

        public DateTimeZone TimeZone = DateTimeZoneProviders.Tzdb["Europe/Berlin"];

        public async Task<IActionResult> OnGetAsync(string user, string slug)
        {
            Blueprint = await _ctx.Blueprints
                .Where(bp => bp.Slug == slug.ToLowerInvariant() && bp.OwnerSlug == user.ToLowerInvariant())
                .Include(bp => bp.Owner)
                .Include(bp => bp.LatestVersion)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (Blueprint == null)
                return NotFound("Blueprint does not exist :(");

            // todo: payload has to move out of the version or these queries are too expensive
            Versions = await _ctx.BlueprintVersions
                .Where(v => v.BlueprintId == Blueprint.Id)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();

            ViewData["Title"] = $"{Blueprint.Owner!.UserName}/{Blueprint.Slug}: {Blueprint.Title}";

            return Page();
        }
    }
}
