using System.ComponentModel.DataAnnotations;

namespace TA_API.Entities.RequestModels
{
    public class PaginatedQuery : SortableQuery
    {
        [Range(0, 1000)]
        public int PageIndex { get; set; }
        [Range(1, 1000)]
        public int PageSize { get; set; }
    }
}
