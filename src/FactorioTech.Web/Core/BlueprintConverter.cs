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
        // ReSharper disable once ClassNeverInstantiated.Local
        private record Envelope
        {
            public FactorioApi.Blueprint? Blueprint { get; init; }
            public FactorioApi.BlueprintBook? BlueprintBook { get; init; }
        }

        private static readonly JsonSerializerOptions _options = new()
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

        public async Task<OneOf<FactorioApi.Blueprint, FactorioApi.BlueprintBook>> Decode(string blueprint)
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

            try
            {
                return await JsonSerializer.DeserializeAsync<Envelope>(decompresser, _options) switch
                {
                    { Blueprint: not null } e => e.Blueprint,
                    { BlueprintBook: not null } e => e.BlueprintBook,
                    _ => throw new Exception("Invalid blueprint string"),
                };
            }
            catch (Exception ex)
            {
                decompressed.Seek(0, SeekOrigin.Begin);
                await using var debugInflater = new ZlibStream(decompressed, CompressionMode.Decompress);
                using var debugReader = new StreamReader(debugInflater);
                var debugJson = await debugReader.ReadToEndAsync();

                _logger.LogError(ex, "Failed to deserialize blueprint JSON: {Json}", debugJson);

                throw;
            }
        }

        public async Task<string> Encode(OneOf<FactorioApi.Blueprint, FactorioApi.BlueprintBook> input)
        {
            var envelope = input.Match(
                blueprint => new Envelope { Blueprint = blueprint },
                book => new Envelope { BlueprintBook = book });

            await using var json = new MemoryStream();
            await JsonSerializer.SerializeAsync(json, envelope, _options);
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
