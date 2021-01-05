using FactorioTech.Core;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.ViewModels
{
    public class CreateRequestBase : IValidatableObject
        {
            /// <summary>
            /// The hash of payload that should be used to create this build version.
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
            public string Title { get; set; } = null!;

            /// <summary>
            /// The build description in Markdown.
            /// </summary>
            /// <example>Hello **World**!</example>
            public string? Description { get; set; }

            /// <summary>
            /// An optional name for the version to be created.
            /// If empty, the hash will be used as version name.
            /// </summary>
            [StringLength(100, MinimumLength = 2)]
            public string? VersionName { get; set; }

            /// <summary>
            /// An optional description for the version to be created.
            /// </summary>
            [DisplayName("Description")]
            public string? VersionDescription { get; set; }

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
            /// The build's cover image is either a file upload or an existing blueprint rendering,
            /// along with a crop rectange.
            /// </summary>
            [Required]
            public ImageData Cover { get; set; } = null!;

            public class ImageData
            {
                /// <summary>
                /// The vertical horizontal of the crop rectangle.
                /// </summary>
                [Required]
                public int X { get; set; }

                /// <summary>
                /// The vertical position of the crop rectangle.
                /// </summary>
                [Required]
                public int Y { get; set; }

                /// <summary>
                /// The width of the crop rectangle.
                /// </summary>
                [Required]
                public int Width { get; set; }

                /// <summary>
                /// The height of the crop rectangle.
                /// </summary>
                [Required]
                public int Height { get; set; }

                /// <summary>
                /// The uploaded form-file.
                /// </summary>
                public IFormFile? File { get; set; }

                /// <summary>
                /// The hash of an existing blueprint rendering.
                /// </summary>
                public Hash? Hash { get; set; }
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
            public string Slug { get; set; } = null!;
        }
}
