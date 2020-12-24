using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

#pragma warning disable 8618 // Non-nullable property must contain a non-null value when exiting constructor. Consider declaring the property as nullable.

namespace FactorioTech.Api.ViewModels
{
    public class BuildsModel
    {
        [Required]
        public IEnumerable<BuildModel> Builds { get; set; } = Enumerable.Empty<BuildModel>();
    }
}
