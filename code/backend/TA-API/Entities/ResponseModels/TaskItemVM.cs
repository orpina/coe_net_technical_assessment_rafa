namespace TA_API.Entities.ResponseModels
{
    public class TaskItemVM
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int? AssignedUserId { get; set; }
        public bool IsCompleted { get; set; }
    }
}
