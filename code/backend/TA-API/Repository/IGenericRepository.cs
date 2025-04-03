namespace TA_API.Repository
{
    public interface IGenericRepository<T> where T : class
    {
        T GetById(int id);
        IQueryable<T> GetAll();
        void Update(T entity);
        void Add(T entity);
        void Delete(int id);
        Task<bool> SaveChangesAsync();
    }
}
