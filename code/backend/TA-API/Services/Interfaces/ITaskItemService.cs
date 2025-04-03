using TA_API.Entities.RequestModels;
using TA_API.Entities.ResponseModels;

namespace TA_API.Services.Interfaces
{
    public interface ITaskItemService
    {
        IEnumerable<TaskItemVM> GetAllTaskItems();

        TaskItemVM GetTaskItem(int taskId);

        Task<TaskItemVM> Create(UpsertTaskItemRequest request);

        Task<bool> CompleteTask(int taskId);
    }
}
