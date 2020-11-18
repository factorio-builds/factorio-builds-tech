using System.Security.Claims;

namespace FactorioTech.Web.Extensions
{
    public static class IdentityExtensions
    {
        public static string GetDisplayName(this ClaimsPrincipal principal) =>
            principal.FindFirstValue("urn:factorio-tech:displayname");
    }
}
