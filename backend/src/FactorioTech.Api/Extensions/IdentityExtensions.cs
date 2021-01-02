using System;
using System.Security.Claims;

namespace FactorioTech.Api.Extensions
{
    public static class IdentityExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal principal) =>
            Guid.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)
                ? userId : throw new Exception("UserId not found in principal");
    }
}
