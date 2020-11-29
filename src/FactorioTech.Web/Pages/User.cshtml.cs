using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Pages
{
    public class UserModel : PageModel
    {
        private readonly AppDbContext _ctx;

        public UserModel(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        public User SelectedUser { get; private set; } = null!;

        public async Task<IActionResult> OnGetAsync(string user)
        {
            SelectedUser = await _ctx.Users.AsNoTracking()
                .Where(u => u.NormalizedUserName == user.ToUpperInvariant())
                .Include(u => u.Blueprints)
                .FirstOrDefaultAsync();

            if (SelectedUser == null)
                return RedirectToPage("/NotFound");

            return Page();
        }
    }
}
