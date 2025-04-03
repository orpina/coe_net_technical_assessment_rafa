namespace TA_API.Entities.AppSettings
{
    public class RedisConfig
    {
        public required string UsersKey { get; set; }
        public required int LifeTimeInSeconds { get; set; }
    }
}
