namespace FactorioTech.Core.Config
{
    public class RabbitMqConfig
    {
        public string Host { get; init; } = "localhost";
        public string VirtualHost { get; init; } = "/";
        public string Username { get; init; } = "guest";
        public string Password { get; init; } = "guest";
    }
}
