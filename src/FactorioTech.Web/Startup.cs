using FactorioTech.Core;
using FactorioTech.Core.Data;
using FactorioTech.Core.Domain;
using FactorioTech.Web.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Linq;

namespace FactorioTech.Web
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            if (services == null)
            {
                Log.Fatal("services is null");
                throw new ArgumentNullException(nameof(services));
            }

            if (_configuration == null)
            {
                Log.Fatal("_configuration is null");
                throw new ArgumentNullException(nameof(_configuration));
            }

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

            services.ConfigureApplicationCookie(options =>
            {
                options.LoginPath = "/Account/Login";
                options.LogoutPath = "/Account/Logout";
                options.AccessDeniedPath = "/Account/AccessDenied";
            });

            services.AddRazorPages()
                .AddSessionStateTempDataProvider();

            services.AddHttpClient();
            services.AddSession();

            services.AddTransient<IEmailSender, DummyEmailSender>();
            services.AddTransient<FbsrClient>();
            services.AddTransient<BlueprintConverter>();
            services.AddTransient<ImageService>();
            services.AddTransient<BlueprintService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

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
