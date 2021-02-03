using Duende.IdentityServer.EntityFramework.Options;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NodaTime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FactorioTech.Core.Data
{
    public class AppDbContext : PersistedGrantIdentityContext
    {
        private static readonly JsonSerializerOptions JsonSerializerOptions = new ()
        {
            IgnoreNullValues = true,
            PropertyNamingPolicy = new SnakeCaseNamingPolicy(),
            Converters = { new JsonStringEnumConverter(new SnakeCaseNamingPolicy()) },
        };

        public DbSet<Blueprint> Blueprints { get; set; }
        public DbSet<BlueprintVersion> BlueprintVersions { get; set; }
        public DbSet<BlueprintPayload> BlueprintPayloads { get; set; }
        public DbSet<Favorite> Favorites { get; set; }

#pragma warning disable 8618
        public AppDbContext(
            DbContextOptions<AppDbContext> options,
            IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {
        }
#pragma warning restore 8618

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>(entity =>
            {
                entity.HasMany(e => e.Blueprints!)
                    .WithOne(e => e.Owner!)
                    .HasForeignKey(e => e.OwnerId)
                    .HasPrincipalKey(e => e.Id);

                entity.HasMany(e => e.Favorites).WithMany(x => x.Followers)
                    .UsingEntity<Favorite>(
                        je => je.HasOne(e => e.Blueprint!).WithMany()
                            .HasForeignKey(x => x.BlueprintId)
                            .HasPrincipalKey(x => x.BlueprintId),
                        je => je.HasOne(e => e.User!).WithMany()
                            .HasForeignKey(x => x.UserId)
                            .HasPrincipalKey(x => x.Id))
                    .HasKey(e => new { e.UserId, e.BlueprintId });

                entity.Property(e => e.TimeZone)
                    .HasConversion(
                        tz => tz!.Id,
                        tz => DateTimeZoneProviders.Tzdb[tz]);
            });

            builder.Entity<Blueprint>(entity =>
            {
                entity.HasAlternateKey(e => new { e.OwnerId, e.NormalizedSlug });

                entity.HasOne(e => e.LatestVersion!).WithMany()
                    .HasForeignKey(e => e.LatestVersionId)
                    .HasPrincipalKey(e => e.VersionId);

                entity.Property(e => e.Icons)
                    .HasConversion(
                        x => JsonSerializer.Serialize(x, JsonSerializerOptions),
                        x => JsonSerializer.Deserialize<IEnumerable<GameIcon>>(x, JsonSerializerOptions)
                             ?? Enumerable.Empty<GameIcon>())
                    .HasColumnType("jsonb");

                if (Database.IsNpgsql())
                {
                    entity.HasGeneratedTsVectorColumn(
                            e => e.SearchVector,
                            "english",
                            e => new { e.Title, e.Description, e.Slug })
                        .HasIndex(b => b.SearchVector)
                        .HasMethod("GIN");
                }
                else
                {
                    entity.Ignore(e => e.SearchVector);
                }
            });

            builder.Entity<BlueprintVersion>(entity =>
            {
                entity.HasAlternateKey(e => e.Hash);

                entity.HasOne(x => x.Blueprint!).WithMany()
                    .HasForeignKey(e => e.BlueprintId)
                    .HasPrincipalKey(e => e.BlueprintId);

                entity.Property(e => e.Hash)
                    .HasConversion(p => p.ToString(), p => Hash.Parse(p));

                entity.Property(e => e.GameVersion)
                    .HasConversion(p => p.ToString(4), p => Version.Parse(p));

                entity.HasOne(e => e.Payload!).WithMany()
                    .HasForeignKey(e => e.Hash)
                    .HasPrincipalKey(e => e.Hash);

                entity.Property(e => e.Icons)
                    .HasConversion(
                        x => JsonSerializer.Serialize(x, JsonSerializerOptions),
                        x => JsonSerializer.Deserialize<IEnumerable<GameIcon>>(x, JsonSerializerOptions)
                             ?? Enumerable.Empty<GameIcon>())
                    .HasColumnType("jsonb");
            });

            builder.Entity<BlueprintPayload>(entity =>
            {
                entity.Property(e => e.Hash)
                    .HasConversion(p => p.ToString(), p => Hash.Parse(p));

                entity.Property(e => e.GameVersion)
                    .HasConversion(p => p.ToString(4), p => Version.Parse(p));
            });
        }
    }
}
