namespace backend.Services
{
    using Microsoft.AspNetCore.Mvc;

    public class RequireAdminAttribute : TypeFilterAttribute
    {
        public RequireAdminAttribute() : base(typeof(RequireAdminFilter))
        {
        }
    }
}