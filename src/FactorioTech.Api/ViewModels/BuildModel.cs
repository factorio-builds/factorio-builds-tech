using NodaTime;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class BuildModel
    {
        /// <summary>
        /// <example>my-awesome-build</example>
        /// </summary>
        [Required]
        public string Slug { get; set; }

        [Required]
        public Instant CreatedAt { get; set; }

        [Required]
        public Instant UpdatedAt { get; set; }

        [Required]
        public string LatestGameVersion { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string? Description { get; set; }

        [Required]
        public UserModel Owner { get; set; }

        public VersionModel? LatestVersion { get; set; }

        public IEnumerable<string>? Tags { get; set; }
    }
}
