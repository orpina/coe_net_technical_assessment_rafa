namespace TA_API.Entities.AppSettings
{
    public class AppSettingsConfigurations
    {
        public required HttpClientConfig<TypicodeEndpoints> TypicodeClient { get; set; }
        public required RedisConfig RedisConfig { get; set; }
    }
}
