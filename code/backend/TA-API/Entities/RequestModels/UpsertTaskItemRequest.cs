using System.ComponentModel.DataAnnotations;

namespace TA_API.Entities.RequestModels
{
    public class UpsertTaskItemRequest
    {
        [StringLength(250, ErrorMessage = $"{nameof(Title)} max length is 250 characters ")]
        public required string Title { get; set; }

        [StringLength(500, ErrorMessage = $"{nameof(Description)} max length is 500 characters ")]
        public string? Description { get; set; }

        public int? AssignedUserId { get; set; }
    }
}
