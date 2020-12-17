using FactorioTech.Core.Messages;
using MassTransit;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace FactorioTech.Core.Consumers
{
    public class BlueprintImportStartedConsumer : IConsumer<BlueprintImportStarted>
    {
        private readonly ILogger<BlueprintImportStartedConsumer> _logger;
        private readonly BlueprintConverter _blueprintConverter;
        private readonly ImageService _imageService;

        public BlueprintImportStartedConsumer(
            ILogger<BlueprintImportStartedConsumer> logger,
            BlueprintConverter blueprintConverter,
            ImageService imageService)
        {
            _logger = logger;
            _blueprintConverter = blueprintConverter;
            _imageService = imageService;
        }

        public async Task Consume(ConsumeContext<BlueprintImportStarted> context)
        {
            _logger.LogInformation("Handling {Type} {MessageId}: Hash={Hash} GameVersion={GameVersion} UserId={UserId}",
                nameof(Messages.BlueprintImportStarted), context.MessageId, context.Message.Payload.Hash, context.Message.Payload.GameVersion, context.Message.UserId);

            var envelope = await _blueprintConverter.Decode(context.Message.Payload.Encoded);

            var payloadCache = new PayloadCache();
            payloadCache.TryAdd(envelope, context.Message.Payload);

            await _imageService.SaveAllBlueprintRenderings(Guid.Empty, payloadCache, envelope);
        }
    }
}
