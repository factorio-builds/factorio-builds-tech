using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain
{
    public class BlueprintPayload
    {
        [Key]
        [MaxLength(32)]
        [MinLength(32)]
        public Hash Hash { get; init; }

        [Required]
        public string Encoded { get; init; }

        [Required]
        public Version GameVersion { get; init; }

        public BlueprintPayload(Hash hash, string encoded, Version gameVersion)
        {
            Hash = hash;
            Encoded = encoded;
            GameVersion = gameVersion;
        }

#pragma warning disable 8618 // required for EF
        private BlueprintPayload()
        {
        }
#pragma warning restore 8618
    }
}
