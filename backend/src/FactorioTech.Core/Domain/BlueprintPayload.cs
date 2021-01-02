using System;
using System.Collections.Generic;
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

        private sealed class HashEqualityComparer : IEqualityComparer<BlueprintPayload>
        {
            public bool Equals(BlueprintPayload? x, BlueprintPayload? y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Hash.Equals(y.Hash);
            }

            public int GetHashCode(BlueprintPayload obj) => obj.Hash.GetHashCode();
        }

        public static IEqualityComparer<BlueprintPayload> EqualityComparer => new HashEqualityComparer();
    }
}
