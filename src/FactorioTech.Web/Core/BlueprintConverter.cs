using Ionic.Zlib;
using Microsoft.Extensions.Logging;
using OneOf;
using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace FactorioTech.Web.Core
{
    public class BlueprintConverter
    {
        public static readonly JsonSerializerOptions JsonSerializerOptions = new()
        {
            PropertyNamingPolicy = new SnakeCaseNamingPolicy(),
            IgnoreNullValues = true,
            WriteIndented = false,
        };

        private readonly ILogger<BlueprintConverter> _logger;

        public BlueprintConverter(ILogger<BlueprintConverter> logger)
        {
            _logger = logger;
        }

        public async Task<FactorioApi.BlueprintEnvelope> Decode(string blueprint)
        {
            // Factorio blueprint format:
            //
            // A blueprint string is a JSON representation of the blueprint,
            // compressed with zlib deflate using compression level 9 and then
            // encoded using base64 with a version byte in front of the encoded
            // string. The version byte is currently 0 (for all Factorio
            // versions through 1.0). So to get the JSON representation of a
            // blueprint from a blueprint string, skip the first byte, base64
            // decode the string, and finally decompress using zlib inflate.
            //
            // see https://wiki.factorio.com/Blueprint_string_format

            var compressed = Convert.FromBase64String(blueprint[1..]);
            await using var decompressed = new MemoryStream(compressed);
            await using var decompresser = new ZlibStream(decompressed, CompressionMode.Decompress);

#if DEBUG
            // set a breakpoint here and manually step into the if block to debug the json
            if (!decompressed.CanRead)
            {
                decompressed.Seek(0, SeekOrigin.Begin);
                await using var debugInflater = new ZlibStream(decompressed, CompressionMode.Decompress);
                using var debugReader = new StreamReader(debugInflater);
                var debugJson = await debugReader.ReadToEndAsync();
                throw new Exception(debugJson);
            }
#endif

            try
            {
                return await JsonSerializer.DeserializeAsync<FactorioApi.BlueprintEnvelope>(decompresser, JsonSerializerOptions) switch
                {
                    { Blueprint: not null } envelope => envelope,
                    { BlueprintBook: not null } envelope => envelope,
                    _ => throw new Exception("Failed to deserialize blueprint."),
                };

            }
            catch (Exception ex)
            {
                decompressed.Seek(0, SeekOrigin.Begin);
                await using var debugInflater = new ZlibStream(decompressed, CompressionMode.Decompress);
                using var debugReader = new StreamReader(debugInflater);
                var debugJson = await debugReader.ReadToEndAsync();

                _logger.LogError(ex, "JSON: {Json}", debugJson);

                throw;
            }
        }

        public async Task<string> Encode(OneOf<FactorioApi.Blueprint, FactorioApi.BlueprintBook> input)
        {
            var envelope = input.Match(
                blueprint => new FactorioApi.BlueprintEnvelope { Blueprint = blueprint },
                book => new FactorioApi.BlueprintEnvelope { BlueprintBook = book });

            await using var json = new MemoryStream();
            await JsonSerializer.SerializeAsync(json, envelope, JsonSerializerOptions);
            json.Seek(0, SeekOrigin.Begin);

            await using var compressed = new MemoryStream();
            await using var compresser = new ZlibStream(compressed, CompressionMode.Compress, CompressionLevel.Level9)
            {
                FlushMode = FlushType.Finish,
            };

            await json.CopyToAsync(compresser);
            await json.FlushAsync();

            return "0" + Convert.ToBase64String(compressed.ToArray());
        }
    }
}
