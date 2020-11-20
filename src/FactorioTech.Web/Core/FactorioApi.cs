using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace FactorioTech.Web.Core
{
    public static class FactorioApi
    {
        public record Envelope
        {
            [JsonPropertyName("blueprint")]
            public Blueprint? Blueprint { get; init; }

            [JsonPropertyName("blueprint_book")]
            public BlueprintBook? BlueprintBook { get; init; }
        }

        public record BlueprintBook
        {
            [JsonPropertyName("item")]
            public string Item { get; init; } = string.Empty;

            [JsonPropertyName("label")]
            public string? Label { get; init; }

            [JsonPropertyName("active_index")]
            public int? ActiveIndex { get; init; }

            [JsonPropertyName("version")]
            public long Version { get; init; }

            [JsonPropertyName("blueprints")]
            public IEnumerable<BookItem> Blueprints { get; init; } = Enumerable.Empty<BookItem>();
        }

        public record BookItem
        {
            [JsonPropertyName("blueprint")]
            public Blueprint Blueprint { get; init; } = new();

            [JsonPropertyName("index")]
            public int Index { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Blueprint_object
        /// </summary>
        public record Blueprint
        {
            [JsonPropertyName("item")]
            public string Item { get; init; } = string.Empty;

            [JsonPropertyName("entities")]
            public IEnumerable<Entity> Entities { get; init; } = Enumerable.Empty<Entity>();

            [JsonPropertyName("version")]
            public long Version { get; init; }

            [JsonPropertyName("label")]
            public string? Label { get; init; }

            [JsonPropertyName("label_color")]
            public Color? LabelColor { get; init; }

            [JsonPropertyName("description")]
            public string? Description { get; init; }

            [JsonPropertyName("tiles")]
            public IEnumerable<Tile>? Tiles { get; init; }

            [JsonPropertyName("icons")]
            public IEnumerable<Icon>? Icons { get; init; }

            [JsonPropertyName("schedules")]
            public IEnumerable<Schedule>? Schedules { get; init; }

            [JsonPropertyName("snap-to-grid")]
            public Position? SnapToGrid { get; init; }

            [JsonPropertyName("absolute-snapping")]
            public bool? AbsoluteSnapping { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Entity_object
        /// </summary>
        public record Entity
        {
            /// <summary>
            /// Index of the entity, 1-based.
            /// </summary>
            [JsonPropertyName("entity_number")]
            public int EntityNumber { get; init; }

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

            /// <summary>
            /// Direction of the entity, uint (optional).
            /// </summary>
            [JsonPropertyName("direction")]
            public uint? Direction { get; init; }

            /// <summary>
            /// Orientation of cargo wagon or locomotive, value 0 to 1 (optional).
            /// </summary>
            [JsonPropertyName("orientation")]
            public float? Orientation { get; init; }

            /// <summary>
            /// Circuit connection, object with keys starting from 1, values are #Connection objects (optional).
            /// </summary>
            [JsonPropertyName("connections")]
            public Connection? Connections { get; init; }

            // control_behaviour // todo docs missing

            /// <summary>
            /// Item requests by this entity, this is what defines the item-request-proxy when the blueprint is placed, optional. #Item request object
            /// </summary>
            [JsonPropertyName("items")]
            public IDictionary<string, int>? Items { get; init; }

            /// <summary>
            /// Name of the recipe prototype this assembling machine is set to, optional, string.
            /// </summary>
            [JsonPropertyName("recipe")]
            public string? Recipe { get; init; }

            /// <summary>
            /// Used by Prototype/Container, optional. The index of the first inaccessible item slot due to limiting with the red "bar". 0-based
            /// </summary>
            [JsonPropertyName("bar")]
            public int? Bar { get; init; }

            /// <summary>
            /// Cargo wagon inventory configuration, optional. #Inventory object
            /// </summary>
            [JsonPropertyName("inventory")]
            public Inventory? Inventory { get; init; }

            /// <summary>
            /// Used by Prototype/InfinityContainer, optional. #Infinity settings object
            /// </summary>
            [JsonPropertyName("infinity_settings")]
            public InfinitySettings? InfinitySettings { get; init; }

            /// <summary>
            /// Type of the underground belt or loader, optional. Either "input" or "output".
            /// </summary>
            [JsonPropertyName("type")]
            public string? Type { get; init; }

            /// <summary>
            /// Input priority of the splitter, optional. Either "right" or "left", "none" is omitted.
            /// </summary>
            [JsonPropertyName("input_priority")]
            public string? InputPriority { get; init; }

            /// <summary>
            /// Output priority of the splitter, optional. Either "right" or "left", "none" is omitted.
            /// </summary>
            [JsonPropertyName("output_priority")]
            public string? OutputPriority { get; init; }

            /// <summary>
            /// Filter of the splitter, optional. Name of the item prototype the filter is set to, string.
            /// </summary>
            [JsonPropertyName("filter")]
            public string? Filter { get; init; }

            /// <summary>
            /// Filters of the filter inserter or loader, optional. Array of #Item filter objects.
            /// </summary>
            [JsonPropertyName("filters")]
            public IEnumerable<ItemFilter>? Filters { get; init; }

            /// <summary>
            /// Filter mode of the filter inserter, optional. Either "whitelist" or "blacklist".
            /// </summary>
            [JsonPropertyName("filter_mode")]
            public string? FilterMode { get; init; }

            /// <summary>
            /// The stack size the inserter is set to, optional. Types/uint8.
            /// </summary>
            [JsonPropertyName("override_stack_size")]
            public ushort? OverrideStackSize { get; init; }

            /// <summary>
            /// The drop position the inserter is set to, optional. #Position object.
            /// </summary>
            [JsonPropertyName("drop_position")]
            public Position? DropPosition { get; init; }

            /// <summary>
            /// The pickup position the inserter is set to, optional. #Position object.
            /// </summary>
            [JsonPropertyName("pickup_position")]
            public Position? PickupPosition { get; init; }

            /// <summary>
            /// Used by Prototype/LogisticContainer, optional. #Logistic filter object.
            /// </summary>
            [JsonPropertyName("request_filters")]
            public IEnumerable<LogisticFilter>? RequestFilters { get; init; }

            /// <summary>
            /// Boolean. Whether this requester chest can request from buffer chests.
            /// </summary>
            [JsonPropertyName("request_from_buffers")]
            public bool? RequestFromBuffers { get; init; }

            /// <summary>
            /// Used by Programmable speaker, optional. #Speaker parameter object.
            /// </summary>
            [JsonPropertyName("parameters")]
            public SpeakerParameter? Parameters { get; init; }

            /// <summary>
            /// Used by Programmable speaker, optional. #Speaker alert parameter object.
            /// </summary>
            [JsonPropertyName("alert_parameters")]
            public SpeakerAlertParameter? AlertParameters { get; init; }

            /// <summary>
            /// Used by the rocket silo, optional. Boolean, whether auto launch is enabled. 
            /// </summary>
            [JsonPropertyName("auto_launch")]
            public bool? AutoLaunch { get; init; }

            /// <summary>
            /// Used by Prototype/SimpleEntityWithForce or Prototype/SimpleEntityWithOwner, optional. Types/GraphicsVariation
            /// </summary>
            [JsonPropertyName("variation")]
            public ushort? Variation { get; init; }

            /// <summary>
            /// Color of the Prototype/SimpleEntityWithForce, Prototype/SimpleEntityWithOwner, or train station, optional. #Color object.
            /// </summary>
            [JsonPropertyName("color")]
            public Color? Color { get; init; }

            /// <summary>
            /// The name of the train station, optional.
            /// </summary>
            [JsonPropertyName("station")]
            public string? Station { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Tile_object
        /// </summary>
        public record Tile
        {
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;

            [JsonPropertyName("position")]
            public Position Position { get; init; } = new();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Icon_object
        /// </summary>
        public record Icon
        {
            [JsonPropertyName("index")]
            public int Index { get; init; }

            [JsonPropertyName("signal")]
            public SignalId Signal { get; init; } = new();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#SignalID_object
        /// </summary>
        public record SignalId
        {
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;

            [JsonPropertyName("type")]
            public string Type { get; init; } = string.Empty;
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Position_object
        /// </summary>
        public record Position
        {
            [JsonPropertyName("x")]
            public float X { get; init; }

            [JsonPropertyName("y")]
            public float Y { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Color_object
        /// </summary>
        public record Color
        {
            [JsonPropertyName("r")]
            public float R { get; init; }

            [JsonPropertyName("g")]
            public float G { get; init; }

            [JsonPropertyName("b")]
            public float B { get; init; }

            [JsonPropertyName("a")]
            public float A { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Schedule_object
        /// </summary>
        public record Schedule
        {
            [JsonPropertyName("schedules")]
            public IEnumerable<ScheduleRecord> Schedules { get; init; } = Enumerable.Empty<ScheduleRecord>();

            [JsonPropertyName("locomotives")]
            public IEnumerable<int> Locomotives { get; init; } = Enumerable.Empty<int>();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Schedule_Record_object
        /// </summary>
        public record ScheduleRecord
        {
            [JsonPropertyName("station")]
            public string Station { get; init; } = string.Empty;

            [JsonPropertyName("wait_conditions")]
            public IEnumerable<WaitCondition> WaitConditions { get; init; } = Enumerable.Empty<WaitCondition>();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Wait_Condition_object
        /// </summary>
        public record WaitCondition
        {
            [JsonPropertyName("type")]
            public string Type { get; init; } = string.Empty;

            [JsonPropertyName("compare_type")]
            public string CompareType { get; init; } = string.Empty;

            [JsonPropertyName("ticks")]
            public uint? Ticks { get; init; }

            // todo docs missing
            //[JsonPropertyName("condition")]
            //public CircuitCondition? Condition { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Connection_object
        /// </summary>
        public record Connection
        {
            [JsonPropertyName("first")]
            public ConnectionPoint First { get; init; } = new();

            [JsonPropertyName("second")]
            public ConnectionPoint Second { get; init; } = new();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Connection_point_object
        /// </summary>
        public record ConnectionPoint
        {
            [JsonPropertyName("red")]
            public ConnectionData Red { get; init; } = new();

            [JsonPropertyName("green")]
            public ConnectionData Green { get; init; } = new();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Connection_data_object
        /// </summary>
        public record ConnectionData
        {
            [JsonPropertyName("entity_id")]
            public int EntityId { get; init; }

            [JsonPropertyName("circuit_id")]
            public int CircuitId { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Inventory_object
        /// </summary>
        public record Inventory
        {
            [JsonPropertyName("filters")]
            public IEnumerable<ItemFilter> Filters { get; init; } = Enumerable.Empty<ItemFilter>();

            [JsonPropertyName("bar")]
            public int? Bar { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Logistic_filter_object
        /// </summary>
        public record LogisticFilter
        {
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;

            [JsonPropertyName("index")]
            public int Index { get; init; }

            [JsonPropertyName("count")]
            public int Count { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Item_filter_object
        /// </summary>
        public record ItemFilter
        {
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;

            [JsonPropertyName("index")]
            public int Index { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Infinity_settings_object
        /// </summary>
        public record InfinitySettings
        {
            [JsonPropertyName("remove_unfiltered_items")]
            public bool RemoveUnfilteredItems { get; init; }

            [JsonPropertyName("filters")]
            public IEnumerable<InfinityFilter> Filters { get; init; } = Enumerable.Empty<InfinityFilter>();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Infinity_filter_object
        /// </summary>
        public record InfinityFilter
        {
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;

            [JsonPropertyName("count")]
            public int Count { get; init; }

            [JsonPropertyName("mode")]
            public string Mode { get; init; } = string.Empty;

            [JsonPropertyName("index")]
            public int Index { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Speaker_parameter_object
        /// </summary>
        public record SpeakerParameter
        {
            [JsonPropertyName("playback_volume")]
            public float PlaybackVolume { get; init; }

            [JsonPropertyName("playback_globally")]
            public bool PlaybackGlobally { get; init; }

            [JsonPropertyName("allow_polyphony")]
            public bool AllowPolyphony { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Speaker_alert_parameter_object
        /// </summary>
        public record SpeakerAlertParameter
        {
            [JsonPropertyName("show_alert")]
            public bool ShowAlert { get; init; }

            [JsonPropertyName("show_on_map")]
            public bool ShowOnMap { get; init; }

            [JsonPropertyName("icons_signal_id")]
            public SignalId? IconSiglnalId { get; init; }

            [JsonPropertyName("alert_message")]
            public string? AlertMessage { get; init; }
        }
    }
}
