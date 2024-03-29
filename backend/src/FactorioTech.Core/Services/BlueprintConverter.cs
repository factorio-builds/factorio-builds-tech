using FactorioTech.Core.Domain;
using ICSharpCode.SharpZipLib.Zip.Compression;
using ICSharpCode.SharpZipLib.Zip.Compression.Streams;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FactorioTech.Core.Services;

/// <summary>
/// Factorio blueprint format:
///
/// A blueprint string is a JSON representation of the blueprint,
/// compressed with zlib deflate using compression level 9 and then
/// encoded using base64 with a version byte in front of the encoded
/// string. The version byte is currently 0 (for all Factorio
/// versions through 1.0). So to get the JSON representation of a
/// blueprint from a blueprint string, skip the first byte, base64
/// decode the string, and finally decompress using zlib inflate.
///
/// see https://wiki.factorio.com/Blueprint_string_format
/// </summary>
public class BlueprintConverter
{
    public static readonly JsonSerializerOptions JsonSerializerOptions = new()
    {
        PropertyNamingPolicy = new SnakeCaseNamingPolicy(),
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        WriteIndented = false,
    };

    public Version DecodeGameVersion(ulong version)
    {
        var bytes = BitConverter.GetBytes(version).AsSpan();

        return new Version(
            BitConverter.ToUInt16(bytes[6..8]),
            BitConverter.ToUInt16(bytes[4..6]),
            BitConverter.ToUInt16(bytes[2..4]),
            BitConverter.ToUInt16(bytes[0..2]));
    }

    public PayloadType ParseType(string item) =>
        item switch
        {
            "" => PayloadType.Blueprint, // todo: this seems fishy?
            "blueprint" => PayloadType.Blueprint,
            "blueprint-book" => PayloadType.Book,
            "deconstruction-planner" => PayloadType.DeconstructionPlanner,
            "upgrade-planner" => PayloadType.UpgradePlanner,
            _ => throw new ArgumentException($"Invalid blueprint type: {item}", nameof(item)),
        };

    public async Task<FactorioApi.BlueprintEnvelope> Decode(string blueprint)
    {
        var compressed = Convert.FromBase64String(blueprint[1..]);
        await using var decompressed = new MemoryStream(compressed);
        await using var decompresser = new InflaterInputStream(decompressed);

#if DEBUG
        // set a breakpoint here and manually step into the if block to debug the json
        if (!decompressed.CanRead)
        {
            decompressed.Seek(0, SeekOrigin.Begin);
            await using var debugInflater = new InflaterInputStream(decompressed);
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
                { DeconstructionPlanner: not null } envelope => envelope,
                { UpgradePlanner: not null } envelope => envelope,
                _ => throw new Exception("Failed to deserialize blueprint."),
            };

        }
        catch (Exception ex)
        {
            decompressed.Seek(0, SeekOrigin.Begin);
            await using var debugInflater = new InflaterInputStream(decompressed);
            using var debugReader = new StreamReader(debugInflater);
            var debugJson = await debugReader.ReadToEndAsync();

            throw new Exception($"JSON: {debugJson}", ex);
        }
    }

    public async Task<string> Encode(FactorioApi.BlueprintEnvelope envelope)
    {
        await using var json = new MemoryStream();
        await JsonSerializer.SerializeAsync(json, envelope.CloneAsTopLevel(), JsonSerializerOptions);

        json.Seek(0, SeekOrigin.Begin);
#if DEBUG
        // set a breakpoint here and manually step into the if block to debug the json
        if (!json.CanRead)
        {
            var debugJson = System.Text.Encoding.UTF8.GetString(json.ToArray());
            json.Seek(0, SeekOrigin.Begin);
        }
#endif
        await using var compressed = new MemoryStream();
        await using (var compresser = new DeflaterOutputStream(compressed, new Deflater(9)))
        {
            await json.CopyToAsync(compresser);
        }

        return "0" + Convert.ToBase64String(compressed.ToArray());
    }
}
