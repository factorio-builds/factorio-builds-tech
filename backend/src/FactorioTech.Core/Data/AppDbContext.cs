using Duende.IdentityServer.EntityFramework.Options;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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

        public DbSet<Build> Builds { get; set; }
        public DbSet<BuildVersion> Versions { get; set; }
        public DbSet<Payload> Payloads { get; set; }
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
                entity.HasMany(e => e.Builds!)
                    .WithOne(e => e.Owner!)
                    .HasForeignKey(e => e.OwnerId)
                    .HasPrincipalKey(e => e.Id);

                entity.HasMany(e => e.Favorites).WithMany(x => x.Followers)
                    .UsingEntity<Favorite>(
                        je => je.HasOne(e => e.Build!).WithMany()
                            .HasForeignKey(x => x.BuildId)
                            .HasPrincipalKey(x => x.BuildId),
                        je => je.HasOne(e => e.User!).WithMany()
                            .HasForeignKey(x => x.UserId)
                            .HasPrincipalKey(x => x.Id))
                    .HasKey(e => new { e.UserId, e.BuildId });

                entity.Property(e => e.TimeZone)
                    .HasConversion(
                        tz => tz!.Id,
                        tz => DateTimeZoneProviders.Tzdb[tz]);
            });

            builder.Entity<Build>(entity =>
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
                    .HasColumnType("jsonb")
                    .Metadata.SetValueComparer(BuildSequenceValueComparer<GameIcon>());

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

            builder.Entity<BuildVersion>(entity =>
            {
                entity.HasAlternateKey(e => e.Hash);

                entity.HasOne(x => x.Build!).WithMany()
                    .HasForeignKey(e => e.BuildId)
                    .HasPrincipalKey(e => e.BuildId);

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
                    .HasColumnType("jsonb")
                    .Metadata.SetValueComparer(BuildSequenceValueComparer<GameIcon>());
            });

            builder.Entity<Payload>(entity =>
            {
                entity.Property(e => e.Hash)
                    .HasConversion(p => p.ToString(), p => Hash.Parse(p));

                entity.Property(e => e.GameVersion)
                    .HasConversion(p => p.ToString(4), p => Version.Parse(p));
            });
        }

        private static ValueComparer<IEnumerable<T>> BuildSequenceValueComparer<T>() => new(
            (c1, c2) => c1.SequenceEqual(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v!.GetHashCode())),
            c => (IEnumerable<T>)c.ToHashSet());
    }
}
