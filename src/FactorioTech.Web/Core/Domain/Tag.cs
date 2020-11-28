using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
    public record Tag
    {
        [Required]
        [MaxLength(56)]
        public string Value { get; init; }

        public Tag(string value) => Value = value;

        public override string ToString() => Value;

        // required for EF
        public Guid BlueprintId { get; set; }
    }
}
