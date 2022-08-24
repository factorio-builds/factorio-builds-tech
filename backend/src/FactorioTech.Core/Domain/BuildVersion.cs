using NodaTime;
using System.ComponentModel.DataAnnotations;

namespace FactorioTech.Core.Domain;

public class BuildVersion
{
    [Key]
    public Guid VersionId { get; init; }

    [Required]
    public Guid BuildId { get; init; }

    [Required]
    public Instant CreatedAt { get; init; }

    [Required]
    [MaxLength(32)]
    [MinLength(32)]
    public Hash Hash { get; init; }

    [Required]
    public PayloadType Type { get; init; }

    [Required]
    public Version GameVersion { get; init; }

    [MaxLength(100)]
    public string? Name { get; init; }

    public string? Description { get; init; }

    [Required]
    public IEnumerable<GameIcon> Icons { get; init; }

    // navigation properties -> will be null if not included explicitly

    public Payload? Payload { get; init; }

    public Build? Build { get; init; }

    public BuildVersion(
        Guid versionId,
        Guid buildId,
        Instant createdAt,
        Hash hash,
        PayloadType type,
        Version gameVersion,
        string? name,
        string? description,
        IEnumerable<GameIcon> icons)
    {
        VersionId = versionId;
        BuildId = buildId;
        CreatedAt = createdAt;
        GameVersion = gameVersion;
        Hash = hash;
        Type = type;
        Name = name;
        Description = description;
        Icons = icons;
    }

#pragma warning disable 8618 // required for EF
    private BuildVersion() { }
#pragma warning restore 8618
}