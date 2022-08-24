using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.ViewModels.Requests;

public class CoverRequest : IValidatableObject
{
    /// <summary>
    ///     The uploaded cover image.
    /// </summary>
    [DataType(DataType.Upload)]
    public IFormFile? File { get; set; }

    /// <summary>
    ///     The hash of an existing blueprint rendering.
    /// </summary>
    public Hash? Hash { get; set; }

    /// <summary>
    ///     An optional rectangle to specify how the image should be cropped before it is resized.
    ///     If unspecified, the image will not be cropped and only resized to fit the cover limits.
    /// </summary>
    public ImageService.CropRectangle? Crop { get; set; }

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
