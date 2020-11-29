using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Web.ViewModels
{
    public class CreateInputModel
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        [RegularExpression("[a-z0-9_-]+",
            ErrorMessage = "Only lowercase latin characters (a-z), digits (0-9), underscore (_) and hyphen (-) are allowed.")]
        //[PageRemote( // todo: doesn't work nested due to prefixed __RequestVerificationToken :(
        //    PageHandler ="CheckSlug",
        //    HttpMethod = nameof(HttpMethod.Post),
        //    ErrorMessage = "You already have a blueprint with that slug",
        //    AdditionalFields = "__RequestVerificationToken")]
        public string Slug { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
            
        [DisplayName("Version name or number")]
        [StringLength(100, MinimumLength = 2)]
        public string? VersionName { get; set; }

        [DisplayName("Description")]
        public string? VersionDescription { get; set; }

        [Required]
        [DisplayName("Tags")]
        public IEnumerable<string>? Tags { get; set; }
    }
}
