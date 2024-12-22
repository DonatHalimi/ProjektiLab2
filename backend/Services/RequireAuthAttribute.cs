namespace backend.Services
{
    using Microsoft.AspNetCore.Mvc;

    public class RequireAuthAttribute : TypeFilterAttribute
    {
        public RequireAuthAttribute() : base(typeof(RequireAuthFilter))
        {
        }
    }
}