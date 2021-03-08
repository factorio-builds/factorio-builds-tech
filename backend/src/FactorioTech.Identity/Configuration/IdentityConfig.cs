using Duende.IdentityServer;
using Duende.IdentityServer.Models;
using FactorioTech.Core;
using IdentityModel;
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
            public const string Role = JwtClaimTypes.Role;
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
                    ClaimTypes.Role,
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
            var web = new Client
            {
                ClientId = clientConfig.Web.ClientId,
                ClientSecrets = { new Secret(clientConfig.Web.ClientSecret.Sha256()) },
                RedirectUris = { clientConfig.Web.RedirectUri },
                PostLogoutRedirectUris = { clientConfig.Web.PostLogoutRedirectUri },
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

            if (environment.IsProduction())
                return new[] { web };

            web.RedirectUris.Add("http://localhost:3000/api/auth/callback");
            web.RedirectUris.Add("https://local.factorio.tech/api/auth/callback");
            web.PostLogoutRedirectUris.Add("http://localhost:3000");

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

            return new[] { web, swagger };
        }
    }
}
