using System;
using System.Security.Claims;

namespace FactorioTech.Web.Extensions
{
    public static class IdentityExtensions
    {
        public static string GetUserName(this ClaimsPrincipal principal) =>
            principal.FindFirstValue(ClaimTypes.Name)
            ?? throw new Exception("UserName not found in Principal");

        public static string GetDisplayName(this ClaimsPrincipal principal) =>
            principal.FindFirstValue("urn:factorio-tech:displayname")
            ?? throw new Exception("DisplayName not found in Principal");

        public static Guid GetUserId(this ClaimsPrincipal principal) =>
            Guid.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)
            ? userId : throw new Exception("UserId not found in Principal");
    }
}
