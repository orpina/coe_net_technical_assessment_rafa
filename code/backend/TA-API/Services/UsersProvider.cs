using AutoMapper;
using Azure;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using TA_API.Constants;
using TA_API.Entities.AppSettings;
using TA_API.Entities.ResponseDataContracts.Typicode;
using TA_API.Entities.ResponseModels;
using TA_API.Services.Interfaces;

namespace TA_API.Services
{
    public class UsersProvider(
        IHttpClientFactory httpClientFactory,
        IMapper mapper, IOptions<AppSettings> settings,
        ILogger<UsersProvider> logger,
        IMemoryCache cache
        ) : IUsersProvider
    {
        private readonly HttpClient _httpClient = httpClientFactory.CreateClient(HttpClientNamesContants.TypicodeClient);
        private readonly IMapper _mapper = mapper;
        private readonly AppSettings _settings = settings.Value;
        private readonly ILogger<UsersProvider> _logger = logger;
        private readonly IMemoryCache _cache = cache;

        public async Task<IEnumerable<UserVM>> GetAllUsers()
        {
            try
            {
                if (_cache.TryGetValue(_settings.Configurations.RedisConfig.UsersKey, out IEnumerable<TypicodeUserModel>? cachedUsers))
                {
                    _logger.LogInformation("Returning usesr from cache");
                    return _mapper.Map<IEnumerable<UserVM>>(cachedUsers)!;
                }

                _logger.LogInformation("Getting users from Typicode {Time}", DateTime.UtcNow);

                var allUsersResponse = await _httpClient.GetAsync(_settings.Configurations.TypicodeClient.Endpoints!.Users);

                if (allUsersResponse.IsSuccessStatusCode)
                {
                    var responseData = await allUsersResponse.Content.ReadAsStringAsync();

                    var users = JsonConvert.DeserializeObject<IEnumerable<TypicodeUserModel>>(responseData);

                    _cache.Set(_settings.Configurations.RedisConfig.UsersKey, users, TimeSpan.FromSeconds(_settings.Configurations.RedisConfig.LifeTimeInSeconds));

                    return _mapper.Map<IEnumerable<UserVM>>(users);
                }

                _logger.LogWarning("Unable to get users from Typicode. Status Code: {StatusCode}", allUsersResponse.StatusCode);        
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "An error occurred when getting users from Typicode.");
                throw;
            }

            return [];
        }

        public async Task<UserVM?> GetUser(int id)
        {
            try
            {
                _logger.LogInformation("Getting user from Typicode {Time}", DateTime.UtcNow);

                var userResponse = await _httpClient.GetAsync($"{_settings.Configurations.TypicodeClient.Endpoints!.Users}/{id}");

                if (userResponse.IsSuccessStatusCode)
                {
                    var responseData = await userResponse.Content.ReadAsStringAsync();

                    var user = JsonConvert.DeserializeObject<TypicodeUserModel>(responseData);

                    return _mapper.Map<UserVM>(user);
                }

                _logger.LogWarning("Unable to get user from Typicode. Status Code: {StatusCode}", userResponse.StatusCode);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "An error occurred when getting user from Typicode.");
            }
            
            return null;
        }
    }
}
