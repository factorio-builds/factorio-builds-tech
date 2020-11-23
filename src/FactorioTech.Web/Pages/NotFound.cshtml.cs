using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FactorioTech.Web.Pages
{
    public class NotFoundModel : PageModel
    {
        public void OnGet() => ViewData["Title"] = "404 - page not found";
    }
}
