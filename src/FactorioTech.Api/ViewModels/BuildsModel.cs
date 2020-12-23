using System.Collections.Generic;
using System.Linq;

namespace FactorioTech.Api.ViewModels
{
    public class BuildsModel
    {
        public IEnumerable<BuildModel> Builds { get; set; } = Enumerable.Empty<BuildModel>();
    }
}
