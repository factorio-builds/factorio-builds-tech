using FactorioTech.Core.Domain;
using System;

namespace FactorioTech.Core.Messages
{
    public record BlueprintImportStarted(Guid UserId, BlueprintPayload Payload);
}
