namespace backend.Services
{
    public interface IAdminChecker
    {
        bool IsAdmin(HttpRequest request);
    }
}
