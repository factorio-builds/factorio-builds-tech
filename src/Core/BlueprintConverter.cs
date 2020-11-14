using System;
using System.IO;
using System.IO.Compression;
using System.Text.Json;
using System.Threading.Tasks;

namespace FactorioTech.Web.Core
{
    public class BlueprintConverter
    {
        public record Envelope
        {
            public Blueprint Blueprint { get; init; } = new();
        }

        private static readonly JsonSerializerOptions _options = new()
        {
            PropertyNamingPolicy = new SnakeCaseNamingPolicy(),
        };

        public async Task<Envelope?> FromString(string blueprint)
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
            await using var stream = new MemoryStream(compressed[2..]);
            await using var inflater = new DeflateStream(stream, CompressionMode.Decompress);
            return await JsonSerializer.DeserializeAsync<Envelope>(inflater, _options);
        }
    }
}
