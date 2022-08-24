using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NodaTime;
using SluggyUnidecode;
using System.Security.Claims;
using System.Text.Json;

namespace FactorioTech.Api.Services;

internal static class DevDataSeederExtensions
{
    public static IApplicationBuilder EnsureDevelopmentDataIsSeeded(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        scope.ServiceProvider.GetRequiredService<DevDataSeeder>().Run().GetAwaiter().GetResult();

        return app;
    }
}

[AutoConstructor]
public partial class DevDataSeeder
{
    public record SeedData(
        IReadOnlyCollection<SeedBlueprint> Blueprints);

    public record SeedBlueprint(
        string Title,
        string? Description,
        string Owner,
        IReadOnlyCollection<string> Tags,
        string CoverUri,
        string Encoded);

    [AutoConstructorInject("options.Value", "options", typeof(IOptions<AppConfig>))]
    private readonly AppConfig appConfig;
    private readonly AppDbContext dbContext;
    private readonly BuildService buildService;
    private readonly BlueprintConverter blueprintConverter;
    private readonly ImageService imageService;
    private readonly BuildTags buildTags;
    private readonly ILogger<DevDataSeeder> logger;
    private readonly IHttpClientFactory httpClientFactory;

    public async Task Run()
    {
        await dbContext.Database.MigrateAsync();

        logger.LogInformation("Seeding development data from {SeedDataUri}", appConfig.SeedDataUri);

        var httpClient = httpClientFactory.CreateClient();
        var responseStream = await httpClient.GetStreamAsync(appConfig.SeedDataUri);

        var data = await JsonSerializer.DeserializeAsync<SeedData>(responseStream, new JsonSerializerOptions
        {
            AllowTrailingCommas = true,
            PropertyNameCaseInsensitive = true,
            ReadCommentHandling = JsonCommentHandling.Skip,
        })!;

        if (data?.Blueprints == null)
        {
            logger.LogError("Failed to load seed data from {SeedDataUri}", appConfig.SeedDataUri);
            return;
        }

        await SeedBuilds(data.Blueprints);
    }

    private async Task SeedBuilds(IReadOnlyCollection<SeedBlueprint> blueprints)
    {
        logger.LogInformation("Seeding {TotalCount} builds", blueprints.Count);
        var createdCount = 0;
        var skippedCount = 0;
        var errorCount = 0;

        var httpClient = httpClientFactory.CreateClient();

        foreach (var blueprint in blueprints)
        {
            var slug = blueprint.Title.ToSlug();
            var username = blueprint.Owner.ToSlug();

            var existing = await dbContext.Builds.FirstOrDefaultAsync(bp => bp.OwnerSlug == username && bp.Slug == slug);
            if (existing != null)
            {
                skippedCount++;
                logger.LogInformation("Blueprint {Title} by {Owner} already exists", blueprint.Title, blueprint.Owner);
                continue;
            }

            var owner = await dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (owner == null)
            {
                var email = Guid.NewGuid() + "@test.local.factorio.tech";

                logger.LogInformation("Creating user {DisplayName} / {UserName} / {Email}",
                    blueprint.Owner, username, email);

                owner = new User
                {
                    DisplayName = blueprint.Owner,
                    UserName = username,
                    NormalizedUserName = username.ToUpperInvariant(),
                    Email = email,
                    NormalizedEmail = email.ToUpperInvariant(),
                    EmailConfirmed = true,
                    RegisteredAt = SystemClock.Instance.GetCurrentInstant(),
                };

                dbContext.Add(owner);
                await dbContext.SaveChangesAsync();
            }

            var envelope = await blueprintConverter.Decode(blueprint.Encoded);

            var payload = new Payload(
                Hash.Compute(blueprint.Encoded),
                blueprintConverter.ParseType(envelope.Entity.Item),
                blueprintConverter.DecodeGameVersion(envelope.Entity.Version),
                blueprint.Encoded);

            var cache = new PayloadCache();
            cache.TryAdd(envelope, payload);

            await cache.EnsureInitializedGraph(envelope);
            await buildService.SavePayloadGraph(payload.Hash, cache.Values);

            var tags = blueprint.Tags
                .Select(t => t.TrimEnd('/'))
                .Where(buildTags.Contains)
                .ToArray();

            var request = new BuildService.CreateRequest(
                username,
                slug,
                blueprint.Title,
                blueprint.Description,
                tags.Any() ? tags : GetSomeRandomTags(),
                (payload.Hash, null, null, envelope.Entity.Icons.ToGameIcons()),
                null);

            var principal = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new(ClaimTypes.NameIdentifier, owner.Id.ToString()),
            }));

            var cover = await httpClient.GetStreamAsync(blueprint.CoverUri);
            await using var handle = await imageService.SaveCroppedCover(cover);
            var result = await buildService.CreateOrAddVersion(request, handle, principal);

            switch (result)
            {
                case BuildService.CreateResult.Success:
                    createdCount++;
                    logger.LogInformation("Build {Title} by {Owner} created successfully", blueprint.Title, blueprint.Owner);
                    break;

                default:
                    errorCount++;
                    logger.LogError("Failed to save build {Title}: {ErrorType}", blueprint.Title, result.GetType());
                    break;
            }
        }

        logger.LogInformation("Done seeding {TotalCount} builds: created {CreatedCount}, skipped {SkippedCount}, {ErrorCount} errors",
            blueprints.Count, createdCount, skippedCount, errorCount);
    }

    private IEnumerable<string> GetSomeRandomTags() =>
        new Random().Let(rnd =>
            Enumerable.Range(0, rnd.Next(2, 5)).Select(_ =>
                buildTags.ElementAt(
                    rnd.Next(0, buildTags.Count - 1))));
}
