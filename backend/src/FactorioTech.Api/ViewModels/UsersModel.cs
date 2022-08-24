using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Api.ViewModels;

public class UsersModel
{
    /// <summary>
    ///     The number of results on the current page.
    /// </summary>
    [Required]
    public int Count { get; set; }

    /// <summary>
    ///     The paged, filtered and ordered list of matching users.
    /// </summary>
    [Required]
    public IEnumerable<FullUserModel> Users { get; set; } = Enumerable.Empty<FullUserModel>();
}
