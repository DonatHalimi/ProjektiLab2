using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class RequireAuthFilter : IActionFilter
{
    private readonly IAuthChecker _authChecker;

    public RequireAuthFilter(IAuthChecker authChecker)
    {
        _authChecker = authChecker;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!_authChecker.IsAuthenticated(context.HttpContext.Request))
        {
            context.Result = new UnauthorizedObjectResult(new
            {
                success = false,
                message = "You must be logged in to perform this action"
            });
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}