using System.Collections.Generic;

namespace FactorioTech.Identity.Configuration
{
    public class OAuthClientConfig
    {
        public AvailableOAuthClients OAuthClients { get; init; } = new();

        public record AvailableOAuthClients
        {
            public OAuthClientSettings Frontend { get; init; } = new()
            {
                ClientId = "frontend",
                ClientSecret = "511536EF-F270-4058-80CA-1C89C192F69A",
                RedirectUris = { "http://localhost:3000/api/callback", "https://local.factorio.tech/api/callback" },
                PostLogoutRedirectUris = { "http://localhost:3000", "https://local.factorio.tech" },
            };
        }

        public record OAuthClientSettings
        {
            public string ClientId { get; init; } = string.Empty;
            public string ClientSecret { get; init; } = string.Empty;
            public ICollection<string> RedirectUris { get; init; } = new HashSet<string>();
            public ICollection<string> PostLogoutRedirectUris { get; init; } = new HashSet<string>();
        }
    }
}
