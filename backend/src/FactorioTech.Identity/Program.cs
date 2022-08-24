using Microsoft.ApplicationInsights.Extensibility;
using Serilog;
using Serilog.Events;

namespace FactorioTech.Identity;

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
            .MinimumLevel.Override(typeof(Program).Namespace?.Split('.').First()!, LogEventLevel.Debug)
            .WriteTo.Console();

        var telemetryConfiguration = services?.GetService<TelemetryConfiguration>();
        if (telemetryConfiguration != null)
        {
            config.WriteTo.ApplicationInsights(telemetryConfiguration, TelemetryConverter.Traces);
        }
    }

    public static IHostBuilder CreateHostBuilder(string[] args) => Host
        .CreateDefaultBuilder(args)
        .UseSerilog(ConfigureLogger)
        .ConfigureAppConfiguration(config =>
        {
            config.AddJsonFile("appsettings.secret.json", optional: true, reloadOnChange: false);
            config.AddKeyPerFile("/mnt/config", optional: true, reloadOnChange: false);
            config.AddKeyPerFile("/mnt/secrets", optional: true, reloadOnChange: false);
        })
        .ConfigureWebHostDefaults(builder =>
        {
            builder.UseStartup<Startup>();
        });
}
