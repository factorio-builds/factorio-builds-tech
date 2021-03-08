using Duende.IdentityServer.Extensions;
using FactorioTech.Core.Domain;
using FactorioTech.Identity.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FactorioTech.Identity.Pages
{
    [AllowAnonymous]
    [SecurityHeaders]
    public class LoginModel : PageModel
    {
        public bool AllowLocalLogin { get; }
        public IEnumerable<AuthenticationScheme> ExternalLogins { get; set; } = Enumerable.Empty<AuthenticationScheme>();
        public string? ReturnUrl { get; set; }


        [BindProperty]
        public InputModel Input { get; set; } = new();

        public class InputModel
        {
            [Required]
            public string Username { get; set; } = string.Empty;

            [Required]
            [DataType(DataType.Password)]
            public string Password { get; set; } = string.Empty;

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; } = false;
        }

        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<LoginModel> _logger;

        public LoginModel(
            SignInManager<User> signInManager,
            ILogger<LoginModel> logger,
            IHostEnvironment environment)
        {
            _signInManager = signInManager;
            _logger = logger;

            AllowLocalLogin = !environment.IsProduction();
        }

        public async Task<IActionResult> OnGetAsync(string? returnUrl = null)
        {
            ReturnUrl = returnUrl ?? Url.Page("./Manage/Index");

            if (User.IsAuthenticated())
            {
                _logger.LogInformation("User is already logged in.");
                return LocalRedirect(ReturnUrl);
            }

            ExternalLogins = await _signInManager.GetExternalAuthenticationSchemesAsync();
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(string? returnUrl = null)
        {
            ReturnUrl = returnUrl ?? Url.Page("./Manage/Index");

            if (AllowLocalLogin && ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(Input.Username, Input.Password, Input.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    _logger.LogInformation("User logged in.");
                    return LocalRedirect(ReturnUrl);
                }
                if (result.IsLockedOut)
                {
                    _logger.LogWarning("User account locked out.");
                    return RedirectToPage("./Lockout");
                }
            }

            ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            return Page();
        }
    }
}
