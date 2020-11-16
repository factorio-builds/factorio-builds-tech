using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace FactorioTech.Web.Core
{
    public class FbsrClient
    {
        public record RenderRequest
        {
            public string Blueprint { get; init; } = string.Empty;
            public bool ShowInfoPanels { get; init; } = true;
            public int? MaxWidth { get; init; }
            public int? MaxHeight { get; init; }
            public float Quality { get; init; } = 1;
        }

        private readonly ILogger<FbsrClient> _logger;
        private readonly HttpClient _httpClient;

        private static readonly JsonSerializerOptions _options = new()
        {
            PropertyNamingPolicy = new SnakeCaseNamingPolicy(),
            IgnoreNullValues = true,
        };

        public FbsrClient(ILogger<FbsrClient> logger, HttpClient httpClient)
        {
            _logger = logger;
            _httpClient = httpClient;
        }

        public async Task<byte[]> FetchBlueprintRendering(string blueprint)
        {
            var response = await _httpClient.PostAsJsonAsync(AppConfig.FbsrWrapperUri, new RenderRequest
            {
                Blueprint = blueprint,
                MaxWidth = 1110,
                MaxHeight = 1440,
                ShowInfoPanels = false,
                Quality = 1,
            }, _options);

            return await response.Content.ReadAsByteArrayAsync();
        }
    }
}
