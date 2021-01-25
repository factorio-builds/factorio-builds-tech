using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.ViewModels.Requests
{
    public class CoverRequest : IValidatableObject
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

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (File == null && Hash == null)
            {
                yield return new ValidationResult($"Either {nameof(File)} or {nameof(Hash)} must be set.");
            }
            else if (File != null && Hash != null)
            {
                yield return new ValidationResult($"Only one of either {nameof(File)} or {nameof(Hash)} must be set.");
            }
        }
    }
}
