using FactorioTech.Web.Core.Domain;
using FactorioTech.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages.Blueprints
{
    public class ViewModel : PageModel
    {
        private readonly AppDbContext _ctx;

        public ViewModel(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        public Blueprint? Blueprint { get; set; }
        public BlueprintVersion? LatestVersion { get; set; }

        public async Task<IActionResult> OnGetAsync(string user, string slug)
        {
            Blueprint = await _ctx.Users
                .Where(u => u.UserName == user.ToLowerInvariant())
                .Join(_ctx.Blueprints, u => u.Id, bp => bp.OwnerId, (u, bp) => bp)
                .Where(bp => bp.Slug == slug.ToLowerInvariant())
                .FirstOrDefaultAsync();

            if (Blueprint == null)
                return NotFound("Blueprint does not exist :(");

            LatestVersion = await _ctx.BlueprintVersions
                .Where(v => v.BlueprintId == Blueprint.Id)
                .OrderByDescending(v => v.CreatedAt)
                .FirstOrDefaultAsync();

            return Page();
        }
    }
}
