using System.ComponentModel.DataAnnotations;

namespace TA_API.Entities.RequestModels
{
    public class SortableQuery
    {
        [RegularExpression("asc|desc", ErrorMessage = $"{nameof(SortDirection)} must be either 'asc' or 'desc' only.")]
        public required string SortDirection { get; set; }

        public required string SortProperty { get; set; }
    }
}
