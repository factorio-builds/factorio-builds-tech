using FactorioTech.Core;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.ViewModels
{
    public class CreateRequestBase : IValidatableObject
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
        public string Title { get; set; } = null!;

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
        public IEnumerable<string> Tags { get; set; } = null!;

        /// <summary>
        /// The build's icons.
        /// </summary>
        [Required]
        public IEnumerable<GameIcon> Icons { get; set; } = null!;

        /// <summary>
        /// Optional metadata for the version to be created.
        /// </summary>
        public VersionData? Version { get; set; }

        /// <summary>
        /// The build's cover image is either a file upload or an existing blueprint rendering,
        /// along with a crop rectangle.
        /// </summary>
        [Required]
        public ImageData Cover { get; set; } = null!;

        public class ImageData
        {
            /// <summary>
            /// The horizontal position of the crop rectangle.
            /// </summary>
            [Required]
            [Range(0, int.MaxValue)]
            public int X { get; set; }

            /// <summary>
            /// The vertical position of the crop rectangle.
            /// </summary>
            [Required]
            [Range(0, int.MaxValue)]
            public int Y { get; set; }

            /// <summary>
            /// The width of the crop rectangle.
            /// </summary>
            [Required]
            [Range(1, int.MaxValue)]
            public int Width { get; set; }

            /// <summary>
            /// The height of the crop rectangle.
            /// </summary>
            [Required]
            [Range(1, int.MaxValue)]
            public int Height { get; set; }

            /// <summary>
            /// The uploaded cover image.
            /// </summary>
            [DataType(DataType.Upload)]
            public IFormFile? File { get; set; }

            /// <summary>
            /// The hash of an existing blueprint rendering.
            /// </summary>
            public Hash? Hash { get; set; }
        }

        public class VersionData
        {
            /// <summary>
            /// An optional name for the version to be created.
            /// </summary>
            [StringLength(100, MinimumLength = 2)]
            [DataType(DataType.Text)]
            public string? Name { get; set; }

            /// <summary>
            /// An optional description for the version to be created.
            /// </summary>
            [DataType(DataType.MultilineText)]
            public string? Description { get; set; }
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Cover.File == null && Cover.Hash == null)
            {
                yield return new ValidationResult(
                    $"Either {nameof(Cover.File)} or {nameof(Cover.Hash)} must be set on {nameof(Cover)}.",
                    new[] { nameof(Cover) });
            }
            else if (Cover.File != null && Cover.Hash != null)
            {
                yield return new ValidationResult(
                    $"Only one of either {nameof(Cover.File)} or {nameof(Cover.Hash)} must be set on {nameof(Cover)}.",
                    new[] { nameof(Cover) });
            }
        }
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
        public string Slug { get; set; } = null!;
    }
}
