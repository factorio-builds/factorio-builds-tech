using FactorioTech.Core.Domain;
using IdentityModel;
using System.Security.Claims;

namespace FactorioTech.Core;

public static class IdentityExtensions
{
    public static string GetUserName(this ClaimsPrincipal principal) =>
        principal.FindFirstValue("username")
        ?? principal.FindFirstValue(JwtClaimTypes.Name)
        ?? throw new Exception("UserName not found in principal");

    public static Guid GetUserId(this ClaimsPrincipal principal) => 
        TryGetUserId(principal) ?? throw new Exception("UserId not found in principal");

    public static Guid? TryGetUserId(this ClaimsPrincipal principal)
    {
        if (Guid.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            return userId;
        if (Guid.TryParse(principal.FindFirstValue(JwtClaimTypes.Subject), out var sub))
            return sub;
        return null;
    }

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

    public static bool CanDeleteRendering(this ClaimsPrincipal principal, Payload payload) =>
        principal.IsInRole(Role.Administrator);
}