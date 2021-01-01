using FactorioTech.Core.Domain;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FactorioTech.Api.Services
{
    public class VersionJsonConverter : JsonConverter<Version>
    {
        public override Version Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
            reader.TokenType == JsonTokenType.String && Version.TryParse(reader.GetString(), out var version)
                ? version
                : throw new JsonException("The input is not a valid version");

        public override void Write(Utf8JsonWriter writer, Version value, JsonSerializerOptions options) =>
            writer.WriteStringValue(value.ToString(4));
    }

    public class HashJsonConverter : JsonConverter<Hash>
    {
        public override Hash Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
            reader.TokenType == JsonTokenType.String && Hash.TryParse(reader.GetString(), out var hash)
                ? hash
                : throw new JsonException("The input is not a valid version");

        public override void Write(Utf8JsonWriter writer, Hash value, JsonSerializerOptions options) =>
            writer.WriteStringValue(value.ToString());
    }
}
