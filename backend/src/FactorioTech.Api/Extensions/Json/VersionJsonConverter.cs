using System.Text.Json;
using System.Text.Json.Serialization;

namespace FactorioTech.Api.Extensions.Json;

public class VersionJsonConverter : JsonConverter<Version>
{
    public override Version Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        reader.TokenType == JsonTokenType.String && Version.TryParse(reader.GetString(), out var version)
            ? version
            : throw new JsonException("The input is not a valid version");

    public override void Write(Utf8JsonWriter writer, Version value, JsonSerializerOptions options) =>
        writer.WriteStringValue(value.ToString(4));
}