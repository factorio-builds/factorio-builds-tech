using FactorioTech.Core.Domain;
using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels.Requests;

public class VersionRequest
{
    /// <summary>
    ///     The icons of the version to be created.
    /// </summary>
    [Required]
    public IEnumerable<GameIcon> Icons { get; set; }

    /// <summary>
    ///     An optional name for the version to be created.
    /// </summary>
    [StringLength(100, MinimumLength = 2)]
    [DataType(DataType.Text)]
    public string? Name { get; set; }

    /// <summary>
    ///     An optional description for the version to be created.
    /// </summary>
    [DataType(DataType.MultilineText)]
    public string? Description { get; set; }
}
