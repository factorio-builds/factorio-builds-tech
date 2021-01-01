using FactorioTech.Api.Services;
using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Core.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NodaTime;
using NodaTime.Serialization.SystemTextJson;
using System;
using System.IO;
using System.Net.Http;
using System.Reflection;
using System.Security.Authentication;
using System.Text.Json.Serialization;

namespace FactorioTech.Api
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var appConfig = _configuration.GetSection(nameof(AppConfig)).Get<AppConfig>();

            services.Configure<AppConfig>(_configuration.GetSection(nameof(AppConfig)));
            services.Configure<BuildInformation>(_configuration.GetSection(nameof(BuildInformation)));

            services.AddHttpClient();
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.Converters.Add(new VersionJsonConverter());
                options.JsonSerializerOptions.Converters.Add(new HashJsonConverter());
                options.JsonSerializerOptions.PropertyNamingPolicy = new SnakeCaseNamingPolicy();
                options.JsonSerializerOptions.IgnoreNullValues = true;
                options.JsonSerializerOptions.ConfigureForNodaTime(DateTimeZoneProviders.Tzdb);
            });

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "factorio.tech", Version = "v1" });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);
                options.UseInlineDefinitionsForEnums();
                options.MapType(typeof(Instant), () => new OpenApiSchema { Type = "string" });
                options.MapType(typeof(Hash), () => new OpenApiSchema { Type = "string" });
                options.MapType(typeof(Version), () => new OpenApiSchema { Type = "string" });
                options.MapType(typeof(AssetService.IconSize), () => new OpenApiSchema { Type = "integer" });
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
                        .Let(b => _environment.IsProduction()
                            ? b.WithOrigins($"{appConfig.FrontendUri.Scheme}://{appConfig.FrontendUri.Authority}")
                            : b.WithOrigins($"{appConfig.FrontendUri.Scheme}://{appConfig.FrontendUri.Authority}",
                                            "https://local.factorio.tech", "http://localhost:3000")));
            });

            services.AddDatabaseDeveloperPageExceptionFilter();
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(_configuration.GetConnectionString("Postgres"), o => o.UseNodaTime());
            });

            services.AddAuthentication("Bearer").AddJwtBearer("Bearer", options =>
            {
                options.Authority = $"{appConfig.IdentityUri.Scheme}://{appConfig.IdentityUri.Authority}";

                if (!_environment.IsProduction() && appConfig.IdentityUri.Host.EndsWith("local.factorio.tech"))
                {
                    options.BackchannelHttpHandler = new HttpClientHandler
                    {
                        ClientCertificateOptions = ClientCertificateOption.Manual,
                        SslProtocols = SslProtocols.Tls13,
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

            if (!_environment.IsProduction())
            {
                services.AddTransient<DevDataSeeder>();
            }

            if (!_environment.IsDevelopment())
            {
                services.AddDataProtection()
                    .PersistKeysToFileSystem(new DirectoryInfo(Path.Join(appConfig.ProtectedDataDir, "session")));
            }

            services.AddTransient<FbsrClient>();
            services.AddTransient<BlueprintConverter>();
            services.AddTransient<ImageService>();
            services.AddTransient<AssetService>();
            services.AddTransient<BlueprintService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedProto
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

            app.UseSwagger(c => c.PreSerializeFilters.Add((doc, _) => doc.Servers?.Clear()));
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "factorio.tech v1"));

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            if (!_environment.IsProduction())
            {
                app.EnsureDevelopmentDataIsSeeded();
            }
        }
    }
}
