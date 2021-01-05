using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain
{
    public class GameIcon
    {
        [Required]
        public string Type { get; init; }

        [Required]
        public string Name { get; init; }

        public GameIcon(string type, string name)
        {
            Type = type;
            Name = name;
        }
    }
}
