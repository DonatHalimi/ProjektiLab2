using backend.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthChecker : IAuthChecker
{
    private readonly IConfiguration _config;

    public AuthChecker(IConfiguration config)
    {
        _config = config;
    }

    public bool IsAdmin(HttpRequest request)
    {
        var claimsPrincipal = ValidateToken(request);
        if (claimsPrincipal == null)
        {
            return false;
        }

        var roleClaim = claimsPrincipal.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
        return roleClaim == "admin";
    }

    public bool IsAuthenticated(HttpRequest request)
    {
        return ValidateToken(request) != null;
    }

    private ClaimsPrincipal? ValidateToken(HttpRequest request)
    {
        var authHeader = request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return null;
        }

        var token = authHeader.Substring("Bearer ".Length).Trim();
        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _config["Jwt:Issuer"],
                ValidAudience = _config["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]))
            };

            return tokenHandler.ValidateToken(token, validationParameters, out _);
        }
        catch
        {
            return null;
        }
    }
}