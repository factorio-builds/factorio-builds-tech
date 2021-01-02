using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FactorioTech.Api.ViewModels
{
    public class BuildsModel : ViewModelBase
    {
        [Required]
        public int CurrentCount { get; set; }

        [Required]
        public int TotalCount { get; set; }

        [Required]
        public IEnumerable<ThinBuildModel> Builds { get; set; } = Enumerable.Empty<ThinBuildModel>();
    }
}
