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
            var configuration = new ConfigurationBuilder()
                .AddCommandLine(args)
                .AddEnvironmentVariables("FT_")
                .Build();

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
                    .UseConfiguration(configuration)
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
