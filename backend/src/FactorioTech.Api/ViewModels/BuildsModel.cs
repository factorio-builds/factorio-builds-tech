using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class BuildsLinks
    {
        public LinkModel CreateBuild { get; init; }
        public LinkModel CreatePayload { get; init; }
        public LinkModel? Prev { get; init; }
        public LinkModel? Next { get; init; }
    }

    public class BuildsModel : ViewModelBase<BuildsLinks>
    {
        [Required]
        public int CurrentCount { get; set; }

        [Required]
        public int TotalCount { get; set; }

        [Required]
        public IEnumerable<ThinBuildModel> Builds { get; set; } = Enumerable.Empty<ThinBuildModel>();
    }
}
