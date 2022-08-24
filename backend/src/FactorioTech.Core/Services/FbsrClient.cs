using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace FactorioTech.Core.Services;

[AutoConstructor]
public partial class FbsrClient
{
    public record RenderRequest
    {
        public string Blueprint { get; init; } = string.Empty;
        public bool ShowInfoPanels { get; init; } = true;
        public int? MaxWidth { get; init; }
        public int? MaxHeight { get; init; }
    }

    private static readonly JsonSerializerOptions JsonSerializerOptions = new()
    {
        PropertyNamingPolicy = new SnakeCaseNamingPolicy(),
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    [AutoConstructorInject("options.Value", "options", typeof(IOptions<AppConfig>))]
    private readonly AppConfig appConfig;
    private readonly HttpClient httpClient;
    private readonly ILogger<FbsrClient> logger;

    public async Task<Stream> FetchRendering(string blueprint)
    {
        logger.LogInformation("Fetching rendering from FBSR at {FbsrUrl}", appConfig.FbsrWrapperUri);

        var sw = Stopwatch.StartNew();
        var response = await httpClient.PostAsJsonAsync(appConfig.FbsrWrapperUri, new RenderRequest
        {
            Blueprint = blueprint,
            MaxWidth = AppConfig.Rendering.MaxWidth,
            MaxHeight = AppConfig.Rendering.MaxHeight,
            ShowInfoPanels = false,
        }, JsonSerializerOptions);

        if (!response.IsSuccessStatusCode)
        {
            var problem = await response.Content.ReadAsStringAsync();
            logger.LogError("Error response from FBSR {StatusCode} {Problem}", response.StatusCode, problem);
            throw new Exception($"Error response from FBSR: {response.StatusCode}");
        }

        var rendering = await response.Content.ReadAsStreamAsync();
        if (rendering.Length == 0)
            throw new Exception("Fetched 0 bytes from FBSR");

        logger.LogInformation("Request to FBSR completed successfully in {Elapsed}", sw.Elapsed);

        return rendering;
    }
}
