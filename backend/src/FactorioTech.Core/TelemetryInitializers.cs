using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Reflection;

namespace FactorioTech.Core
{
    public class CloudRoleInitializer : ITelemetryInitializer
    {
        private static readonly string AppName = Assembly.GetEntryAssembly()?.GetName().Name?.Split('.').Last() ?? "unknown";

        public void Initialize(ITelemetry telemetry)
        {
            telemetry.Context.Cloud.RoleName = AppName;
        }
    }

    public class UserInitializer : ITelemetryInitializer
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserInitializer(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public void Initialize(ITelemetry telemetry)
        {
            var user = _httpContextAccessor.HttpContext.User;
            if (user.Identity?.IsAuthenticated == true)
            {
                telemetry.Context.User.AccountId = user.GetUserId().ToString();
                telemetry.Context.User.AuthenticatedUserId = user.GetUserName();
            }
        }
    }
}
