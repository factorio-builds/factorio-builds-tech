using FactorioTech.Core;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
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

        public static IEnumerable<Client> GetClients(
            IWebHostEnvironment environment, AppConfig appConfig,
            OAuthClientConfig.AvailableOAuthClients clientConfig)
        {
            var frontend = new Client
            {
                ClientId = clientConfig.Frontend.ClientId,
                ClientSecrets = { new Secret(clientConfig.Frontend.ClientSecret.Sha256()) },
                RedirectUris = { clientConfig.Frontend.RedirectUri },
                PostLogoutRedirectUris = { clientConfig.Frontend.PostLogoutRedirectUri },
                AllowedGrantTypes = GrantTypes.Code,
                AllowOfflineAccess = true,
                RequireConsent = false,
                AlwaysSendClientClaims = true,
                AlwaysIncludeUserClaimsInIdToken = true,

                // todo: the auth library used by the frontend doen't support PKCE
                // see https://github.com/auth0/nextjs-auth0/issues/109
                RequirePkce = false,

                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    IdentityServerConstants.StandardScopes.Email,
                },
            };

            if (environment.IsProduction())
                return new[] { frontend };

            frontend.RedirectUris.Add("http://localhost:3000/api/callback");
            frontend.RedirectUris.Add("https://local.factorio.tech/api/callback");

            var swagger = new Client
            {
                ClientId = "swagger",
                ClientSecrets = { new Secret("swagger".Sha256()) },
                RedirectUris = { appConfig.ApiUri.AbsoluteUri + "swagger/oauth2-redirect.html" },
                AllowedGrantTypes = GrantTypes.Code,
                AllowOfflineAccess = true,
                RequireConsent = false,
                AlwaysSendClientClaims = true,
                AlwaysIncludeUserClaimsInIdToken = true,

                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    IdentityServerConstants.StandardScopes.Email,
                },
            };

            return new[] { frontend, swagger };
        }
    }
}
