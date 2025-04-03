namespace TA_API.Entities.ResponseModels
{
    public class PaginatedResponse<T>
    {
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public IEnumerable<T>? Items { get; set; }
    }
}
