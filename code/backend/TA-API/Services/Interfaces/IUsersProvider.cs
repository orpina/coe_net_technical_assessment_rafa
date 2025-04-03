using TA_API.Entities.ResponseModels;

namespace TA_API.Services.Interfaces
{
    public interface IUsersProvider
    {
        Task<IEnumerable<UserVM>> GetAllUsers();
        Task<UserVM?> GetUser(int id);
    }
}
