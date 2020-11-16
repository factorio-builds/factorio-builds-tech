using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace FactorioTech.Web.Core
{
    public static class FactorioApi
    {
        public record BlueprintBook
        {
            public string Item { get; init; } = string.Empty;
            public string? Label { get; init; }
            public int ActiveIndex { get; init; }
            public long Version { get; init; }
            public IEnumerable<BookItem> Blueprints { get; init; } = Enumerable.Empty<BookItem>();
        }

        public record BookItem
        {
            public Blueprint Blueprint { get; init; } = new();
            public int Index { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Blueprint_object
        /// </summary>
        public record Blueprint
        {
            public string Item { get; init; } = string.Empty;
            public IEnumerable<Entity> Entities { get; init; } = Enumerable.Empty<Entity>();
            public long Version { get; init; }

            public string? Label { get; init; }
            public Color? LabelColor { get; init; }
            public string? Description { get; init; }
            public IEnumerable<Tile>? Tiles { get; init; }
            public IEnumerable<Icon>? Icons { get; init; }
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
            public int EntityNumber { get; init; }

            /// <summary>
            /// Prototype name of the entity (e.g. "offshore-pump").
            /// </summary>
            public string Name { get; init; } = string.Empty;

            /// <summary>
            /// #Position object, position of the entity within the blueprint.
            /// </summary>
            public Position Position { get; init; } = new();

            /// <summary>
            /// Direction of the entity, uint (optional).
            /// </summary>
            public uint? Direction { get; init; }

            /// <summary>
            /// Orientation of cargo wagon or locomotive, value 0 to 1 (optional).
            /// </summary>
            public float Orientation { get; init; }

            /// <summary>
            /// Circuit connection, object with keys starting from 1, values are #Connection objects (optional).
            /// </summary>
            public Connection? Connections { get; init; }

            // control_behaviour // todo docs missing

            /// <summary>
            /// Item requests by this entity, this is what defines the item-request-proxy when the blueprint is placed, optional. #Item request object
            /// </summary>
            public IEnumerable<KeyValuePair<string, uint>>? Items { get; init; }

            /// <summary>
            /// Name of the recipe prototype this assembling machine is set to, optional, string. 
            /// </summary>
            public string? Recipe { get; init; }

            /// <summary>
            /// Used by Prototype/Container, optional. The index of the first inaccessible item slot due to limiting with the red "bar". 0-based
            /// </summary>
            public int? Bar { get; init; }

            /// <summary>
            /// Cargo wagon inventory configuration, optional. #Inventory object
            /// </summary>
            public Inventory? Inventory { get; init; }

            /// <summary>
            /// Used by Prototype/InfinityContainer, optional. #Infinity settings object
            /// </summary>
            public InfinitySettings? InfinitySettings { get; init; }

            /// <summary>
            /// Type of the underground belt or loader, optional. Either "input" or "output".
            /// </summary>
            public string? Type { get; init; }

            /// <summary>
            /// Input priority of the splitter, optional. Either "right" or "left", "none" is omitted.
            /// </summary>
            public string? InputPriority { get; init; }

            /// <summary>
            /// Output priority of the splitter, optional. Either "right" or "left", "none" is omitted.
            /// </summary>
            public string? OutputPriority { get; init; }

            /// <summary>
            /// Filter of the splitter, optional. Name of the item prototype the filter is set to, string.
            /// </summary>
            public string? Filter { get; init; }

            /// <summary>
            /// Filters of the filter inserter or loader, optional. Array of #Item filter objects.
            /// </summary>
            public IEnumerable<ItemFilter>? Filters { get; init; }

            /// <summary>
            /// Filter mode of the filter inserter, optional. Either "whitelist" or "blacklist".
            /// </summary>
            public string? FilterMode { get; init; }

            /// <summary>
            /// The stack size the inserter is set to, optional. Types/uint8.
            /// </summary>
            public ushort? OverrideStackSize { get; init; }

            /// <summary>
            /// The drop position the inserter is set to, optional. #Position object.
            /// </summary>
            public Position? DropPosition { get; init; }

            /// <summary>
            /// The pickup position the inserter is set to, optional. #Position object.
            /// </summary>
            public Position? PickupPosition { get; init; }

            /// <summary>
            /// Used by Prototype/LogisticContainer, optional. #Logistic filter object.
            /// </summary>
            public IEnumerable<LogisticFilter>? RequestFilters { get; init; }

            /// <summary>
            /// Boolean. Whether this requester chest can request from buffer chests.
            /// </summary>
            public bool RequestFromBuffers { get; init; }

            /// <summary>
            /// Used by Programmable speaker, optional. #Speaker parameter object.
            /// </summary>
            public SpeakerParameter? Parameters { get; init; }

            /// <summary>
            /// Used by Programmable speaker, optional. #Speaker alert parameter object.
            /// </summary>
            public SpeakerAlertParameter? AlertParameters { get; init; }

            /// <summary>
            /// Used by the rocket silo, optional. Boolean, whether auto launch is enabled. 
            /// </summary>
            public bool AutoLaunch { get; init; }

            /// <summary>
            /// Used by Prototype/SimpleEntityWithForce or Prototype/SimpleEntityWithOwner, optional. Types/GraphicsVariation
            /// </summary>
            public ushort? Variation { get; init; }

            /// <summary>
            /// Color of the Prototype/SimpleEntityWithForce, Prototype/SimpleEntityWithOwner, or train station, optional. #Color object.
            /// </summary>
            public Color? Color { get; init; }

            /// <summary>
            /// The name of the train station, optional.
            /// </summary>
            public string? Station { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Tile_object
        /// </summary>
        public record Tile
        {
            public string Name { get; init; } = string.Empty;
            public Position Position { get; init; } = new();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Icon_object
        /// </summary>
        public record Icon
        {
            public int Index { get; init; }
            public SignalId Signal { get; init; } = new();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#SignalID_object
        /// </summary>
        public record SignalId
        {
            public string Name { get; init; } = string.Empty;
            public string Type { get; init; } = string.Empty;
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Position_object
        /// </summary>
        public record Position
        {
            public float X { get; init; }
            public float Y { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Color_object
        /// </summary>
        public record Color
        {
            public float R { get; init; }
            public float G { get; init; }
            public float B { get; init; }
            public float A { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Schedule_object
        /// </summary>
        public record Schedule
        {
            public IEnumerable<ScheduleRecord> Schedules { get; init; } = Enumerable.Empty<ScheduleRecord>();
            public IEnumerable<int> Locomotives { get; init; } = Enumerable.Empty<int>();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Schedule_Record_object
        /// </summary>
        public record ScheduleRecord
        {
            public string Station { get; init; } = string.Empty;
            public IEnumerable<WaitCondition> WaitConditions { get; init; } = Enumerable.Empty<WaitCondition>();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Wait_Condition_object
        /// </summary>
        public record WaitCondition
        {
            public string Type { get; init; } = string.Empty;
            public string CompareType { get; init; } = string.Empty;

            public uint? Ticks { get; init; }
            //public CircuitCondition? Condition { get; init; } // todo docs missing
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Connection_object
        /// </summary>
        public record Connection
        {
            public ConnectionPoint First { get; init; } = new();
            public ConnectionPoint Second { get; init; } = new();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Connection_point_object
        /// </summary>
        public record ConnectionPoint
        {
            public ConnectionData Red { get; init; } = new();
            public ConnectionData Green { get; init; } = new();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Connection_data_object
        /// </summary>
        public record ConnectionData
        {
            public int EntityId { get; init; }
            public int CircuitId { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Inventory_object
        /// </summary>
        public record Inventory
        {
            public IEnumerable<ItemFilter> Filters { get; init; } = Enumerable.Empty<ItemFilter>();
            public int? Bar { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Logistic_filter_object
        /// </summary>
        public record LogisticFilter
        {
            public string Name { get; init; } = string.Empty;
            public int Index { get; init; }
            public int Count { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Item_filter_object
        /// </summary>
        public record ItemFilter
        {
            public string Name { get; init; } = string.Empty;
            public int Index { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Infinity_settings_object
        /// </summary>
        public record InfinitySettings
        {
            public bool RemoveUnfilteredItems { get; init; }
            public IEnumerable<InfinityFilter> Filters { get; init; } = Enumerable.Empty<InfinityFilter>();
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Infinity_filter_object
        /// </summary>
        public record InfinityFilter
        {
            public string Name { get; init; } = string.Empty;
            public int Count { get; init; }
            public string Mode { get; init; } = string.Empty;
            public int Index { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Speaker_parameter_object
        /// </summary>
        public record SpeakerParameter
        {
            public float PlaybackVolume { get; init; }
            public bool PlaybackGlobally { get; init; }
            public bool AllowPolyphony { get; init; }
        }

        /// <summary>
        /// https://wiki.factorio.com/Blueprint_string_format#Speaker_alert_parameter_object
        /// </summary>
        public record SpeakerAlertParameter
        {
            public bool ShowAlert { get; init; }
            public bool ShowOnMap { get; init; }
            public SignalId IconSiglnalId { get; init; } = new();
            public string AlertMessage { get; init; } = string.Empty;
        }
    }
}
