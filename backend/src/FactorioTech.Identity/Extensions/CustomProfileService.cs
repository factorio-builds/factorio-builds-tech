using Duende.IdentityServer;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using FactorioTech.Core.Domain;
using FactorioTech.Identity.Configuration;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace FactorioTech.Identity.Extensions;

[AutoConstructor]
public partial class CustomProfileService : IProfileService
{
    private readonly UserManager<User> userManager;

    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var user = await userManager.GetUserAsync(context.Subject);

        if (context.RequestedResources.RawScopeValues.Contains(IdentityServerConstants.StandardScopes.Email))
        {
            context.IssuedClaims.Add(new Claim(ClaimTypes.Email, user.Email));
        }

        if (context.RequestedResources.RawScopeValues.Contains(IdentityServerConstants.StandardScopes.Profile))
        {
            context.IssuedClaims.Add(new Claim(IdentityConfig.ClaimTypes.UserName, user.UserName));
            context.IssuedClaims.Add(new Claim(IdentityConfig.ClaimTypes.RegisteredAt, user.RegisteredAt.ToDateTimeUtc().ToString("O")));

            if (user.DisplayName != null)
            {
                context.IssuedClaims.Add(new Claim(IdentityConfig.ClaimTypes.DisplayName, user.DisplayName));
            }

            if (user.TimeZone != null)
            {
                context.IssuedClaims.Add(new Claim(IdentityConfig.ClaimTypes.TimeZone, user.TimeZone.Id));
            }

            var roles = await userManager.GetRolesAsync(user);
            context.IssuedClaims.AddRange(roles.Select(role => new Claim(IdentityConfig.ClaimTypes.Role, role)));
        }
    }

    public async Task IsActiveAsync(IsActiveContext context)
    {
        context.IsActive = await userManager.GetUserAsync(context.Subject) != null;
    }
}
