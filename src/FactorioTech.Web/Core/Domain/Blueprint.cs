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
        public FactorioApi.Blueprint Payload { get; init; }

        public BlueprintVersion(Guid id, Guid blueprintId, Instant createdAt, FactorioApi.Blueprint payload)
        {
            Id = id;
            BlueprintId = blueprintId;
            CreatedAt = createdAt;
            Payload = payload;
        }
    }


    public class Blueprint
    {
        [Key]
        public Guid Id { get; init; }

        [Required]
        public Guid OwnerId { get; init; }

        [Required]
        public Instant CreatedAt { get; init; }

        [Required]
        [MaxLength(100)]
        public string Slug { get; private set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; private set; }

        public string? Description { get; private set; }

        public BlueprintVersion CurrentVersion { get; private set; }

        public Blueprint(Guid id, Guid ownerId, Instant createdAt, string slug, string title, string? description, BlueprintVersion currentVersion)
        {
            Id = id;
            OwnerId = ownerId;
            CreatedAt = createdAt;
            Slug = slug;
            Title = title;
            Description = description;
            CurrentVersion = currentVersion;
        }
    }
}
