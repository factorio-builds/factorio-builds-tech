using FactorioTech.Core.Domain;
using System;

namespace FactorioTech.Web.Extensions
{
    public static class Uris
    {
        public static string BlueprintCover(Guid blueprintId) =>
            $"/files/cover/{blueprintId}";

        public static string BlueprintRendering(Hash hash, Guid versionId) =>
            versionId == Guid.Empty
                ? $"/files/rendering/{hash}.png"
                : $"/files/rendering/{versionId}/{hash}.png";

        public static string Icon(int size, string key, string type = "item") =>
            $"/files/icon/{size}/{type}/{key}.png";
    }
}
