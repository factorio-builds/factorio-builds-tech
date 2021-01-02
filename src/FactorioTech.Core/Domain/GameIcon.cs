using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain
{
    public class GameIcon
    {
        [Required]
        [Range(1, 4)]
        public short Index { get; init; }

        [Required]
        public string Type { get; init; }

        [Required]
        public string Name { get; init; }

        public GameIcon(short index, string type, string name)
        {
            Index = index;
            Type = type;
            Name = name;
        }
    }
}
