using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FactorioTech.Api.ViewModels
{
    public class VersionsModel
    {
        [Required]
        public int Count { get; set; }

        [Required]
        public IEnumerable<ThinVersionModel> Versions { get; set; } = Enumerable.Empty<ThinVersionModel>();
    }
}
