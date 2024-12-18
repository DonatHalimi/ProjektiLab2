using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest registerRequest)
        {
            if (_context.Users.Any(u => u.Email == registerRequest.Email))
            {
                return BadRequest(new { message = "Email already registered" });
            }

            var user = new User
            {
                FirstName = registerRequest.FirstName,
                LastName = registerRequest.LastName,
                Email = registerRequest.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password),
                RoleId = 4 // change to fit the 'user' role
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            var existingUser = _context.Users.SingleOrDefault(u => u.Email == loginRequest.Email);
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, existingUser.Password))
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = GenerateJwtToken(existingUser);
            return Ok(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.Role?.Name ?? "user"),
                new Claim("RoleId", user.RoleId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:ExpiresInMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("me")]
        public IActionResult GetUserDetails()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "No token provided" });
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                System.Diagnostics.Debug.WriteLine($"Received token: {token}");

                var jwtToken = tokenHandler.ReadJwtToken(token);

                System.Diagnostics.Debug.WriteLine("=== Token Claims ===");
                foreach (var claim in jwtToken.Claims)
                {
                    System.Diagnostics.Debug.WriteLine($"Type: {claim.Type}, Value: {claim.Value}");
                }
                System.Diagnostics.Debug.WriteLine("==================");

                // Validate token
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

                var claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                // Extract email using the exact claim type we know exists
                var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                System.Diagnostics.Debug.WriteLine($"Extracted email after validation: {email}");

                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new { message = "Email not found in token" });
                }

                // Query and log the user search
                var user = _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefault(u => u.Email == email);

                if (user == null)
                {
                    var allUsers = _context.Users.Select(u => u.Email).ToList();
                    System.Diagnostics.Debug.WriteLine($"All emails in database: {string.Join(", ", allUsers)}");
                    return NotFound(new { message = "User not found in database" });
                }

                return Ok(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    Role = user.Role?.Name ?? "user"
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = $"Token validation failed: {ex.Message}" });
            }
        }
    }
}