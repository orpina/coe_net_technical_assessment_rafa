using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using TA_API.Services.Data;

namespace TA_API.Repository
{
    public class GenericRepository<T>(AssessmentDbContext context) : IGenericRepository<T> where T : class
    {
        protected readonly AssessmentDbContext _context = context;

        public T GetById(int id)
        {
            return _context.Set<T>().Find(id)!;
        }
        public virtual IQueryable<T> GetAll()
        {
            return _context.Set<T>().AsNoTracking();
        }
        public virtual void Add(T entity)
        {
            EntityEntry<T> dbEntityEntry = _context.Entry(entity);

            if (dbEntityEntry.State != EntityState.Detached)
            {
                dbEntityEntry.State = EntityState.Added;
            }
            else
            {
                _context.Set<T>().Add(entity);
            }
        }
        public virtual void Update(T entity)
        {
            EntityEntry<T> dbEntityEntry = _context.Entry(entity);
            if (dbEntityEntry.State == EntityState.Detached)
            {
                _context.Set<T>().Attach(entity);
            }

            dbEntityEntry.State = EntityState.Modified;
        }
        public virtual void Delete(int id)
        {
            T entity = GetById(id);
            if (entity != null)
            {
                Delete(entity);
            }
        }
        public virtual void Delete(T entity)
        {
            EntityEntry<T> dbEntityEntry = _context.Entry(entity);

            if (dbEntityEntry.State != EntityState.Deleted)
            {
                dbEntityEntry.State = EntityState.Deleted;
            }
            else
            {
                _context.Set<T>().Attach(entity);
                _context.Set<T>().Remove(entity);
            }
        }
        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }
    }
}
