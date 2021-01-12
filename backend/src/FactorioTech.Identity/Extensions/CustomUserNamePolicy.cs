using FactorioTech.Core;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FactorioTech.Identity.Extensions
{
    public class CustomUserNamePolicy : UserValidator<User>
    {
        public override async Task<IdentityResult> ValidateAsync(UserManager<User> userManager, User user)
        {
            var result = await base.ValidateAsync(userManager, user);
            var errors = result.Errors as List<IdentityError> ?? result.Errors.ToList();

            if (AppConfig.Policies.Slug.Blocklist.Contains(user.UserName.ToLowerInvariant()))
            {
                errors.Add(new IdentityError
                {
                    Description = "That username is not allowed. Please choose a different one!",
                });
            }

            if (user.UserName.Length < AppConfig.Policies.Slug.MinimumLength
                || user.UserName.Length > AppConfig.Policies.Slug.MaximumLength)
            {
                errors.Add(new IdentityError
                {
                    Description = $"The username must be between {AppConfig.Policies.Slug.MinimumLength} " +
                                  $"and {AppConfig.Policies.Slug.MaximumLength} characters in length.",
                });
            }

            if (!Regex.IsMatch(user.UserName, $"^{AppConfig.Policies.Slug.AllowedCharactersRegex}$"))
            {
                errors.Add(new IdentityError
                {
                    Description = $"The username must consist only of latin alpanumeric characters, hyphen or underscore.",
                });
            }

            return errors.Count == 0
                ? IdentityResult.Success
                : IdentityResult.Failed(errors.ToArray());
        }
    }
}
