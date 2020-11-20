using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace FactorioTech.Web.Core
{
    public interface IEmailSender
    {
        Task SendEmail(string email, string subject, string htmlMessage);
    }

    public class DummyEmailSender : IEmailSender
    {
        private readonly ILogger<DummyEmailSender> _logger;

        public DummyEmailSender(ILogger<DummyEmailSender> logger)
        {
            _logger = logger;
        }

        public Task SendEmail(string email, string subject, string htmlMessage)
        {
            _logger.LogInformation("Sending email to {Address}: {Subject}\n{Message}", email, subject, htmlMessage);
            return Task.CompletedTask;
        }
    }
}
