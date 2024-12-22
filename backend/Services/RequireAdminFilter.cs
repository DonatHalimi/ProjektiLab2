using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class RequireAdminFilter : IActionFilter
{
    private readonly IAuthChecker _authChecker;

    public RequireAdminFilter(IAuthChecker authChecker)
    {
        _authChecker = authChecker;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!_authChecker.IsAdmin(context.HttpContext.Request))
        {
            context.Result = new UnauthorizedObjectResult(new
            {
                success = false,
                message = "Only admins can perform this action"
            });
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}