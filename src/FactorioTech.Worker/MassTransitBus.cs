using MassTransit;
using Microsoft.Extensions.Hosting;
using System.Threading;
using System.Threading.Tasks;

namespace FactorioTech.Worker
{
    public class MassTransitBus : IHostedService
    {
        private readonly IBusControl _bus;

        public MassTransitBus(IBusControl bus) => _bus = bus;

        public Task StartAsync(CancellationToken cancellationToken) => _bus.StartAsync(cancellationToken);

        public Task StopAsync(CancellationToken cancellationToken) => _bus.StopAsync(cancellationToken);
    }
}
