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
        private readonly ILogger<LogoutModel> _logger;
        private readonly SignInManager<User> _signInManager;

        public Uri FrontendUri { get; }

        public LogoutModel(
            ILogger<LogoutModel> logger,
            IOptions<AppConfig> appConfig,
            SignInManager<User> signInManager)
        {
            _logger = logger;
            _signInManager = signInManager;
            FrontendUri = appConfig.Value.WebUri;
        }

        public async Task<IActionResult> OnGetAsync(string? returnUrl = null)
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                await _signInManager.SignOutAsync();

                _logger.LogInformation("User logged out");

                if (returnUrl != null)
                {
                    return Redirect(returnUrl);
                }
            }

            return Page();
        }
    }
}
