using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Diagnostics;

namespace FactorioTech.Web.Pages.Errors
{
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    [IgnoreAntiforgeryToken]
    public class ErrorModel : PageModel
    {
        public string RequestId { get; set; } = string.Empty;

        public void OnGet()
        {
            ViewData["Title"] = "An error has occurred";
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
        }
    }
}
