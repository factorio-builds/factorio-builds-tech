using Duende.IdentityServer.Services;
using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Identity.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace FactorioTech.Identity.Pages
{
    [AllowAnonymous]
    [SecurityHeaders]
    public class LogoutModel : PageModel
    {
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<LogoutModel> _logger;
        private readonly IIdentityServerInteractionService _interaction;

        public Uri FrontendUri { get; }

        public LogoutModel(
            SignInManager<User> signInManager,
            ILogger<LogoutModel> logger,
            IOptions<AppConfig> appConfig,
            IIdentityServerInteractionService interaction)
        {
            _logger = logger;
            _interaction = interaction;
            _signInManager = signInManager;
            FrontendUri = appConfig.Value.WebUri;
        }

        public async Task<IActionResult> OnGetAsync(string? logoutId = null)
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                await _signInManager.SignOutAsync();
                _logger.LogInformation("User logged out");

                var context = await _interaction.GetLogoutContextAsync(logoutId);
                if (context.PostLogoutRedirectUri != null)
                {
                    return Redirect(context.PostLogoutRedirectUri);
                }
            }

            return Page();
        }
    }
}
