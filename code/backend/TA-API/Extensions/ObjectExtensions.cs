using System.Reflection;
using TA_API.Entities.RequestModels;

namespace TA_API.Extensions
{
    public static class ObjectExtensions
    {
        /// <summary>
        /// Returns true if T entity contains given property name
        /// </summary>
        /// <typeparam name="T">Entity item to check if property name exists</typeparam>
        /// <typeparam name="K">Sortable query containg sort property name to check</typeparam>
        /// <param name="sortableQuery"></param>
        /// <returns></returns>
        public static bool IsValidSortProperty<T, K>(this K sortableQuery) where K : SortableQuery
        {
            if (sortableQuery is null || string.IsNullOrWhiteSpace(sortableQuery?.SortProperty))
                return false;

            Type type = typeof(T);

            var propertyNames = type.GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly)?
                .Where(p => p.DeclaringType == type)
                .Select(c => c.Name?.ToLower());

            return propertyNames?.Contains(sortableQuery.SortProperty.ToLower()) ?? false;
        }

    }
}
