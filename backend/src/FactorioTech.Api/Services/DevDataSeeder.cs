using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NodaTime;
using SluggyUnidecode;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace FactorioTech.Api.Services
{
    internal static class DevDataSeederExtensions
    {
        public static IApplicationBuilder EnsureDevelopmentDataIsSeeded(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            scope.ServiceProvider.GetRequiredService<DevDataSeeder>().Run().GetAwaiter().GetResult();

            return app;
        }
    }

    public class DevDataSeeder
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

        private readonly ILogger<DevDataSeeder> _logger;
        private readonly AppConfig _appConfig;
        private readonly AppDbContext _dbContext;
        private readonly HttpClient _httpClient;
        private readonly BlueprintService _blueprintService;
        private readonly BlueprintConverter _blueprintConverter;
        private readonly ImageService _imageService;

        public DevDataSeeder(
            ILogger<DevDataSeeder> logger,
            IOptions<AppConfig> appConfig,
            AppDbContext dbContext,
            HttpClient httpClient,
            BlueprintService blueprintService,
            BlueprintConverter blueprintConverter,
            ImageService imageService)
        {
            _logger = logger;
            _appConfig = appConfig.Value;
            _dbContext = dbContext;
            _httpClient = httpClient;
            _blueprintService = blueprintService;
            _blueprintConverter = blueprintConverter;
            _imageService = imageService;
        }

        public async Task Run()
        {
            await _dbContext.Database.MigrateAsync();

            _logger.LogInformation("Seeding development data...");

            var dataFqfn = Path.Join(_appConfig.DataDir, "seed.json");

            if (_appConfig.AlwaysDownloadSeedData || !File.Exists(dataFqfn))
            {
                _logger.LogInformation("Downloading seed data from {SeedDataUri}", _appConfig.SeedDataUri);
                var downloaded = await _httpClient.GetStreamAsync(_appConfig.SeedDataUri);

                await using var outFile = File.OpenWrite(dataFqfn);
                await downloaded.CopyToAsync(outFile);
            }

            await using var inFile = File.OpenRead(dataFqfn);
            var data = await JsonSerializer.DeserializeAsync<SeedData>(inFile, new JsonSerializerOptions
            {
                AllowTrailingCommas = true,
                PropertyNameCaseInsensitive = true,
                ReadCommentHandling = JsonCommentHandling.Skip,
            })!;

            if (data?.Blueprints == null)
            {
                _logger.LogError("Failed to load seed data file: {Fqfn}", dataFqfn);
                return;
            }

            await SeedBlueprints(data.Blueprints);
        }

        private async Task SeedBlueprints(IReadOnlyCollection<SeedBlueprint> blueprints)
        {
            _logger.LogInformation("Seeding {TotalCount} blueprints", blueprints.Count);
            var createdCount = 0;
            var skippedCount = 0;
            var errorCount = 0;

            foreach (var blueprint in blueprints)
            {
                var slug = blueprint.Title.ToSlug();
                var username = blueprint.Owner.ToSlug();

                var existing = await _dbContext.Blueprints.FirstOrDefaultAsync(bp => bp.OwnerSlug == username && bp.Slug == slug);
                if (existing != null)
                {
                    skippedCount++;
                    _logger.LogInformation("Blueprint {Title} by {Owner} already exists", blueprint.Title, blueprint.Owner);
                    continue;
                }

                var owner = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);
                if (owner == null)
                {
                    var email = Guid.NewGuid() + "@test.local.factorio.tech";

                    _logger.LogInformation("Creating user {DisplayName} / {UserName} / {Email}",
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

                    _dbContext.Add(owner);
                    await _dbContext.SaveChangesAsync();
                }

                var envelope = await _blueprintConverter.Decode(blueprint.Encoded);

                var payload = new BlueprintPayload(
                    Hash.Compute(blueprint.Encoded),
                    _blueprintConverter.ParseType(envelope.Item),
                    _blueprintConverter.DecodeGameVersion(envelope.Version),
                    blueprint.Encoded);

                var cache = new PayloadCache();
                cache.TryAdd(envelope, payload);

                await cache.EnsureInitializedGraph(envelope);
                await _blueprintService.SavePayloadGraph(payload.Hash, cache.Values);

                var request = new BlueprintService.CreateRequest(
                    slug,
                    blueprint.Title,
                    blueprint.Description,
                    blueprint.Tags.Select(t => t.TrimEnd('/')),
                    (payload.Hash, null, null, envelope.Icons.ToGameIcons()),
                    null);
                
                var cover = await _httpClient.GetStreamAsync(blueprint.CoverUri);
                using var handle = await _imageService.SaveCroppedCover(cover);
                var result = await _blueprintService.CreateOrAddVersion(request, handle, owner.Id);

                switch (result)
                {
                    case BlueprintService.CreateResult.Success:
                        createdCount++;
                        _logger.LogInformation("Blueprint {Title} by {Owner} created successfully", blueprint.Title, blueprint.Owner);
                        break;

                    default:
                        errorCount++;
                        _logger.LogError("Failed to save blueprint {Title}: {ErrorType}", blueprint.Title, result.GetType());
                        break;
                }
            }

            _logger.LogInformation("Done seeding {TotalCount} blueprints: created {CreatedCount}, skipped {SkippedCount}, {ErrorCount} errors",
                blueprints.Count, createdCount, skippedCount, errorCount);
        }
    }
}
