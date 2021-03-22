using System.Runtime.Serialization;

namespace FactorioTech.Core.Domain
{
    public enum PayloadType
    {
        [EnumMember(Value = "blueprint")]
        Blueprint,

        [EnumMember(Value = "blueprint-book")]
        Book,

        [EnumMember(Value = "deconstruction-planner")]
        DeconstructionPlanner,

        [EnumMember(Value = "upgrade-planner")]
        UpgradePlanner,
    }
}
