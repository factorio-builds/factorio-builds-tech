using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Events;
using System;

namespace FactorioTech.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var loggerBuilder = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .MinimumLevel.Information()
                .MinimumLevel.Override("FactorioTech", LogEventLevel.Debug)
                .WriteTo.Console();

            Log.Logger = loggerBuilder.CreateLogger();

            try
            {
                Log.Information("FactorioTech starting up");

                WebHost.CreateDefaultBuilder(args)
                    .ConfigureAppConfiguration(config =>
                    {
                        config.AddJsonFile("appsettings.secret.json", optional: true, reloadOnChange: true);
                    })
                    .UseSerilog()
                    .UseStartup<Startup>()
                    .Build()
                    .Run();
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
    }
}
