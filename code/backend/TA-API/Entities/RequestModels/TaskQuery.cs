﻿namespace TA_API.Entities.RequestModels
{
    public class TaskQuery : PaginatedQuery
    {
        public string? SearchValue { get; set; }
        public int? AssignedUserId { get; set; }
    }
}
