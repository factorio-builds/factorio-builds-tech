using FactorioTech.Core;
using NodaTime;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class ThinUserModel
    {
        /// <summary>
        /// The user's username, also known as **slug**. It can consist only of latin alphanumeric characters, underscores and hyphens.
        /// It is used in URLs like the user's profile or build pages.
        /// </summary>
        /// <example>factorio_fritz</example>
        [Required]
        [StringLength(AppConfig.Policies.Slug.MaximumLength, MinimumLength = AppConfig.Policies.Slug.MinimumLength)]
        [RegularExpression(AppConfig.Policies.Slug.AllowedCharactersRegex)]
        public string Username { get; set; }
    }

    public class UserModel : ThinUserModel
    {
        /// <summary>
        /// The user's display name can **optionally** be set by a user. It is meant to be displayed across the site in place of the `username`.
        /// If it is not set (`null`), the `username` should be displayed instead.
        /// </summary>
        /// <example>Factorio Fritz</example>
        public string? DisplayName { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public Instant RegisteredAt { get; set; }
    }
}
