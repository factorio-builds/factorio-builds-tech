using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain
{
    public record Tag
    {
        [Required]
        [MaxLength(56)]
        public string Value { get; init; }

        public Tag(string value) => Value = value;

        public override string ToString() => Value;

        public static Tag FromString(string value) => new(value);

        // required for EF
        public Guid BlueprintId { get; set; }
    }
}
