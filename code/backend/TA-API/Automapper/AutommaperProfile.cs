using AutoMapper;
using TA_API.Entities.EntityModels;
using TA_API.Entities.ResponseDataContracts.Typicode;
using TA_API.Entities.ResponseModels;

namespace TA_API.Automapper
{
    public class AutomapperProfile : Profile
    {
        public AutomapperProfile()
        {
            CreateMap<TypicodeUserModel, UserVM>();
            CreateMap<TaskItem, TaskItemVM>();
        }
    }
}
