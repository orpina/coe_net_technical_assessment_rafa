using Microsoft.EntityFrameworkCore;

namespace TA_API.Services.Data
{
    public class AssessmentDbContext : DbContext
    {
        public AssessmentDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}
