using FactorioTech.Core;
using FactorioTech.Core.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels.Requests
{
    public class CreateRequestBase
    {
        /// <summary>
        /// The hash of the payload that should be used to create this build version.
        /// The payload must have been previously created.
        /// </summary>
        /// <example>f8283ab0085a7e31c0ad3c43db36ae87</example>
        [Required]
        public Hash Hash { get; set; }

        /// <summary>
        /// The title or display name of the build.
        /// </summary>
        /// <example>My Awesome Build</example>
        [Required]
        [StringLength(100, MinimumLength = 3)]
        [DataType(DataType.Text)]
        public string Title { get; set; }

        /// <summary>
        /// The build description in Markdown.
        /// </summary>
        /// <example>Hello **World**!</example>
        [DataType(DataType.MultilineText)]
        public string? Description { get; set; }

        /// <summary>
        /// The build's tags.
        /// </summary>
        [Required]
        public IEnumerable<string> Tags { get; set; }

        /// <summary>
        /// Metadata for the version to be created.
        /// </summary>
        [Required]
        public VersionRequest Version { get; set; }

        /// <summary>
        /// The build's cover image is either a file upload or an existing blueprint rendering,
        /// along with a crop rectangle.
        /// </summary>
        [Required]
        public CoverRequest Cover { get; set; }
    }

    public class CreateVersionRequest : CreateRequestBase
    {
        /// <summary>
        /// The current (latest) version of the build. It must be specified to avoid concurrency issues.
        /// </summary>
        [Required]
        public Guid ExpectedPreviousVersionId { get; set; }
    }

    public class CreateBuildRequest : CreateRequestBase
    {
        /// <summary>
        /// The slug for the new build. It is used in the build's URL and must be unique per user.
        /// It can consist only of latin alphanumeric characters, underscores and hyphens.
        /// </summary>
        /// <example>my-awesome-build</example>
        [Required]
        [StringLength(AppConfig.Policies.Slug.MaximumLength, MinimumLength = AppConfig.Policies.Slug.MinimumLength)]
        [RegularExpression(AppConfig.Policies.Slug.AllowedCharactersRegex)]
        [Blocklist(AppConfig.Policies.Slug.Blocklist)]
        public string Slug { get; set; }
    }
}
