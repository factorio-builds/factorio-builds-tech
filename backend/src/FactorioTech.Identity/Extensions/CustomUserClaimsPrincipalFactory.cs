using FactorioTech.Core;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FactorioTech.Identity.Extensions
{
    public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<User, Role>
    {
        public CustomUserClaimsPrincipalFactory(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, roleManager, optionsAccessor)
        {
        }

        public override async Task<ClaimsPrincipal> CreateAsync(User user)
        {
            var principal = await base.CreateAsync(user);
            if (principal.Identity is ClaimsIdentity identity)
            {
                identity.AddClaims(new Claim[]
                {
                    new("urn:factorio-tech:displayname", user.DisplayName ?? user.UserName),
                    new("urn:factorio-tech:timezone", user.TimeZone?.Id ?? AppConfig.DefaultTimeZone.Id),
                });
            }

            return principal;
        }
    }
}
