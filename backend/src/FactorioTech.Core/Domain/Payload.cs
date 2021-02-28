using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain
{
    public class Payload
    {
        [Key]
        [MaxLength(32)]
        [MinLength(32)]
        public Hash Hash { get; init; }

        [Required]
        public PayloadType Type { get; init; }

        [Required]
        public Version GameVersion { get; init; }

        [Required]
        public string Encoded { get; init; }

        public Payload(Hash hash, PayloadType type, Version gameVersion, string encoded)
        {
            Hash = hash;
            Type = type;
            GameVersion = gameVersion;
            Encoded = encoded;
        }

#pragma warning disable 8618 // required for EF
        private Payload() { }
#pragma warning restore 8618

        private sealed class HashEqualityComparer : IEqualityComparer<Payload>
        {
            public bool Equals(Payload? x, Payload? y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Hash.Equals(y.Hash);
            }

            public int GetHashCode(Payload obj) => obj.Hash.GetHashCode();
        }

        public static IEqualityComparer<Payload> EqualityComparer => new HashEqualityComparer();
    }
}
