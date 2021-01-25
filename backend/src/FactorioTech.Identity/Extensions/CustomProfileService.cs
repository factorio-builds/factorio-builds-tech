using Duende.IdentityServer;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using FactorioTech.Core.Domain;
using FactorioTech.Identity.Configuration;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FactorioTech.Identity.Extensions
{
    public class CustomProfileService : IProfileService
    {
        private readonly UserManager<User> _userManager;

        public CustomProfileService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var user = await _userManager.GetUserAsync(context.Subject);

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

                var roles = await _userManager.GetRolesAsync(user);
                context.IssuedClaims.AddRange(roles.Select(role => new Claim(IdentityConfig.ClaimTypes.Role, role)));
            }
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            context.IsActive = await _userManager.GetUserAsync(context.Subject) != null;
        }
    }
}
