using System.Runtime.Serialization;

namespace FactorioTech.Core.Domain
{
    public enum BlueprintType
    {
        [EnumMember(Value = "blueprint")]
        Blueprint,

        [EnumMember(Value = "blueprint-book")]
        Book,
    }
}
