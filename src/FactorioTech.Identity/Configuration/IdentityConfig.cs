using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using System.Collections.Generic;

namespace FactorioTech.Identity.Configuration
{
    public static class IdentityConfig
    {
        public static class ClaimTypes
        {
            public const string UserName = "username";
            public const string DisplayName = JwtClaimTypes.Name;
            public const string RegisteredAt = "registered_at";
            public const string TimeZone = JwtClaimTypes.ZoneInfo;
        }

        public class Profile : IdentityResource
        {
            public Profile()
            {
                Name = IdentityServerConstants.StandardScopes.Profile;
                DisplayName = "User profile";
                Description = "Your user profile information";
                Emphasize = true;
                UserClaims = new []
                {
                    ClaimTypes.UserName,
                    ClaimTypes.DisplayName,
                    ClaimTypes.RegisteredAt,
                    ClaimTypes.TimeZone,
                };
            }
        }

        public static IEnumerable<IdentityResource> GetIdentityResources() => new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Email(),
            new Profile(),
        };

        public static IEnumerable<Client> GetClients(OAuthClientConfig.AvailableOAuthClients clientConfig) => new []
        {
            new Client
            {
                ClientId = clientConfig.Frontend.ClientId,
                ClientSecrets = { new Secret(clientConfig.Frontend.ClientSecret.Sha256()) },
                RedirectUris = clientConfig.Frontend.RedirectUris,
                PostLogoutRedirectUris = clientConfig.Frontend.PostLogoutRedirectUris,
                AllowedGrantTypes = GrantTypes.Code,
                AllowOfflineAccess = true,
                RequireConsent = false,
                AlwaysSendClientClaims = true,
                AlwaysIncludeUserClaimsInIdToken = true,

                // todo: get this working
                RequirePkce = false,

                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    IdentityServerConstants.StandardScopes.Email,
                },
            },
        };
    }
}
