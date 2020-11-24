using FactorioTech.Web.Core;
using FactorioTech.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FactorioTech.Web.Controllers
{
    [ApiController]
    [Route("api/files")]
    public class FileController : ControllerBase
    {
        private const int OneWeekInSeconds = 60 * 60 * 24 * 7;

        private static readonly Regex _sanitizer = new ("[^a-zA-Z0-9_-]+", RegexOptions.Compiled);

        private readonly AppConfig _appConfig;
        private readonly AppDbContext _ctx;
        private readonly ImageService _imageService;
        private readonly BlueprintConverter _converter;

        public FileController(
            IOptions<AppConfig> appConfigMonitor,
            AppDbContext ctx,
            ImageService imageService,
            BlueprintConverter converter)
        {
            _appConfig = appConfigMonitor.Value;
            _ctx = ctx;
            _imageService = imageService;
            _converter = converter;
        }
        

        [HttpGet("blueprint/{versionId}/{hash}.png")]
        [ResponseCache(Duration = OneWeekInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetBlueprintRendering(Guid versionId, string hash)
        {
            var file = _imageService.GetBlueprintRendering(hash);
            if (file != null)
                return new FileStreamResult(file, "image/png");

            return await TryFindAndSaveImage(hash, versionId);
        }

        [HttpGet("blueprint/{hash}.png")]
        [ResponseCache(Duration = OneWeekInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetBlueprintRendering(string hash)
        {
            var file = _imageService.GetBlueprintRendering(hash);
            if (file != null)
                return new FileStreamResult(file, "image/png");

            return await TryFindAndSaveImage(hash, null);
        }

        [HttpGet("icon/{size:int}/{type}/{key}.png")]
        [ResponseCache(Duration = OneWeekInSeconds, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetGameIcon(int size, string type, string key)
        {
            var sanitized = _sanitizer.Replace(key, string.Empty) switch
            {
                "heat-exchanger" => "heat-boiler",
                "stone-wall" => "wall",
                "straight-rail" => "rail",
                { } s => s,
            };

            var fileName = type switch
            {
                "item" => $"{sanitized}.png",
                "virtual" => Path.Combine("signal", $"{sanitized.Replace("-", "_")}.png"),
                _ => null,
            };

            if (fileName == null)
                return BadRequest("Invalid type");

            var fqfn = Path.Combine(_appConfig.FactorioDir, "data", "base", "graphics", "icons", fileName);
            if (!System.IO.File.Exists(fqfn))
                return NotFound();

            using var image = await Image.LoadAsync(fqfn);

            var cropRectangle = size switch
            {
                64 => new Rectangle(0, 0, 64, 64),
                32 => new Rectangle(64, 0, 32, 32),
                16 => new Rectangle(64 + 32, 0, 16, 16),
                8  => new Rectangle(64 + 32 + 16, 0, 8, 8),
                _  => default,
            };

            if (cropRectangle == default)
                return BadRequest("Invalid size");

            image.Mutate(x => x.Crop(cropRectangle));

            var output = new MemoryStream();
            await image.SaveAsPngAsync(output);
            output.Seek(0, SeekOrigin.Begin);

            return File(output, "image/png");
        }

        private async Task<IActionResult> TryFindAndSaveImage(string hash, Guid? versionId)
        {
            var payload = await _ctx.BlueprintPayloads.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Hash == hash);

            if (payload != null)
            {
                await _imageService.SaveBlueprintRendering(new BlueprintMetadata(payload.Encoded, payload.Hash));
                return FileOrNotFound(hash);
            }

            if (!versionId.HasValue)
                return NotFound();

            var parentPayload = await _ctx.BlueprintVersions.AsNoTracking()
                .Where(x => x.Id == versionId.Value)
                .Include(x => x.Payload)
                .FirstOrDefaultAsync();

            if (parentPayload == null)
                return NotFound();

            var metadata = await TryFindEnvelopeWithHash(parentPayload.Payload!.Envelope, hash);
            if (metadata == null)
                return NotFound();

            await _imageService.SaveBlueprintRendering(metadata);

            return FileOrNotFound(hash);
        }

        private async Task<BlueprintMetadata?> TryFindEnvelopeWithHash(FactorioApi.BlueprintEnvelope envelope, string targetHash)
        {
            if (envelope.Blueprint != null)
            {
                var encoded = await _converter.Encode(envelope.Blueprint);
                var hash = Utils.ComputeHash(encoded);
                return hash == targetHash ? new BlueprintMetadata(encoded, hash) : null;
            }

            if (envelope.BlueprintBook != null)
            {
                foreach (var innerEnvelope in envelope.BlueprintBook.Blueprints)
                {
                    var result = await TryFindEnvelopeWithHash(innerEnvelope, targetHash);
                    if (result != null)
                        return result;
                }
            }
         
            return null;
        }

        private IActionResult FileOrNotFound(string hash)
        {
            var file = _imageService.GetBlueprintRendering(hash);
            if (file != null)
                return new FileStreamResult(file, "image/png");

            return NotFound();
        }
    }
}
