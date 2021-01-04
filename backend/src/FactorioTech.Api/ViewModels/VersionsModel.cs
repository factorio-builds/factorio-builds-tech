using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FactorioTech.Api.ViewModels
{
    public class VersionsModel
    {
        /// <summary>
        /// The number of results on the current page.
        /// </summary>
        [Required]
        public int Count { get; set; }

        /// <summary>
        /// The paged, filtered and ordered list of matching versions.
        /// </summary>
        [Required]
        public IEnumerable<ThinVersionModel> Versions { get; set; } = Enumerable.Empty<ThinVersionModel>();
    }
}
