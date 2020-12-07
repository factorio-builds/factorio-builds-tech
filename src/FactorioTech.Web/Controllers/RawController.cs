using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
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

        private readonly AppDbContext _dbContext;

        public RawController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("{user}/{slug}/raw")]
        public async Task<IActionResult> GetLatest(string user, string slug)
        {
            var encoded = await _dbContext.Blueprints.AsNoTracking()
                .Where(bp => bp.Slug == slug.ToLowerInvariant() && bp.OwnerSlug == user.ToLowerInvariant())
                .Select(bp => bp.LatestVersion!.Payload!.Encoded)
                .FirstOrDefaultAsync();

            if (encoded == null)
                return NotFound();

            return Ok(encoded);
        }

        [HttpGet("{user}/{slug}/{hash}/raw")]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetVersion(string user, string slug, string hash)
        {
            var encoded = await _dbContext.Blueprints.AsNoTracking()
                .Where(bp => bp.Slug == slug.ToLowerInvariant() && bp.OwnerSlug == user.ToLowerInvariant())
                .Join(_dbContext.BlueprintVersions, bp => bp.BlueprintId, v => v.BlueprintId, (bp, v) => v)
                .Where(v => v.Hash == new Hash(hash))
                .Select(v => v.Payload!.Encoded)
                .FirstOrDefaultAsync();

            if (encoded == null)
                return NotFound();

            return Ok(encoded);
        }
    }
}
