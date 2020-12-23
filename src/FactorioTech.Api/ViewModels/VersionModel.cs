using NodaTime;

namespace FactorioTech.Api.ViewModels
{
    public class VersionModel
    {
        public Instant CreatedAt { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public PayloadModel? Payload { get; set; }
    }
}
