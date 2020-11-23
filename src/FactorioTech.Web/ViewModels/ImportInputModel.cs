using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.ViewModels
{
    public class ImportInputModel
    {
        [Required]
        [RegularExpression(
            // base64 starting with "0"
            "^0(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$",
            ErrorMessage = "This doesn't appear to be a valid blueprint string.")]
        public string BlueprintString { get; set; } = string.Empty;

        public string? ParentSlug { get; set; }
    }
}
