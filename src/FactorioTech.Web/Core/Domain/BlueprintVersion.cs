using NodaTime;
using System;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
    public class BlueprintVersion
    {
        [Key]
        public Guid Id { get; init; }

        [Required]
        public Guid BlueprintId { get; init; }

        [Required]
        public Instant CreatedAt { get; init; }

        [Required]
        [MaxLength(32)]
        [MinLength(32)]
        public string Hash { get; init; }

        [Required]
        public BlueprintPayload? Payload { get; init; }

        public BlueprintVersion(Guid id, Guid blueprintId, Instant createdAt, BlueprintPayload payload)
        {
            Id = id;
            BlueprintId = blueprintId;
            CreatedAt = createdAt;
            Hash = payload.Hash;
            Payload = payload;
        }

#pragma warning disable 8618 // required for EF
        private BlueprintVersion()
        {
        }
#pragma warning restore 8618
    }
}
