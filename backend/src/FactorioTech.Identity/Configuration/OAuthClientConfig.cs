namespace FactorioTech.Identity.Configuration
{
    public class OAuthClientConfig
    {
        public AvailableOAuthClients OAuthClients { get; init; } = new();

        public record AvailableOAuthClients
        {
            public OAuthClientSettings Web { get; init; } = new()
            {
                ClientId = "frontend",
                ClientSecret = "511536EF-F270-4058-80CA-1C89C192F69A",
                RedirectUri = "https://local.factorio.tech/api/auth/callback",
                PostLogoutRedirectUri = "https://local.factorio.tech",
            };
        }

        public record OAuthClientSettings
        {
            public string ClientId { get; init; } = string.Empty;
            public string ClientSecret { get; init; } = string.Empty;
            public string RedirectUri { get; init; } = string.Empty;
            public string PostLogoutRedirectUri { get; init; } = string.Empty;
        }
    }
}
