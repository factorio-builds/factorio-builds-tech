using Duende.IdentityServer.Services;
using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Identity.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;

namespace FactorioTech.Identity.Pages;

[AllowAnonymous]
[SecurityHeaders]
public class LogoutModel : PageModel
{
    private readonly SignInManager<User> signInManager;
    private readonly ILogger<LogoutModel> logger;
    private readonly IIdentityServerInteractionService interaction;

    public Uri FrontendUri { get; }

    public LogoutModel(
        SignInManager<User> signInManager,
        ILogger<LogoutModel> logger,
        IOptions<AppConfig> appConfig,
        IIdentityServerInteractionService interaction)
    {
        this.logger = logger;
        this.interaction = interaction;
        this.signInManager = signInManager;
        FrontendUri = appConfig.Value.WebUri;
    }

    public async Task<IActionResult> OnGetAsync(string? logoutId = null)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            await signInManager.SignOutAsync();
            logger.LogInformation("User logged out");

            var context = await interaction.GetLogoutContextAsync(logoutId);
            if (context.PostLogoutRedirectUri != null)
            {
                return Redirect(context.PostLogoutRedirectUri);
            }
        }

        return Page();
    }
}
