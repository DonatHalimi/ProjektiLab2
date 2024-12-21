namespace backend.Services
{
    public interface IAuthChecker
    {
        bool IsAdmin(HttpRequest request);
        bool IsAuthenticated(HttpRequest request);
    }
}
