using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Identity.Extensions;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using NodaTime;
using SluggyUnidecode;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FactorioTech.Identity.Pages
{
    [AllowAnonymous]
    [SecurityHeaders]
    public class ExternalLoginModel : PageModel
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<ExternalLoginModel> _logger;
        private readonly IIdentityServerInteractionService _interaction;

        public ExternalLoginModel(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            ILogger<ExternalLoginModel> logger,
            IIdentityServerInteractionService interaction)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _interaction = interaction;
        }

        [BindProperty]
        public InputModel Input { get; set; } = new();

        public string? ProviderDisplayName { get; set; }

        public string? ReturnUrl { get; set; }

        [TempData]
        public string? ErrorMessage { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required]
            [StringLength(AppConfig.Policies.Slug.MaximumLength, MinimumLength = AppConfig.Policies.Slug.MinimumLength)]
            [RegularExpression(AppConfig.Policies.Slug.AllowedCharactersRegex)]
            [Blocklist(AppConfig.Policies.Slug.Blocklist)]
            [DisplayName("Username")]
            public string UserName { get; set; } = string.Empty;

            [StringLength(100, MinimumLength = 3)]
            [DisplayName("Display name")]
            public string? DisplayName { get; set; }
        }

        public IActionResult OnPost(string? provider, string? returnUrl = null)
        {
            var redirectUrl = Url.Page("./ExternalLogin", pageHandler: "Callback", values: new { returnUrl });
            if (Url.IsLocalUrl(returnUrl) == false && _interaction.IsValidReturnUrl(returnUrl) == false)
            {
                _logger.LogError("Invalid return url: {ReturnUrl}", returnUrl);
                ErrorMessage = "Error: That return url is invalid - you might have clicked on a malicious link!";
                return RedirectToPage("./Login", new { ReturnUrl });
            }

            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return new ChallengeResult(provider, properties);
        }

        public async Task<IActionResult> OnGetCallbackAsync(string? returnUrl = null, string? remoteError = null)
        {
            ReturnUrl = returnUrl ?? Url.Content("~/");

            if (remoteError != null)
            {
                ErrorMessage = $"Error from external provider: {remoteError}";
                return RedirectToPage("./Login", new { ReturnUrl });
            }

            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                ErrorMessage = "Error loading external login information.";
                return RedirectToPage("./Login", new { ReturnUrl });
            }

            // Sign in the user with this external login provider if the user already has a login.
            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: true, bypassTwoFactor: true);
            if (result.Succeeded)
            {
                _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity!.Name, info.LoginProvider);
                return LocalRedirect(ReturnUrl);
            }

            if (result.IsLockedOut)
            {
                return RedirectToPage("./Lockout");
            }

            // If the user does not have an account, then ask the user to create an account.
            ProviderDisplayName = info.ProviderDisplayName;

            Input = ProviderDisplayName switch
            {
                "GitHub" => new InputModel
                {
                    Email = info.Principal.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty,
                    UserName = info.Principal.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty,
                    DisplayName = info.Principal.FindFirst("urn:github:name")?.Value,
                },
                _ => new InputModel
                {
                    Email = info.Principal.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty,
                    UserName = info.Principal.FindFirst(ClaimTypes.Name)?.Value.ToSlug() ?? string.Empty,
                    DisplayName = info.Principal.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty,
                },
            };

            return Page();
        }

        public async Task<IActionResult> OnPostConfirmationAsync(string? returnUrl = null)
        {
            ReturnUrl = returnUrl ?? Url.Content("~/");

            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                ErrorMessage = "Error loading external login information during confirmation.";
                return RedirectToPage("./Login", new { ReturnUrl });
            }

            if (ModelState.IsValid)
            {
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    UserName = Input.UserName,
                    DisplayName = Input.DisplayName,
                    Email = Input.Email,
                    RegisteredAt = SystemClock.Instance.GetCurrentInstant(),
                };

                var result = await _userManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await _userManager.AddLoginAsync(user, info);
                    if (result.Succeeded)
                    {
                        _logger.LogInformation("User created an account using {Name} provider.", info.LoginProvider);

                        var userId = await _userManager.GetUserIdAsync(user);
                        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                        var callbackUrl = Url.Page(
                            "/Account/ConfirmEmail",
                            pageHandler: null,
                            values: new { area = "Identity", userId, code },
                            protocol: Request.Scheme);

                        // todo: consider doing this
                        //await _emailSender.SendEmail(Input.Email, "Confirm your email",
                        //    $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                        if (_userManager.Options.SignIn.RequireConfirmedAccount)
                        {
                            return RedirectToPage("./RegisterConfirmation", new { Input.Email });
                        }

                        await _signInManager.SignInAsync(user, true, info.LoginProvider);

                        return LocalRedirect(ReturnUrl);
                    }
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            ProviderDisplayName = info.ProviderDisplayName;
            return Page();
        }
    }
}
