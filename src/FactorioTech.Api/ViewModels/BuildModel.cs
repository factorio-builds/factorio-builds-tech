using NodaTime;
using System.Collections.Generic;

namespace FactorioTech.Api.ViewModels
{
    public class BuildModel
    {
        public string Slug { get; set; }
        public Instant CreatedAt { get; set; }
        public Instant UpdatedAt { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public UserModel Owner { get; set; }
        public VersionModel? LatestVersion { get; set; }
        public string LatestGameVersion { get; set; }
        public IEnumerable<string>? Tags { get; set; }
    }
}
