using NodaTime;
using OneOf;
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
        public string Hash { get; set; }

        [Required]
        public FactorioApi.BlueprintEnvelope Payload { get; init; }

        public BlueprintVersion(Guid id, Guid blueprintId, Instant createdAt, string hash, OneOf<FactorioApi.Blueprint, FactorioApi.BlueprintBook> payload)
        {
            Id = id;
            BlueprintId = blueprintId;
            CreatedAt = createdAt;
            Hash = hash;
            Payload = payload.Match(
                blueprint => new FactorioApi.BlueprintEnvelope { Blueprint = blueprint },
                book => new FactorioApi.BlueprintEnvelope { BlueprintBook = book });
        }

        public BlueprintVersion(Guid id, Guid blueprintId, Instant createdAt, string hash, FactorioApi.BlueprintEnvelope payload)
        {
            Id = id;
            BlueprintId = blueprintId;
            CreatedAt = createdAt;
            Hash = hash;
            Payload = payload;
        }
    }
}
