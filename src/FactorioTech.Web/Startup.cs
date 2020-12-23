using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Web.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;

#if !DEBUG
using Microsoft.AspNetCore.DataProtection;
using System.IO;
#endif

namespace FactorioTech.Web
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration) => _configuration = configuration;

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppConfig>(_configuration.GetSection(nameof(AppConfig)));
            services.Configure<BuildInformation>(_configuration.GetSection(nameof(BuildInformation)));

            services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
            });

            var authenticationBuilder = services.AddAuthentication();

            var oAuthProviderConfig = _configuration.Get<OAuthProviderConfig>();
            if (oAuthProviderConfig?.OAuthProviders?.Any() != true)
                throw new Exception("Must configure at least one OAuth provider!");

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

            services.AddCors(options =>
            {
                options.AddPolicy("factorio-blueprint-editor", builder =>
                    builder.WithOrigins($"{AppConfig.BlueprintEditorUri.Scheme}://{AppConfig.BlueprintEditorUri.Host}")
                           .AllowAnyHeader()
                           .AllowAnyMethod());
            });

            services.AddDatabaseDeveloperPageExceptionFilter();
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(_configuration.GetConnectionString("Postgres"), o => o.UseNodaTime());
            });

            services.AddIdentityCore<User>()
                .AddDefaultTokenProviders()
                .AddSignInManager()
                .AddRoles<Role>()
                .AddEntityFrameworkStores<AppDbContext>();

            services.Configure<IdentityOptions>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.User.AllowedUserNameCharacters = AppConfig.Policies.Slug.AllowedCharacters;
            });

            services.AddTransient<IUserValidator<User>, CustomUserNamePolicy>();
            services.AddScoped<IUserClaimsPrincipalFactory<User>, CustomUserClaimsPrincipalFactory>();

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = IdentityConstants.ApplicationScheme;
                options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
            }).AddIdentityCookies();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdministratorRole",
                    policy => policy.RequireRole("Administrator"));
            });

            services.ConfigureApplicationCookie(options =>
            {
                options.LoginPath = "/account/login";
                options.LogoutPath = "/account/logout";
                options.AccessDeniedPath = "/errors/403";
            });

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.TryAddScoped<IUrlHelper>(serviceProvider =>
                serviceProvider.GetRequiredService<IUrlHelperFactory>()
                    .GetUrlHelper(serviceProvider.GetRequiredService<IActionContextAccessor>().ActionContext));

            services.AddRazorPages()
                .AddSessionStateTempDataProvider();
#if !DEBUG
            services.AddDataProtection()
                .PersistKeysToFileSystem(new DirectoryInfo("/mnt/session"));
#endif

            services.AddHttpClient();
            services.AddSession();

            services.AddApplicationInsightsTelemetry(options =>
            {
                options.ApplicationVersion = BuildInformation.Version;
            });

            services.AddTransient<IEmailSender, DummyEmailSender>();
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

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Errors/500");
                app.UseHsts();
            }

            app.UseStatusCodePagesWithReExecute("/Errors/{0}");

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSession();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapRazorPages();
            });
        }
    }
}
