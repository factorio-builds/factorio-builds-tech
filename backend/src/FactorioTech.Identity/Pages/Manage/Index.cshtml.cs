using FactorioTech.Core;
using FactorioTech.Core.Domain;
using FactorioTech.Identity.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Identity.Pages.Manage;

[Authorize]
[SecurityHeaders]
public class IndexModel : PageModel
{
    private readonly UserManager<User> userManager;
    private readonly SignInManager<User> signInManager;

    public IndexModel(
        UserManager<User> userManager,
        SignInManager<User> signInManager)
    {
        this.userManager = userManager;
        this.signInManager = signInManager;
    }

    [TempData]
    public string? StatusMessage { get; set; }

    [BindProperty]
    public InputModel Input { get; set; } = new();

    public class InputModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(AppConfig.Policies.Slug.MaximumLength, MinimumLength = AppConfig.Policies.Slug.MinimumLength)]
        [RegularExpression(AppConfig.Policies.Slug.AllowedCharactersRegex)]
        [DisplayName("Username")]
        public string UserName { get; set; } = string.Empty;

        [StringLength(100, MinimumLength = 3)]
        [DisplayName("Display name")]
        public string? DisplayName { get; set; }
    }

    public async Task<IActionResult> OnGetAsync()
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null)
            return NotFound($"Unable to load user with ID '{userManager.GetUserId(User)}'.");

        Input = new InputModel
        {
            Email = user.Email,
            UserName = user.UserName,
            DisplayName = user.DisplayName,
        };

        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null)
            return NotFound($"Unable to load user with ID '{userManager.GetUserId(User)}'.");

        if (!ModelState.IsValid)
            return Page();

        user.DisplayName = Input.DisplayName;

        await userManager.UpdateAsync(user);
        await signInManager.RefreshSignInAsync(user);
        StatusMessage = "Your profile has been updated";
        return RedirectToPage();
    }
}
