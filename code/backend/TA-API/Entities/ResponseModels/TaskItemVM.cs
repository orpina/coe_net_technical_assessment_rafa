﻿namespace TA_API.Entities.ResponseModels
{
    public class TaskItemVM
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int? AssignedUserId { get; set; }
        public bool IsCompleted { get; set; }
    }
}
