using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.ViewModels;

public class BuildsLinks
{
    /// <summary>
    ///     The absolute URL of the API endpoint to create a new build.
    ///     Only available if the call has been made with an authenticated user token.
    /// </summary>
    public LinkModel? CreateBuild { get; init; }

    /// <summary>
    ///     The absolute URL of the API endpoint to add a payload.
    ///     Only available if the call has been made with an authenticated user token.
    /// </summary>
    public LinkModel? CreatePayload { get; init; }

    /// <summary>
    ///     The absolute URL of the previous page of the results list.
    ///     Only available if the current page is not the first page.
    /// </summary>
    public LinkModel? Prev { get; init; }

    /// <summary>
    ///     The absolute URL of the next page of the results list.
    ///     Only available if there are more results to be returned.
    /// </summary>
    public LinkModel? Next { get; init; }
}

public class BuildsModel : ViewModelBase<BuildsLinks>
{
    /// <summary>
    ///     The number of results on the current page.
    /// </summary>
    [Required]
    public int CurrentCount { get; set; }

    /// <summary>
    ///     The total count of matching results.
    ///     TODO: currently this is the absolute total number of builds without any filtering applied.
    /// </summary>
    [Required]
    public int TotalCount { get; set; }

    /// <summary>
    ///     The paged, filtered and ordered list of matching builds.
    /// </summary>
    [Required]
    public IEnumerable<ThinBuildModel> Builds { get; set; } = Enumerable.Empty<ThinBuildModel>();
}
