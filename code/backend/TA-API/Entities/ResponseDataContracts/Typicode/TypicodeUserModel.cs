namespace TA_API.Entities.ResponseDataContracts.Typicode
{
    public class TypicodeUserModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public TypicodeUserCompany? Company { get; set; }
    }
}
