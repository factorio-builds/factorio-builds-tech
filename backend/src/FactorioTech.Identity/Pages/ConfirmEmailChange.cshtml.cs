using FactorioTech.Core.Domain;
using FactorioTech.Identity.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Threading.Tasks;

namespace FactorioTech.Identity.Pages
{
    [AllowAnonymous]
    [SecurityHeaders]
    public class ConfirmEmailChangeModel : PageModel
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public ConfirmEmailChangeModel(
            UserManager<User> userManager,
            SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [TempData]
        public string? StatusMessage { get; set; }

        public async Task<IActionResult> OnGetAsync(string? userId, string? email, string? code)
        {
            if (userId == null || email == null || code == null)
                return RedirectToPage("/Index");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound($"Unable to load user with ID '{userId}'.");

            var result = await _userManager.ChangeEmailAsync(user, email,
                Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code)));

            StatusMessage = result.Succeeded
                ? "Thank you for confirming your email change."
                : "Error changing email.";

            if (result.Succeeded)
            {
                await _signInManager.RefreshSignInAsync(user);
            }

            return RedirectToPage("./Manage/Email");
        }
    }
}
