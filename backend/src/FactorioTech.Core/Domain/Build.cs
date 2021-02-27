using NodaTime;
using NpgsqlTypes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FactorioTech.Core.Domain
{
    public class Build
    {
        [Key]
        public Guid BuildId { get; init; }

        [Required]
        public Guid OwnerId { get; init; }

        [Required]
        public Instant CreatedAt { get; init; }

        [Required]
        public Instant UpdatedAt { get; private set; }

        [Required]
        [MaxLength(100)]
        public string Slug { get; init; }

        [Required]
        [MaxLength(100)]
        public string Title { get; private set; }

        public string? Description { get; private set; }

        // denormalized data for better query performance

        [Required]
        [MaxLength(100)]
        public string NormalizedSlug { get; init; }

        [Required]
        [MaxLength(100)]
        public string OwnerSlug { get; init; }

        [Required]
        [MaxLength(100)]
        public string NormalizedOwnerSlug { get; init; }

        [Required]
        [MaxLength(16)]
        public string LatestGameVersion { get; private set; }

        [Required]
        public PayloadType LatestType { get; private set; }

        [Required]
        public IEnumerable<GameIcon> Icons { get; private set; }

        [Required]
        public string[] Tags { get; private set; }

        [Required]
        public ImageMeta CoverMeta { get; private set; }

        // navigation properties -> will be null if not included explicitly

        public BuildVersion? LatestVersion { get; private set; }
        public Guid? LatestVersionId { get; private set; }
        public User? Owner { get; init; }
        public IEnumerable<User>? Followers { get; init; }
        public NpgsqlTsVector? SearchVector { get; init; }

        // computed property -> will be set by the query

        public int FollowerCount { get; init; }

        public Build(
            Guid buildId,
            User owner,
            Instant createdAt, Instant updatedAt,
            string slug,
            IEnumerable<string> tags,
            string title,
            string? description,
            ImageMeta coverMeta)
        {
            BuildId = buildId;
            OwnerId = owner.Id;
            OwnerSlug = owner.UserName;
            NormalizedOwnerSlug = owner.NormalizedUserName;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            Slug = slug;
            NormalizedSlug = slug.ToUpperInvariant();
            Title = title;
            Description = description;
            LatestGameVersion = "0.0.0.0";
            LatestType = PayloadType.Blueprint;
            Icons = Array.Empty<GameIcon>();
            Tags = tags.Distinct().ToArray();
            CoverMeta = coverMeta;
        }

#pragma warning disable 8618 // required for EF
        private Build() { }
#pragma warning restore 8618

        public void UpdateLatestVersion(BuildVersion version)
        {
            UpdatedAt = version.CreatedAt;
            LatestVersion = version;
            LatestVersionId = version.VersionId;
            LatestGameVersion = version.GameVersion.ToString(4);
            LatestType = version.Type;
            Icons = version.Icons;
        }

        public void UpdateDetails(Instant now, string? title, string? description, IEnumerable<string>? tags, ImageMeta? coverMeta)
        {
            if (title != null)
            {
                Title = title.Trim();
            }

            if (description != null)
            {
                Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
            }

            if (tags != null)
            {
                Tags = tags.Distinct().ToArray();
            }

            if (coverMeta != null)
            {
                CoverMeta = coverMeta;
            }

            UpdatedAt = now;
        }
    }
}
