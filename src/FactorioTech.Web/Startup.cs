using FactorioTech.Web.Core;
using FactorioTech.Web.Core.Domain;
using FactorioTech.Web.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
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

            services.AddAuthentication().AddGitHub(options =>
            {
                options.ClientId = "***REMOVED***";
                options.ClientSecret = "***REMOVED***";
            });

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlite(_configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddDatabaseDeveloperPageExceptionFilter();
            services.AddIdentityCore<User>()
                .AddDefaultTokenProviders()
                .AddSignInManager()
                .AddEntityFrameworkStores<AppDbContext>();

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

            services.AddRazorPages();
            services.AddHttpClient();

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

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapRazorPages();
            });
        }
    }
}
