using System.Text.Json.Serialization;

namespace FactorioTech.Core;

public static class FactorioApi
{
    // ReSharper disable MemberHidesStaticFromOuterClass
    // ReSharper disable once InconsistentNaming
    public interface Item
    {
        string Name { get; }
    }

    public sealed class BlueprintEnvelope
    {
        [JsonPropertyName("blueprint"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Blueprint? Blueprint { get; init; }

        [JsonPropertyName("blueprint_book"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public BlueprintBook? BlueprintBook { get; init; }

        [JsonPropertyName("deconstruction_planner"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public DeconstructionPlanner? DeconstructionPlanner { get; init; }

        [JsonPropertyName("upgrade_planner"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public UpgradePlanner? UpgradePlanner { get; init; }

        [JsonPropertyName("index"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? Index { get; set; }

        [JsonExtensionData]
        public Dictionary<string, object>? ExtensionData { get; init; }

        [JsonIgnore]
        public BlueprintEntity Entity =>
            Blueprint as BlueprintEntity
            ?? BlueprintBook as BlueprintEntity
            ?? DeconstructionPlanner as BlueprintEntity
            ?? UpgradePlanner as BlueprintEntity
            ?? throw new Exception("Envelope has no entity");

        public BlueprintEnvelope CloneAsTopLevel() => Entity switch
        {
            Blueprint e => new BlueprintEnvelope { Blueprint = e },
            BlueprintBook e => new BlueprintEnvelope { BlueprintBook = e },
            DeconstructionPlanner e => new BlueprintEnvelope { DeconstructionPlanner = e },
            UpgradePlanner e => new BlueprintEnvelope { UpgradePlanner = e },
            _ => throw new Exception($"Invalid entity type: {Entity.Item} / {Entity.GetType()}"),
        };
    }

    public abstract class BlueprintEntity
    {
        [JsonPropertyName("item")]
        public abstract string Item { get; init; }

        [JsonPropertyName("version")]
        public ulong Version { get; init; }

        [JsonPropertyName("label"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Label { get; init; }

        [JsonPropertyName("description"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Description { get; init; }

        [JsonPropertyName("icons"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public IEnumerable<Icon>? Icons { get; init; }

        [JsonExtensionData]
        public Dictionary<string, object>? ExtensionData { get; init; }
    }

    public sealed class BlueprintBook : BlueprintEntity
    {
        [JsonPropertyName("item")]
        public override string Item { get; init; } = "blueprint-book";

        [JsonPropertyName("blueprints"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public IEnumerable<BlueprintEnvelope>? Blueprints { get; init; }
    }

    /// <summary>
    /// https://wiki.factorio.com/Blueprint_string_format#Blueprint_object
    /// </summary>
    public sealed class Blueprint : BlueprintEntity
    {
        [JsonPropertyName("item")]
        public override string Item { get; init; } = "blueprint";

        [JsonPropertyName("entities")]
        public IEnumerable<Entity> Entities { get; init; } = Enumerable.Empty<Entity>();

        [JsonPropertyName("tiles")]
        public IEnumerable<Tile> Tiles { get; init; } = Enumerable.Empty<Tile>();
    }

    public sealed class DeconstructionPlanner : BlueprintEntity
    {
        [JsonPropertyName("item")]
        public override string Item { get; init; } = "deconstruction-planner";

        [JsonPropertyName("settings")]
        public PlannerSettings Settings { get; init; } = new();
    }

    public sealed class UpgradePlanner : BlueprintEntity
    {
        [JsonPropertyName("item")]
        public override string Item { get; init; } = "upgrade-planner";

        [JsonPropertyName("settings")]
        public PlannerSettings Settings { get; init; } = new();
    }

    public class PlannerSettings
    {
        [JsonExtensionData]
        public Dictionary<string, object>? ExtensionData { get; init; }
    }

    /// <summary>
    /// https://wiki.factorio.com/Blueprint_string_format#Entity_object
    /// </summary>
    public sealed class Entity : Item
    {
        /// <summary>
        /// Prototype name of the entity (e.g. "offshore-pump").
        /// </summary>
        [JsonPropertyName("name")]
        public string Name { get; init; } = string.Empty;

        /// <summary>
        /// #Position object, position of the entity within the blueprint.
        /// </summary>
        [JsonPropertyName("position")]
        public Position Position { get; init; } = new();

        [JsonExtensionData]
        public Dictionary<string, object>? ExtensionData { get; init; }
    }

    /// <summary>
    /// https://wiki.factorio.com/Blueprint_string_format#Tile_object
    /// </summary>
    public sealed class Tile : Item
    {
        [JsonPropertyName("name")]
        public string Name { get; init; } = string.Empty;

        [JsonPropertyName("position")]
        public Position Position { get; init; } = new();

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
    public sealed class SignalId : Item
    {
        [JsonPropertyName("name")]
        public string Name { get; init; } = string.Empty;

        [JsonPropertyName("type")]
        public string Type { get; init; } = string.Empty;

        [JsonExtensionData]
        public Dictionary<string, object>? ExtensionData { get; init; }
    }

    /// <summary>
    /// https://wiki.factorio.com/Blueprint_string_format#Position_object
    /// </summary>
    public sealed class Position
    {
        [JsonPropertyName("x")]
        public float X { get; init; }

        [JsonPropertyName("y")]
        public float Y { get; init; }
    }
}