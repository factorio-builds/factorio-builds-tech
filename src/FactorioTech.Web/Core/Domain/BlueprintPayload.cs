using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
    public class BlueprintPayload
    {
        [Key]
        [MaxLength(32)]
        [MinLength(32)]
        public Hash Hash { get; init; }

        [Required]
        public string Encoded { get; init; }

        public BlueprintPayload(Hash hash, string encoded)
        {
            Hash = hash;
            Encoded = encoded;
        }
    }
}
