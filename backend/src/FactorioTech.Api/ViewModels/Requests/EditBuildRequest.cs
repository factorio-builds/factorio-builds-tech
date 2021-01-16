using FactorioTech.Core.Domain;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.ViewModels.Requests
{
    public class EditBuildRequest : IValidatableObject
    {
        /// <summary>
        /// The title or display name of the build.
        /// If unset (`null`), the existing value will not be changed.
        /// </summary>
        /// <example>My Awesome Build</example>
        [Required]
        [StringLength(100, MinimumLength = 3)]
        [DataType(DataType.Text)]
        public string? Title { get; set; }

        /// <summary>
        /// The build description in Markdown.
        /// If unset (`null`), the existing value will not be changed.
        /// </summary>
        /// <example>Hello **World**!</example>
        [DataType(DataType.MultilineText)]
        public string? Description { get; set; }

        /// <summary>
        /// The build's tags.
        /// If unset (`null`), the existing value will not be changed.
        /// </summary>
        [Required]
        public IEnumerable<string>? Tags { get; set; }

        /// <summary>
        /// The build's icons.
        /// If unset (`null`), the existing value will not be changed.
        /// </summary>
        [Required]
        public IEnumerable<GameIcon>? Icons { get; set; }

        /// <summary>
        /// The build's cover image is either a file upload or an existing blueprint rendering,
        /// along with a crop rectangle.
        /// If unset (`null`), the existing value will not be changed.
        /// </summary>
        [Required]
        public CoverRequest? Cover { get; set; } = null!;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Cover != null && Cover.File == null && Cover.Hash == null)
            {
                yield return new ValidationResult(
                    $"Either {nameof(Cover.File)} or {nameof(Cover.Hash)} must be set on {nameof(Cover)}.",
                    new[] { nameof(Cover) });
            }
            else if (Cover?.File != null && Cover?.Hash != null)
            {
                yield return new ValidationResult(
                    $"Only one of either {nameof(Cover.File)} or {nameof(Cover.Hash)} must be set on {nameof(Cover)}.",
                    new[] { nameof(Cover) });
            }
        }
    }
}
