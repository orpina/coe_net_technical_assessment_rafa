namespace AssessmentAPI.Models
{
    public class AuthenticationSettings
    {
        public string SecretKey { get; init; } = null!;
        public string Audience { get; init; } = null!;
        public string Issuer { get; init; } = null!;
        public int MinutesToExpiration { get; init; }
        public TimeSpan Expire => TimeSpan.FromMinutes(MinutesToExpiration);
    }
}
