namespace FactorioTech.Web.Core.Domain
{
    public sealed class Blueprint
    {
        public string Id { get; init; } = string.Empty;

        public string OwnerId { get; init; } = string.Empty;

        //public string Encoded { get; }
        //public FactorioApi.Blueprint Payload { get; }
    }
}
