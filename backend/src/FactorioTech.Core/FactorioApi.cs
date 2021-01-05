using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace FactorioTech.Core
{
    public static class FactorioApi
    {
        public sealed class BlueprintEnvelope : IEncodableBlueprint
        {
            [JsonPropertyName("blueprint"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public Blueprint? Blueprint { get; init; }

            [JsonPropertyName("blueprint_book"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public BlueprintBook? BlueprintBook { get; init; }

            [JsonPropertyName("index"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public int? Index { get; init; }

            [JsonIgnore]
            public string Item => Blueprint?.Item ?? BlueprintBook?.Item ?? string.Empty;

            [JsonIgnore]
            public string? Label => Blueprint?.Label ?? BlueprintBook?.Label ?? null;

            [JsonIgnore]
            public string? Description => Blueprint?.Description ?? BlueprintBook?.Description ?? null;

            [JsonIgnore]
            public IEnumerable<Icon>? Icons => Blueprint?.Icons ?? BlueprintBook?.Icons ?? null;

            [JsonIgnore]
            public ulong Version => Blueprint?.Version ?? BlueprintBook?.Version ?? 0;

            [JsonExtensionData]
            public Dictionary<string, object>? ExtensionData { get; init; }
        }

        public sealed class BlueprintBook : IEncodableBlueprint
        {
            [JsonPropertyName("version")]
            public ulong Version { get; init; }

            [JsonPropertyName("item")]
            public string Item { get; init; } = "blueprint-book";

            [JsonPropertyName("label"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public string? Label { get; init; }

            [JsonPropertyName("description"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public string? Description { get; init; }

            [JsonPropertyName("icons"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public IEnumerable<Icon>? Icons { get; init; }

            [JsonPropertyName("blueprints"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public IEnumerable<BlueprintEnvelope>? Blueprints { get; init; }

            [JsonExtensionData]
            public Dictionary<string, object>? ExtensionData { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Blueprint_object
        /// </summary>
        public sealed class Blueprint : IEncodableBlueprint
        {
            [JsonPropertyName("version")]
            public ulong Version { get; init; }

            [JsonPropertyName("item")]
            public string Item { get; init; } = "blueprint";

            [JsonPropertyName("entities")]
            public IEnumerable<Entity> Entities { get; init; } = Enumerable.Empty<Entity>();

            [JsonPropertyName("Tiles")]
            public IEnumerable<Entity> Tiles { get; init; } = Enumerable.Empty<Entity>();

            [JsonPropertyName("label"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public string? Label { get; init; }

            [JsonPropertyName("description"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public string? Description { get; init; }

            [JsonPropertyName("icons"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
            public IEnumerable<Icon>? Icons { get; init; }

            [JsonExtensionData]
            public Dictionary<string, object>? ExtensionData { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Entity_object
        /// </summary>
        public sealed class Entity
        {
            /// <summary>
            /// Prototype name of the entity (e.g. "offshore-pump").
            /// </summary>
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;

            [JsonExtensionData]
            public Dictionary<string, object>? ExtensionData { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Icon_object
        /// </summary>
        public sealed class Icon
        {
            [JsonPropertyName("index")]
            public int Index { get; init; }

            [JsonPropertyName("signal")]
            public SignalId Signal { get; init; } = new();

            [JsonExtensionData]
            public Dictionary<string, object>? ExtensionData { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#SignalID_object
        /// </summary>
        public sealed class SignalId
        {
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;

            [JsonPropertyName("type")]
            public string Type { get; init; } = string.Empty;

            [JsonExtensionData]
            public Dictionary<string, object>? ExtensionData { get; init; }
        }
    }
}
