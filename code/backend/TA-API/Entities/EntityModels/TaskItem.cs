namespace TA_API.Entities.EntityModels
{
    public class TaskItem
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int? AssignedUserId { get; set; }
        public bool IsCompleted { get; set; }
    }
}
