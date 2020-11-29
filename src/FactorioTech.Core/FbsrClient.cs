using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace FactorioTech.Core
{
    public class FbsrClient
    {
        public record RenderRequest
        {
            public string Blueprint { get; init; } = string.Empty;
            public bool ShowInfoPanels { get; init; } = true;
            public int? MaxWidth { get; init; }
            public int? MaxHeight { get; init; }
        }

        private readonly ILogger<FbsrClient> _logger;
        private readonly AppConfig _appConfig;
        private readonly HttpClient _httpClient;

        private static readonly JsonSerializerOptions _options = new()
        {
            PropertyNamingPolicy = new SnakeCaseNamingPolicy(),
            IgnoreNullValues = true,
        };

        public FbsrClient(
            ILogger<FbsrClient> logger,
            IOptions<AppConfig> appConfigMonitor,
            HttpClient httpClient)
        {
            _logger = logger;
            _appConfig = appConfigMonitor.Value;
            _httpClient = httpClient;
        }

        public async Task<Stream> FetchBlueprintRendering(string blueprint)
        {
            var response = await _httpClient.PostAsJsonAsync(_appConfig.FbsrWrapperUri, new RenderRequest
            {
                Blueprint = blueprint,
                MaxWidth = 1110,
                MaxHeight = 1440,
                ShowInfoPanels = false,
            }, _options);

            if (!response.IsSuccessStatusCode)
            {
                var problem = await response.Content.ReadAsStringAsync();
                _logger.LogError("Error response from fbsr-wrapper {StatusCode} {Problem}", response.StatusCode, problem);
                throw new Exception($"Error response from fbsr-wrapper: {response.StatusCode}");
            }

            return await response.Content.ReadAsStreamAsync();
        }
    }
}
