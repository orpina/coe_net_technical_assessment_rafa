namespace TA_API.Entities.AppSettings
{
    public record HttpClientConfig<T>
    {
        public required string BaseUrl { get; set; }
        public required int ClientTimeoutInSeconds { get; set; }
        public required int HandlerLifetimetInSeconds { get; set; }
        public T? Endpoints { get; set; }
    }
}
