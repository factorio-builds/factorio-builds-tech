using FactorioTech.Core.Domain;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FactorioTech.Api.Extensions.Json;

public class HashJsonConverter : JsonConverter<Hash>
{
    public override Hash Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        reader.TokenType == JsonTokenType.String && Hash.TryParse(reader.GetString(), out var hash)
            ? hash
            : throw new JsonException("The input is not a valid version");

    public override void Write(Utf8JsonWriter writer, Hash value, JsonSerializerOptions options) =>
        writer.WriteStringValue(value.ToString());
}