using FactorioTech.Core;
using FactorioTech.Core.Config;
using FactorioTech.Core.Consumers;
using FactorioTech.Core.Data;
using MassTransit;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Serilog;
using Serilog.Events;
using System;
using System.Linq;

namespace FactorioTech.Worker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = CreateLoggerBuilder(args).CreateLogger();

            try
            {
                Log.Information($"{typeof(Program).Assembly.GetName().Name} starting up");

                CreateHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application start-up failed");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static LoggerConfiguration CreateLoggerBuilder(string[] args)
        {
            var config = new LoggerConfiguration();
            ConfigureLogger(null, null, config);
            return config;
        }

        public static void ConfigureLogger(HostBuilderContext? context, IServiceProvider? services, LoggerConfiguration config)
        {
            config.Enrich.FromLogContext()
                .MinimumLevel.Information()
                .MinimumLevel.Override(typeof(Program).Namespace?.Split('.').First(), LogEventLevel.Debug)
                .WriteTo.Console();

            var telemetryConfiguration = services?.GetService<TelemetryConfiguration>();
            if (telemetryConfiguration != null)
            {
                config.WriteTo.ApplicationInsights(telemetryConfiguration, TelemetryConverter.Traces);
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog(ConfigureLogger)
                .ConfigureAppConfiguration(config =>
                {
                    config.AddEnvironmentVariables();
                    config.AddJsonFile("appsettings.secret.json", optional: true, reloadOnChange: false);
                    config.AddKeyPerFile("/run/secrets", optional: true, reloadOnChange: false);
                    config.AddKeyPerFile("/config", optional: true, reloadOnChange: false);
                    config.AddKeyPerFile("/secrets", optional: true, reloadOnChange: false);
                })
                .ConfigureServices((host, services) =>
                {
                    services.Configure<AppConfig>(host.Configuration.GetSection(nameof(AppConfig)));
                    services.Configure<RabbitMqConfig>(host.Configuration.GetSection(nameof(RabbitMqConfig).Replace("Config", string.Empty)));
                    services.Configure<BuildInformation>(host.Configuration.GetSection(nameof(BuildInformation)));

                    services.AddDbContext<AppDbContext>(options =>
                    {
                        options.UseNpgsql(host.Configuration.GetConnectionString("Postgres"), o => o.UseNodaTime());
                    });

                    services.AddHttpClient();
                    services.AddApplicationInsightsTelemetryWorkerService();

                    services.AddScoped<FbsrClient>();
                    services.AddScoped<BlueprintConverter>();
                    services.AddScoped<ImageService>();
                    services.AddScoped<BlueprintService>();

                    services.AddHostedService<MassTransitBus>();
                    services.AddMassTransit(options =>
                    {
                        options.AddConsumers(typeof(BlueprintImportStartedConsumer).Assembly);
                        options.UsingRabbitMq((ctx, cfg) =>
                        {
                            var config = ctx.GetRequiredService<IOptions<RabbitMqConfig>>().Value;

                            cfg.ConfigureEndpoints(ctx);
                            cfg.Host(config.Host, config.VirtualHost, h =>
                            {
                                h.Username(config.Username);
                                h.Password(config.Password);
                            });
                        });
                    });
                });
    }
}
