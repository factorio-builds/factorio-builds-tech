using FactorioTech.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FactorioTech.Web.Controllers
{
    [ApiController]
    [Route("api/tags")]
    public class TagController : ControllerBase
    {
        private readonly AppDbContext _ctx;

        public TagController(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAllAvailableTags(CancellationToken cancellationToken = default)
        {
            var tags = await _ctx.Tags.AsNoTracking()
                .Select(t => t.Value)
                .Distinct()
                .ToListAsync(cancellationToken);

            return Ok(tags);
        }
    }
}
