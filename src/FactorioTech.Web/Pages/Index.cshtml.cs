using FactorioTech.Web.Core.Domain;
using FactorioTech.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
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

        public IEnumerable<Blueprint> Blueprints { get; private set; } = Enumerable.Empty<Blueprint>();

        public async Task<IActionResult> OnGetAsync()
        {
            Blueprints = await _ctx.Blueprints.AsNoTracking()
                .OrderByDescending(x => x.CreatedAt)
                .Take(100)
                .ToListAsync();

            return Page();
        }
    }
}
