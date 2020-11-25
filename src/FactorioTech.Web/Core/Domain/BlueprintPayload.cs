using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
    public class BlueprintPayload
    {
        [Key]
        public Guid VersionId { get; init; }

        [Required]
        [MaxLength(32)]
        [MinLength(32)]
        public Hash Hash { get; init; }

        [Required]
        public string Encoded { get; init; }

        public BlueprintPayload(Guid versionId, Hash hash, string encoded)
        {
            VersionId = versionId;
            Hash = hash;
            Encoded = encoded;
        }
    }
}
