using Microsoft.AspNetCore.Mvc;
using TA_API.Services.Interfaces;

namespace TA_API.Controller
{
    [ApiController]
    [Route("api/users")]
    public class UsersController(IUsersProvider usersProvider) : ControllerBase
    {
        private readonly IUsersProvider _usersProvider = usersProvider;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var allUsers = await _usersProvider.GetAllUsers();
                if (allUsers is null || !allUsers.Any())
                    return NoContent();

                return Ok(allUsers);
            }
            catch (Exception ex)
            {
                return this.StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
