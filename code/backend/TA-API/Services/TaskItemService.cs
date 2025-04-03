using AutoMapper;
using System.Linq.Dynamic.Core;
using TA_API.Entities.EntityModels;
using TA_API.Entities.RequestModels;
using TA_API.Entities.ResponseModels;
using TA_API.Extensions;
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

        public PaginatedResponse<T> GetPaginated<T>(TaskQuery query)
        {
            query!.SortProperty = query.IsValidSortProperty<TaskItem, TaskQuery>() ? query.SortProperty : "Id";

            var items = _taskItemsRepo.GetAll();

            if (!string.IsNullOrEmpty(query?.SearchValue))
            {
                items = items.Where(c => (!string.IsNullOrWhiteSpace(c.Title) && c.Title.Contains(query.SearchValue)) ||
                                         (!string.IsNullOrWhiteSpace(c.Description) && c.Description.Contains(query.SearchValue)));
            }

            var itemsCount = items.Count();

            items = items.OrderBy($"{query!.SortProperty} {query!.SortDirection}");

            query!.PageIndex = query?.PageIndex ?? 0;
            query!.PageSize = query?.PageSize > 0 ? query.PageSize : 10;

            items = items.Skip(query!.PageIndex * query!.PageSize).Take(query!.PageSize);

            return new PaginatedResponse<T>()
            {
                TotalItems = itemsCount,
                TotalPages = (int)Math.Ceiling(itemsCount / (decimal)query.PageSize),
                Items = _mapper.Map<IEnumerable<T>>(items)
            };
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
