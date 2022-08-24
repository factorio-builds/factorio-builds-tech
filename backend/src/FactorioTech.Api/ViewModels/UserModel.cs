using FactorioTech.Core;
using NodaTime;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels;

public class ThinUserModel
{
    /// <summary>
    ///     The user's username, also known as <em>slug</em>. It can consist only of latin alphanumeric characters,
    ///     underscores and hyphens.
    ///     It is used in URLs like the user's profile or build pages.
    /// </summary>
    /// <example>factorio_fritz</example>
    [Required]
    [StringLength(AppConfig.Policies.Slug.MaximumLength, MinimumLength = AppConfig.Policies.Slug.MinimumLength)]
    [RegularExpression(AppConfig.Policies.Slug.AllowedCharactersRegex)]
    public string Username { get; set; }
}

public class FullUserModel : ThinUserModel
{
    /// <summary>
    ///     The user's display name can <em>optionally</em> be set by a user. It is meant to be displayed across the
    ///     site in place of the <c>username</c>.
    ///     If the value is unset (<c>null</c>), the <c>username</c> should be displayed instead.
    /// </summary>
    /// <example>Factorio Fritz</example>
    public string? DisplayName { get; set; }

    /// <summary>
    ///     The user's registration timestamp in UTC.
    /// </summary>
    [Required]
    [DataType(DataType.DateTime)]
    public Instant RegisteredAt { get; set; }
}
