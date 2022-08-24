using FactorioTech.Core.Domain;
using FactorioTech.Identity.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace FactorioTech.Identity.Pages;

[AllowAnonymous]
[SecurityHeaders]
public class ConfirmEmailModel : PageModel
{
    private readonly UserManager<User> userManager;

    public ConfirmEmailModel(UserManager<User> userManager)
    {
        this.userManager = userManager;
    }

    [TempData]
    public string? StatusMessage { get; set; }

    public async Task<IActionResult> OnGetAsync(string? userId, string? code)
    {
        if (userId == null || code == null)
            return RedirectToPage("/Index");

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound($"Unable to load user with ID '{userId}'.");

        var result = await userManager.ConfirmEmailAsync(user,
            Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code)));

        StatusMessage = result.Succeeded
            ? "Thank you for confirming your email."
            : "Error confirming your email.";

        return RedirectToPage("./Manage/Email");
    }
}
