using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Identity.Configuration;
using FactorioTech.Identity.Extensions;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Logging;
using System.Security.Cryptography.X509Certificates;

namespace FactorioTech.Identity;

public class Startup
{
    private readonly IConfiguration configuration;
    private readonly IWebHostEnvironment environment;

    public Startup(IConfiguration configuration, IWebHostEnvironment environment)
    {
        this.configuration = configuration;
        this.environment = environment;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        var appConfig = configuration.GetSection(nameof(AppConfig)).Get<AppConfig>() ?? new AppConfig();
        services.AddSingleton(Options.Create(appConfig));

        services.AddRazorPages();
        services.Configure<RouteOptions>(options =>
        {
            options.LowercaseUrls = true;
        });

        services.AddDatabaseDeveloperPageExceptionFilter();
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("Postgres"),
                o => o.UseNodaTime());

            if (environment.IsDevelopment())
            {
                options.EnableDetailedErrors();
                options.EnableSensitiveDataLogging();
                options.ConfigureWarnings(w => w.Log(
                    CoreEventId.FirstWithoutOrderByAndFilterWarning,
                    CoreEventId.RowLimitingOperationWithoutOrderByWarning,
                    CoreEventId.DistinctAfterOrderByWithoutRowLimitingOperatorWarning));
            }
        });

        services.AddIdentity<User, Role>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        services.Configure<IdentityOptions>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.User.AllowedUserNameCharacters = AppConfig.Policies.Slug.AllowedCharacters;
        });

        services.AddTransient<IUserValidator<User>, CustomUserNamePolicy>();

        var oAuthClientConfig = configuration.Get<OAuthClientConfig>() ?? new OAuthClientConfig();

        services.AddIdentityServer(options =>
            {
                options.UserInteraction.ErrorUrl = "/errors/500";
                // todo
                // options.KeyManagement.KeyPath = Path.Join(appConfig.ProtectedDataDir, "keys");
            })
            .AddAspNetIdentity<User>()
            .AddProfileService<CustomProfileService>()
            .AddOperationalStore<AppDbContext>()
            .AddInMemoryIdentityResources(IdentityConfig.GetIdentityResources())
            .AddInMemoryClients(IdentityConfig.GetClients(environment, appConfig, oAuthClientConfig.OAuthClients));

        services.ConfigureApplicationCookie(options =>
        {
            options.LoginPath = "/login";
            options.LogoutPath = "/logout";
            options.AccessDeniedPath = "/errors/403";
            options.ReturnUrlParameter = "returnurl";
        });

        var authenticationBuilder = services.AddAuthentication();
        var oAuthProviderConfig = configuration.Get<OAuthProviderConfig>();
        if (oAuthProviderConfig?.OAuthProviders?.Any() == true)
        {
            if (oAuthProviderConfig!.OAuthProviders!.TryGetValue("GitHub", out var gitHubCredentials))
            {
                authenticationBuilder.AddGitHub(options =>
                {
                    options.ClientId = gitHubCredentials.ClientId;
                    options.ClientSecret = gitHubCredentials.ClientSecret;
                    options.Scope.Add("user:email");
                });
            }

            if (oAuthProviderConfig!.OAuthProviders!.TryGetValue("Discord", out var discordCredentials))
            {
                authenticationBuilder.AddDiscord(options =>
                {
                    options.ClientId = discordCredentials.ClientId;
                    options.ClientSecret = discordCredentials.ClientSecret;
                    options.Scope.Add("email");
                });
            }
        }

        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
                builder.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .Let(b => environment.IsProduction()
                        ? b.WithOrigins($"{appConfig.ApiUri.Scheme}://{appConfig.ApiUri.Authority}")
                        : b.WithOrigins($"{appConfig.ApiUri.Scheme}://{appConfig.ApiUri.Authority}",
                            "https://api.local.factorio.tech", "https://localhost:5101")));
        });

        services.AddApplicationInsightsTelemetry(options =>
        {
            options.ApplicationVersion = BuildInformation.Version;
        });

        services.AddSingleton<ITelemetryInitializer, CloudRoleInitializer>();
        services.AddSingleton<ITelemetryInitializer, UserInitializer>();

        if (!environment.IsProduction())
        {
            services.AddTransient<DevDataSeeder>();
        }

        if (!environment.IsDevelopment())
        {
            // todo
            // services.AddDataProtection()
            //     .PersistKeysToFileSystem(new DirectoryInfo(Path.Join(appConfig.ProtectedDataDir, "dataprotection")))
            //     .ProtectKeysWithCertificate(new X509Certificate2("/mnt/keys/certificate.pfx"));
        }

        services.AddTransient<DevDataSeeder>();
        services.AddTransient<CustomProfileService>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedProto,
        });

        if (!env.IsProduction())
        {
            IdentityModelEventSource.ShowPII = true;
            app.UseDeveloperExceptionPage();
        }

        if (!env.IsDevelopment())
        {
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseCors();
        app.UseIdentityServer();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapRazorPages();
        });

        if (!environment.IsProduction())
        {
            app.EnsureDevelopmentDataIsSeeded();
        }
    }
}
