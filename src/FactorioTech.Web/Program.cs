using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using System;

namespace FactorioTech.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = CreateLoggerBuilder(args).CreateLogger();

            try
            {
                Log.Information("FactorioTech starting up");

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

        public static LoggerConfiguration CreateLoggerBuilder(string[] args) =>
            new LoggerConfiguration()
                .Enrich.FromLogContext()
                .MinimumLevel.Information()
                .MinimumLevel.Override("FactorioTech", LogEventLevel.Debug)
                .WriteTo.Console();

        public static IHostBuilder CreateHostBuilder(string[] args) => Host
            .CreateDefaultBuilder(args)
            .UseSerilog((_, services, logger) =>
            {
                logger.WriteTo.ApplicationInsights(services.GetRequiredService<TelemetryConfiguration>(), TelemetryConverter.Traces);
            })
            .ConfigureAppConfiguration(config =>
            {
                config.AddJsonFile("appsettings.secret.json", optional: true, reloadOnChange: false);
                config.AddKeyPerFile("/run/secrets", optional: true, reloadOnChange: false);
                config.AddKeyPerFile("/config", optional: true, reloadOnChange: false);
                config.AddKeyPerFile("/secrets", optional: true, reloadOnChange: false);
            })
            .ConfigureWebHostDefaults(builder =>
            {
                builder.UseStartup<Startup>();
            });
    }
}
