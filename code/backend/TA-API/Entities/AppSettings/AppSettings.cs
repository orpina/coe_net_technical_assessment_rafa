namespace TA_API.Entities.AppSettings
{
    public record AppSettings
    {
        public required AppSettingsConfigurations Configurations { get; set; }
    }
}
