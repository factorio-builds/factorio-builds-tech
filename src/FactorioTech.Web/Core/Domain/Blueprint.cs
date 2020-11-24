using NodaTime;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.Core.Domain
{
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
        public string OwnerSlug { get; private set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; private set; }

        public string? Description { get; private set; }

        // navigation properties -> will be null if not included explicitly
        public User? Owner { get; private set; }
        public BlueprintVersion? LatestVersion { get; set; }
        public IEnumerable<User>? Followers { get; set; }

        public Blueprint(Guid id, Guid ownerId, string ownerSlug, Instant createdAt, string slug, string title, string? description)
        {
            Id = id;
            OwnerId = ownerId;
            OwnerSlug = ownerSlug;
            CreatedAt = createdAt;
            Slug = slug;
            Title = title;
            Description = description;
        }
    }
}
