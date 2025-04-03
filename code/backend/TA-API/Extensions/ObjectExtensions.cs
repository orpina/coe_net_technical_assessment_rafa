namespace TA_API.Extensions
{
    public static class ObjectExtensions
    {
        public static bool ContainsProperty(this object objectType, string propertyName)
        {
            if (objectType is null || string.IsNullOrWhiteSpace(propertyName))
                return false;

            var propertyNames = objectType.GetType().GetProperties()?.Select(c => c.Name?.ToLower());

            return propertyNames?.Contains(propertyName) ?? false;
        }

    }
}
