using FactorioTech.Core.Domain;
using System;
using System.Security.Claims;

namespace FactorioTech.Core
{
    public static class IdentityExtensions
    {
        public static string GetUserName(this ClaimsPrincipal principal) =>
            principal.FindFirstValue("username") ?? throw new Exception("UserName not found in principal");

        public static Guid GetUserId(this ClaimsPrincipal principal) =>
            Guid.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)
                ? userId : throw new Exception("UserId not found in principal");

        public static Guid? TryGetUserId(this ClaimsPrincipal principal) =>
            Guid.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)
                ? userId : null;

        public static bool CanEdit(this ClaimsPrincipal principal, Build build) =>
            principal.TryGetUserId() == build.OwnerId
            || principal.IsInRole(Role.Moderator)
            || principal.IsInRole(Role.Administrator);

        public static bool CanAddVersion(this ClaimsPrincipal principal, Build build) =>
            principal.TryGetUserId() == build.OwnerId
            || principal.IsInRole(Role.Moderator)
            || principal.IsInRole(Role.Administrator);

        public static bool CanDelete(this ClaimsPrincipal principal, Build build) =>
            principal.IsInRole(Role.Administrator);
    }
}
