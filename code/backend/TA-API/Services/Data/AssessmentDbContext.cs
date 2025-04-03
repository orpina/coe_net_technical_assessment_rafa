using Microsoft.EntityFrameworkCore;
using TA_API.Entities.EntityModels;

namespace TA_API.Services.Data
{
    public class AssessmentDbContext(IConfiguration config, DbContextOptions options) : DbContext(options)
    {
        private readonly IConfiguration _config = config;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_config.GetConnectionString("DbConnection"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.ToTable("TaskItems");
                entity.HasKey(t => t.Id);
                entity.Property(c => c.Id).ValueGeneratedOnAdd();

                entity.Property(c => c.Title).HasMaxLength(250).IsRequired();
                entity.Property(c => c.Description).HasMaxLength(500).IsRequired(false);
                entity.Property(c => c.AssignedUserId).IsRequired(false);
                entity.Property(c => c.IsCompleted).IsRequired(true);
            });
        }
    }
}
