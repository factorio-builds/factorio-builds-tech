using Azure.Storage.Blobs;
using FactorioTech.Api.Extensions;
using FactorioTech.Api.Extensions.Json;
using FactorioTech.Api.Services;
using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Hellang.Middleware.ProblemDetails;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NodaTime;
using NodaTime.Serialization.SystemTextJson;
using SixLabors.ImageSharp.Web.DependencyInjection;
using SixLabors.ImageSharp.Web.Providers;
using System.Reflection;
using System.Text.Json.Serialization;

namespace FactorioTech.Api;

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

        services.AddProblemDetails();
        services.AddHttpClient();
        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ConfigureForNodaTime(DateTimeZoneProviders.Tzdb);
            options.JsonSerializerOptions.Converters.Add(new PolymorphicJsonConverter<PayloadModelBase>());
            options.JsonSerializerOptions.Converters.Add(new CustomJsonStringEnumConverter(new SnakeCaseNamingPolicy()));
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(new SnakeCaseNamingPolicy()));
            options.JsonSerializerOptions.Converters.Add(new VersionJsonConverter());
            options.JsonSerializerOptions.Converters.Add(new HashJsonConverter());
            options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            options.JsonSerializerOptions.PropertyNamingPolicy = new SnakeCaseNamingPolicy();
        });

        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "factorio.tech", Version = "v1" });

            options.AddSecurityDefinition(SecuritySchemeType.OAuth2.ToString(), new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                Flows = new OpenApiOAuthFlows
                {
                    AuthorizationCode = new OpenApiOAuthFlow
                    {
                        AuthorizationUrl = new Uri(appConfig.IdentityUri.AbsoluteUri + "connect/authorize"),
                        TokenUrl = new Uri(appConfig.IdentityUri.AbsoluteUri + "connect/token"),
                        Scopes = new Dictionary<string, string>
                        {
                            { "openid", "Informs the authorization server that the client is making an OpenID Connect request." },
                            { "profile", "Requests access to the user's profile information." },
                        },
                    },
                },
            });

            options.EnableAnnotations(true, true);
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
            options.MapType(typeof(Instant), () => new OpenApiSchema { Type = "string" });
            options.MapType(typeof(Hash), () => new OpenApiSchema { Type = "string" });
            options.MapType(typeof(Version), () => new OpenApiSchema { Type = "string" });
            options.MapType(typeof(AssetService.IconSize), () => new OpenApiSchema { Type = "integer" });
            options.OperationFilter<OAuthResponsesOperationFilter>();
            options.UseAllOfToExtendReferenceSchemas();
            options.UseInlineDefinitionsForEnums();
        });

        services.AddCors(options =>
        {
            options.AddPolicy("factorio-blueprint-editor", builder =>
                builder.WithOrigins($"{appConfig.BlueprintEditorUri.Scheme}://{appConfig.BlueprintEditorUri.Authority}")
                    .AllowAnyHeader()
                    .AllowAnyMethod());

            options.AddDefaultPolicy(builder =>
                builder.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .Let(b => environment.IsProduction()
                        ? b.WithOrigins($"{appConfig.WebUri.Scheme}://{appConfig.WebUri.Authority}")
                        : b.WithOrigins($"{appConfig.WebUri.Scheme}://{appConfig.WebUri.Authority}",
                            "https://local.factorio.tech", "http://localhost:3000")));
        });

        services.AddSingleton(_ => new BlobServiceClient(configuration.GetConnectionString("Storage")));
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

        services.AddAuthentication("Bearer").AddJwtBearer("Bearer", options =>
        {
            options.Authority = $"{appConfig.IdentityUri.Scheme}://{appConfig.IdentityUri.Authority}";

            if (!environment.IsProduction()
                && (appConfig.IdentityUri.IsLoopback
                    || appConfig.IdentityUri.Host.EndsWith("local.factorio.tech")))
            {
                options.BackchannelHttpHandler = new HttpClientHandler
                {
                    ClientCertificateOptions = ClientCertificateOption.Manual,
                    ServerCertificateCustomValidationCallback = (_, _, _, _) => true,
                };
            }

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
            };
        });

        services.AddAuthorization();

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

        services.AddImageSharp()
            .RemoveProvider<PhysicalFileSystemProvider>()
            .AddProvider<CoverProvider>()
            .AddProvider<RenderingProvider>()
            .SetCache<NullImageCache>();

        services.AddTransient<FbsrClient>();
        services.AddTransient<BlueprintConverter>();
        services.AddTransient<BuildService>();
        services.AddTransient<FollowerService>();
        services.AddTransient<ImageService>();
        services.AddTransient<AssetService>();
        services.AddTransient<SlugService>();

        services.AddSingleton(BuildTags.Load());
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
        }

        if (!env.IsDevelopment())
        {
            app.UseHsts();
        }

        if (!env.IsProduction())
        {
            app.UseSwagger(options => options.PreSerializeFilters.Add((doc, _) => doc.Servers?.Clear()));
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "factorio.tech v1");
                options.OAuthClientId("swagger");
                options.OAuthClientSecret("swagger");
                options.OAuthUsePkce();
            });
        }

        app.UseHttpsRedirection();
        app.UseProblemDetails();
        app.UseRouting();
        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseImageSharp();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });

        if (!environment.IsProduction())
        {
            app.EnsureDevelopmentDataIsSeeded();
        }
    }
}
