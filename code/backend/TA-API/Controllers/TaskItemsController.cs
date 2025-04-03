using Microsoft.AspNetCore.Mvc;
using System.Net;
using TA_API.Entities.EntityModels;
using TA_API.Entities.RequestModels;
using TA_API.Entities.ResponseModels;
using TA_API.Repository;
using TA_API.Services.Interfaces;

namespace TA_API.Controller
{
    [ApiController]
    [Route("api/tasks")]
    public class TaskItemsController(ITaskItemService taskItemService, ILogger<TaskItemsController> logger) : ControllerBase
    {
        private readonly ITaskItemService _taskItemService = taskItemService;
        private readonly ILogger<TaskItemsController> _logger = logger;

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var allTasks = _taskItemService.GetAllTaskItems();
                if (allTasks is null || !allTasks.Any())
                    return NoContent();

                return Ok(allTasks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when getting the tasks.");
                return this.StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }          
        }

        [HttpPost]
        [Route("get-paginated")]
        public IActionResult GetPaginated([FromBody] TaskQuery query)
        {
            try
            {
                var response = _taskItemService.GetPaginated<TaskItemVM>(query);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return this.StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetItem(int id)
        {
            try
            {
                if (id == 0)
                    return BadRequest("Invalid id");

                var taskItem = _taskItemService.GetTaskItem(id);
                if (taskItem is null)
                    return NotFound();

                return Ok(taskItem);
            }
            catch (Exception ex)
            {
                return this.StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] UpsertTaskItemRequest request, [FromServices] IUsersProvider usersProvider)
        {
            try
            {
                if (request is null)
                    return BadRequest("Invalid id");

                if(request.AssignedUserId.HasValue &&  await usersProvider.GetUser(request.AssignedUserId.Value) is null)
                    return BadRequest($"User with ID: {request.AssignedUserId.Value} not found");

                var taskItem = await _taskItemService.Create(request);

                return Ok(taskItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when creating the task.");
                return this.StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> CompleteItem([FromRoute] int id, [FromServices] IGenericRepository<TaskItem> taskItemsRepo)
        {
            try
            {
                if (id ==0)
                    return BadRequest("Invalid id");

                if (taskItemsRepo.GetAll().FirstOrDefault(c => c.Id == id) is null)
                    return BadRequest($"Task with ID: {id} not found");

                var isSuccess = await _taskItemService.CompleteTask(id);

                return Ok(isSuccess);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when updating the task.");
                return this.StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
