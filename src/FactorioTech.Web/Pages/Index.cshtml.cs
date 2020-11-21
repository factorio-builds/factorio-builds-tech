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
    public class IndexModel : PageModel
    {
        private readonly AppDbContext _ctx;

        public IndexModel(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        public DateTimeZone TimeZone = DateTimeZoneProviders.Tzdb["Europe/Berlin"];

        public IEnumerable<Blueprint> Blueprints { get; set; } = Enumerable.Empty<Blueprint>();

        public async Task<IActionResult> OnGetAsync()
        {
            Blueprints = await _ctx.Blueprints
                .OrderByDescending(x => x.CreatedAt)
                .AsNoTracking()
                .Take(100)
                .ToListAsync();

            return Page();
        }
    }
}
