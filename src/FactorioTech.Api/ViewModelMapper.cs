using FactorioTech.Api.ViewModels;
using FactorioTech.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace FactorioTech.Api
{
    public static class ViewModelMapper
    {
        public static BuildsModel ToViewModel(this IEnumerable<Blueprint> blueprints) =>
            new()
            {
                Builds = blueprints.Select(ToViewModel),
            };

        public static BuildModel ToViewModel(this Blueprint blueprint) =>
            new()
            {
                Slug = blueprint.Slug,
                CreatedAt = blueprint.CreatedAt,
                UpdatedAt = blueprint.UpdatedAt,
                Title = blueprint.Title,
                Description = blueprint.Description,
                Owner = blueprint.Owner?.ToViewModel() ?? new UserModel { Username = blueprint.OwnerSlug },
                LatestVersion = blueprint.LatestVersion?.ToViewModel(),
                LatestGameVersion = blueprint.LatestGameVersion,
                Tags = blueprint.Tags?.Select(t => t.Value)
            };

        public static UserModel ToViewModel(this User user) =>
            new()
            {
                Username = user.UserName,
                DisplayName = user.DisplayName,
            };

        public static VersionModel ToViewModel(this BlueprintVersion version) =>
            new()
            {
                CreatedAt = version.CreatedAt,
                Name = version.Name,
                Description = version.Description,
                Payload = version.Payload?.ToViewModel()
            };
        public static PayloadModel ToViewModel(this BlueprintPayload payload) =>
            new()
            {
                Hash = payload.Hash.ToString(),
                GameVersion = payload.GameVersion.ToString(4),
                Encoded = payload.Encoded,

                // todo below
                Blueprint = new BlueprintEnvelopeModel(),
                Children = Enumerable.Empty<PayloadModel>(),
            };
    }
}
