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
            CreateMap<TypicodeUserModel, UserVM>()
                .ForMember(dest => dest.Company, opt => opt.MapFrom(x => x.Company == null ? string.Empty : x.Company.Name));

            CreateMap<TaskItem, TaskItemVM>();
        }
    }
}
