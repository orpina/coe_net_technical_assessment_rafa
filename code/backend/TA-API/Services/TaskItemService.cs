using AutoMapper;
using TA_API.Entities.EntityModels;
using TA_API.Entities.RequestModels;
using TA_API.Entities.ResponseModels;
using TA_API.Repository;
using TA_API.Services.Interfaces;

namespace TA_API.Services
{
    public class TaskItemService(IGenericRepository<TaskItem> taskItemsRepo, IMapper mapper) : ITaskItemService
    {
        private readonly IGenericRepository<TaskItem> _taskItemsRepo = taskItemsRepo;
        private readonly IMapper _mapper = mapper;

        public IEnumerable<TaskItemVM> GetAllTaskItems()
        {
            var allTasks = _taskItemsRepo.GetAll()?.ToList();

            return _mapper.Map<IEnumerable<TaskItemVM>>(allTasks ?? []);
        }

        public TaskItemVM GetTaskItem(int taskId)
        {
            var taskItem = _taskItemsRepo.GetById(taskId);

            return _mapper.Map<TaskItemVM>(taskItem);
        }

        public async Task<TaskItemVM> Create(UpsertTaskItemRequest request)
        {
            var newTask = new TaskItem()
            { 
                Title = request.Title,
                Description = request.Description,
                AssignedUserId = request.AssignedUserId
            };

            _taskItemsRepo.Add(newTask);

            await _taskItemsRepo.SaveChangesAsync();

            return _mapper.Map<TaskItemVM>(newTask);
        }

        public async Task<bool> CompleteTask(int taskId)
        {
            var existingTask = _taskItemsRepo.GetById(taskId);

            existingTask.IsCompleted = true;

            _taskItemsRepo.Update(existingTask);

            await _taskItemsRepo.SaveChangesAsync();

            return true;
        }
    }
}
