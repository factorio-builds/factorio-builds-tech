using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.ViewModels
{
    public class SlugValidationResult
    {
        [Required]
        public string Slug { get; set; }

        [Required]
        public bool IsValid { get; set; }

        [Required]
        public bool IsAvailable { get; set; }

        public SlugValidationResult(string slug, bool isValid = false, bool isAvailable = false)
        {
            Slug = slug;
            IsValid = isValid;
            IsAvailable = isAvailable;
        }

        public static SlugValidationResult Success(string slug) => new(slug, true, true);
        public static SlugValidationResult Invalid(string slug) => new(slug, false, false);
        public static SlugValidationResult Unavailable(string slug) => new(slug, true, false);
    }
}
