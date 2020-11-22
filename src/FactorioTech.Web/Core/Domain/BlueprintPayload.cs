using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
    public class BlueprintPayload
    {
        [Key]
        public Guid Id { get; init; }

        [Required]
        [MaxLength(32)]
        [MinLength(32)]
        public string Hash { get; set; }

        [Required]
        public string Encoded { get; init; }

        [Required]
        public FactorioApi.BlueprintEnvelope Envelope { get; init; }

        // navigation properties -> will be null if not included explicitly

        [Required]
        public BlueprintVersion? Version { get; set; }
        public Guid VersionId { get; set; }

        public BlueprintPayload(Guid id, string hash, string encoded, FactorioApi.BlueprintEnvelope envelope)
        {
            Id = id;
            Hash = hash;
            Encoded = encoded;
            Envelope = envelope;
        }
    }
}
