using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Web.Controllers
{
    [ApiController]
    [Route("")]
    [EnableCors("factorio-blueprint-editor")]
    public class RawController : ControllerBase
    {
        private const int OneDayInSeconds = 86400;
        private const int OneMonthInSeconds = 2629800;

        private readonly AppDbContext _dbContext;

        public RawController(AppDbContext dbContext) => _dbContext = dbContext;

        [HttpGet("{owner}/{slug}/raw")]
        public async Task<IActionResult> GetLatest(string owner, string slug)
        {
            var encoded = await _dbContext.Blueprints.AsNoTracking()
                .Where(bp => bp.NormalizedSlug == slug.ToUpperInvariant() && bp.NormalizedOwnerSlug == owner.ToUpperInvariant())
                .Select(bp => bp.LatestVersion!.Payload!.Encoded)
                .FirstOrDefaultAsync();

            if (encoded == null)
                return NotFound();

            return Ok(encoded);
        }

        [HttpGet("/raw/{hash}")]
        [ResponseCache(Duration = OneMonthInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetPayload(string hash)
        {
            var encoded = await _dbContext.BlueprintPayloads.AsNoTracking()
                .Where(v => v.Hash == new Hash(hash))
                .Select(v => v.Encoded)
                .FirstOrDefaultAsync();

            if (encoded == null)
                return NotFound();

            return Ok(encoded);
        }
    }
}
