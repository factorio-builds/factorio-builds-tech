using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
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
            .UseSerilog()
            .ConfigureAppConfiguration(config =>
            {
                config.AddJsonFile("appsettings.secret.json", optional: true, reloadOnChange: true);
            })
            .ConfigureWebHostDefaults(builder =>
            {
                builder.UseStartup<Startup>();
            });
    }
}
