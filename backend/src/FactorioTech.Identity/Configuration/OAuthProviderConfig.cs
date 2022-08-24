namespace FactorioTech.Identity.Configuration;

public class OAuthProviderConfig
{
    public IDictionary<string, OAuthProviderCredentials>? OAuthProviders { get; init; }

    public record OAuthProviderCredentials
    {
        public string ClientId { get; init; } = string.Empty;
        public string ClientSecret { get; init; } = string.Empty;
    }
}