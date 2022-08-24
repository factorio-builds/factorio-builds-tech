using FactorioTech.Api.Extensions;
using FactorioTech.Core.Domain;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.ViewModels.Requests;

public class EditBuildRequest
{
    /// <summary>
    ///     The title or display name of the build.
    ///     If unset (<c>null</c>), the existing value will not be changed.
    /// </summary>
    /// <example>My Awesome Build</example>
    [StringLength(100, MinimumLength = 3)]
    [DataType(DataType.Text)]
    public string? Title { get; set; }

    /// <summary>
    ///     The build description in Markdown.
    ///     If unset (<c>null</c>), the existing value will not be changed.
    /// </summary>
    /// <example>Hello **World**!</example>
    [DataType(DataType.MultilineText)]
    public string? Description { get; set; }

    /// <summary>
    ///     The build's tags.
    ///     If unset (<c>null</c>), the existing value will not be changed.
    /// </summary>
    [ValidateTag]
    public IEnumerable<string>? Tags { get; set; }

    /// <summary>
    ///     The build's icons.
    ///     If unset (<c>null</c>), the existing value will not be changed.
    /// </summary>
    public IEnumerable<GameIcon>? Icons { get; set; }

    /// <summary>
    ///     The build's cover image is either a file upload or an existing blueprint rendering,
    ///     along with a crop rectangle.
    ///     If unset (<c>null</c>), the existing value will not be changed.
    /// </summary>
    public CoverRequest? Cover { get; set; }
}
