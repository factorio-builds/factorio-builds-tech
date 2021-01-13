using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NodaTime;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FactorioTech.Identity
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
        private static readonly TimeSpan CheckMigrationsInterval = TimeSpan.FromSeconds(2);
        private static readonly TimeSpan CheckMigrationsTimeout = TimeSpan.FromSeconds(30);

        public static IEnumerable<(User User, string Role)> Users => new []
        {
            (new User
            {
                UserName = "alice",
                DisplayName = "Alice Smith",
                Email = "AliceSmith@email.com",
                EmailConfirmed = true,
                RegisteredAt = SystemClock.Instance.GetCurrentInstant(),
            }, Role.Administrator),
            (new User
            {
                UserName = "bob",
                DisplayName = "Bob Smith",
                Email = "BobSmith@email.com",
                EmailConfirmed = true,
                RegisteredAt = SystemClock.Instance.GetCurrentInstant(),
            }, Role.Moderator),
        };

        public static string Password => "Pass123$";

        private readonly ILogger<DevDataSeeder> _logger;
        private readonly AppDbContext _dbContext;
        private readonly UserManager<User> _userManager;

        public DevDataSeeder(
            ILogger<DevDataSeeder> logger,
            AppDbContext dbContext,
            UserManager<User> userManager)
        {
            _logger = logger;
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task Run()
        {
            _logger.LogInformation("Seeding development data...");
         
            var migrationsApplied = await WaitUntilThereAreNoPendingMigrations();
            if (!migrationsApplied)
                throw new Exception("Failed to seed development data");

            foreach (var (user, role) in Users)
            {
                await EnsureUserExists(user, new[] { role });
            }
        }

        private async Task<bool> WaitUntilThereAreNoPendingMigrations()
        {
            var sw = Stopwatch.StartNew();

            do
            {
                var pendingMigrations = await _dbContext.Database.GetPendingMigrationsAsync();
                if (!pendingMigrations.Any())
                    return true;

                _logger.LogWarning("There are pending migrations; checking again in {Interval}", CheckMigrationsInterval);
                await Task.Delay(CheckMigrationsInterval);
            }
            while (sw.Elapsed < CheckMigrationsTimeout);
            
            _logger.LogError("There are still pending migrations after trying for {Timeout}; giving up", CheckMigrationsTimeout);
            return false;
        }

        private async Task EnsureUserExists(User user, IReadOnlyCollection<string>? roles = null, IReadOnlyCollection<Claim>? claims = null)
        {
            var existingUser = await _userManager.FindByNameAsync(user.UserName);
            if (existingUser != null)
            {
                _logger.LogInformation("User {Username} exists", user.UserName);
                return;
            }

            var result = await _userManager.CreateAsync(user, Password);
            if (!result.Succeeded)
            {
                _logger.LogError("Failed to create user {Username} : {ErrorMessage}", user.UserName, result.Errors.First().Description);
                return;
            }

            if (roles?.Any() == true)
            {
                await _userManager.AddToRolesAsync(user, roles);
            }

            if (claims?.Any() == true)
            {
                await _userManager.AddClaimsAsync(user, claims);
            }

            _logger.LogInformation("User {Username} with password {Password} created successfully", user.UserName, Password);
        }
    }
}
