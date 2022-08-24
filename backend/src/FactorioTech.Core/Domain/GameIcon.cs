using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain;

public class GameIcon
{
    [Required]
    public IconType Type { get; init; }

    [Required]
    public string Name { get; init; }

    public GameIcon(IconType type, string name)
    {
        Type = type;
        Name = name;
    }

#pragma warning disable 8618
    [Obsolete("Do not use this constructor. It's required for model binding only.", true)]
    public GameIcon() { }
#pragma warning restore 8618
}