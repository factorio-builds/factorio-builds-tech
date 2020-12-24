using FactorioTech.Api.ViewModels;
using FactorioTech.Core;
using FactorioTech.Core.Domain;
using System.Collections.Generic;
using System.Linq;

namespace FactorioTech.Api
{
    public static class ViewModelMapper
    {
        public static BuildsModel ToViewModel(this IEnumerable<Blueprint> blueprints, FactorioApi.BlueprintEnvelope? envelope = null) =>
            new()
            {
                Builds = blueprints.Select(bp => bp.ToViewModel(envelope)),
            };

        public static BuildModel ToViewModel(this Blueprint blueprint, FactorioApi.BlueprintEnvelope? envelope = null) =>
            new()
            {
                Slug = blueprint.Slug,
                CreatedAt = blueprint.CreatedAt,
                UpdatedAt = blueprint.UpdatedAt,
                Title = blueprint.Title,
                Description = blueprint.Description,
                Owner = blueprint.Owner?.ToViewModel() ?? new UserModel { Username = blueprint.OwnerSlug },
                LatestVersion = blueprint.LatestVersion?.ToViewModel(envelope),
                LatestGameVersion = blueprint.LatestGameVersion,
                Tags = blueprint.Tags?.Select(t => t.Value)
            };

        public static UserModel ToViewModel(this User user) =>
            new()
            {
                Username = user.UserName,
                DisplayName = user.DisplayName,
            };

        public static VersionModel ToViewModel(this BlueprintVersion version, FactorioApi.BlueprintEnvelope? envelope = null) =>
            new()
            {
                CreatedAt = version.CreatedAt,
                Name = version.Name,
                Description = version.Description,
                Payload = version.Payload != null && envelope != null ? version.Payload.ToViewModel(envelope) : null,
            };
        

        public static PayloadModel ToViewModel(this BlueprintPayload payload, FactorioApi.BlueprintEnvelope envelope, PayloadCache? payloadGraph = null) =>
            new()
            {
                Hash = payload.Hash.ToString(),
                GameVersion = payload.GameVersion.ToString(4),
                Encoded = payload.Encoded,
                Blueprint = envelope.ToViewModel(),
                Children = payloadGraph == null ? null
                    : envelope.BlueprintBook?.Blueprints?.Select(x => payloadGraph[x].ToViewModel(x, payloadGraph)) 
                    ?? Enumerable.Empty<PayloadModel>()
            };

        public static BlueprintEnvelopeModel ToViewModel(this FactorioApi.BlueprintEnvelope envelope) =>
            new()
            {
                Type = envelope.Item,
                Label = envelope.Label,
                Description = envelope.Description,
                Entities = envelope.Blueprint?.Entities
                    .GroupBy(e => e.Name)
                    .OrderByDescending(g => g.Count())
                    .ToDictionary(g => g.Key.ToLowerInvariant(), g => g.Count())
                    ?? new Dictionary<string, int>(),
                Icons = envelope.Icons?
                    .OrderBy(i => i.Index)
                    .Select(i => new BlueprintEnvelopeModel.Entity(i.Signal.Type, i.Signal.Name))
                    ?? Enumerable.Empty<BlueprintEnvelopeModel.Entity>(),
            };
    }
}
