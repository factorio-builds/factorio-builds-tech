using FactorioTech.Core.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Controllers
{
    [ApiController]
    [Route("")]
    public class RawController : ControllerBase
    {
        private const int OneDayInSeconds = 86400;
        private const int OneMonthInSeconds = 2629800;

        private readonly AppDbContext _ctx;

        public RawController(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet("{user}/{slug}/raw")]
        public async Task<IActionResult> GetLatest(string user, string slug)
        {
            var encoded = await _ctx.Blueprints.AsNoTracking()
                .Where(bp => bp.Slug == slug.ToLowerInvariant()
                             && bp.OwnerSlug == user.ToLowerInvariant())
                .Select(bp => bp.LatestVersion!.Payload!.Encoded)
                .FirstOrDefaultAsync();

            if (encoded == null)
                return NotFound();

            return Ok(encoded);
        }
    }
}
