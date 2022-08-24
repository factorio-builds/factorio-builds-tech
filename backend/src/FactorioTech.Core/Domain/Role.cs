using Microsoft.AspNetCore.Identity;

namespace FactorioTech.Core.Domain;

public class Role : IdentityRole<Guid>
{
    public const string Administrator = "Administrator";
    public const string Moderator = "Moderator";
}