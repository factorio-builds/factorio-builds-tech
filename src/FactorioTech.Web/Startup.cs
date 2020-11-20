using FactorioTech.Web.Core;
using FactorioTech.Web.Core.Domain;
using FactorioTech.Web.Data;
using FactorioTech.Web.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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
            //var appConfig = _configuration.Get<AppConfig>();
            //if (appConfig == null)
            //    throw new Exception("Failed to parse configuration");

            //services.Configure<AppConfig>(_configuration);
            services.Configure<BuildInformation>(_configuration.GetSection(nameof(BuildInformation)));

            services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
            });

            services.AddAuthentication()
                .AddGitHub(options =>
                {
                    options.ClientId = _configuration["OAuthProviders:GitHub:ClientId"];
                    options.ClientSecret = _configuration["OAuthProviders:GitHub:ClientSecret"];
                    options.Scope.Add("user:email");
                });

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(
                    _configuration.GetConnectionString("Postgres"),
                    o => o.UseNodaTime());

            }).AddDatabaseDeveloperPageExceptionFilter();

            services.AddIdentityCore<User>()
                .AddDefaultTokenProviders()
                .AddSignInManager()
                .AddRoles<Role>()
                .AddEntityFrameworkStores<AppDbContext>();

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

            services.AddServerSideBlazor();
            services.AddRazorPages()
                .AddSessionStateTempDataProvider();

            services.AddHttpClient();
            services.AddSession();

            services.AddTransient<IEmailSender, DummyEmailSender>();
            services.AddTransient<FbsrClient>();
            services.AddTransient<ImageService>();
            services.AddTransient<BlueprintConverter>();
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
