using NodaTime;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain
{
    public class BlueprintVersion
    {
        [Key]
        public Guid VersionId { get; init; }

        [Required]
        public Guid BlueprintId { get; init; }

        [Required]
        public Instant CreatedAt { get; init; }

        [Required]
        [MaxLength(32)]
        [MinLength(32)]
        public Hash Hash { get; init; }

        [Required]
        public BlueprintType Type { get; init; }

        [Required]
        public Version GameVersion { get; init; }

        [MaxLength(100)]
        public string? Name { get; init; }

        public string? Description { get; init; }

        [Required]
        public IEnumerable<GameIcon> Icons { get; init; }

        // navigation properties -> will be null if not included explicitly

        public BlueprintPayload? Payload { get; init; }

        public Blueprint? Blueprint { get; init; }

        public BlueprintVersion(
            Guid versionId,
            Guid blueprintId,
            Instant createdAt,
            Hash hash,
            BlueprintType type,
            Version gameVersion,
            string? name,
            string? description,
            IEnumerable<GameIcon> icons)
        {
            VersionId = versionId;
            BlueprintId = blueprintId;
            CreatedAt = createdAt;
            GameVersion = gameVersion;
            Hash = hash;
            Type = type;
            Name = name;
            Description = description;
            Icons = icons;
        }

#pragma warning disable 8618 // required for EF
        private BlueprintVersion() { }
#pragma warning restore 8618
    }
}
