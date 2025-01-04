using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Fetch JWT settings from environment variables
        private readonly string _jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
        private readonly string _jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
        private readonly string _jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
        private readonly string _jwtExpiresInMinutes = Environment.GetEnvironmentVariable("JWT_EXPIRES_IN_MINUTES");

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest registerRequest)
        {
            if (_context.Users.Any(u => u.Email == registerRequest.Email))
            {
                return BadRequest(new { message = "Email already registered" });
            }

            var userRole = _context.Roles.FirstOrDefault(r => r.Name == "user");
            if (userRole == null)
            {
                return StatusCode(500, new { message = "Default user role not found in the system" });
            }

            var user = new User
            {
                FirstName = registerRequest.FirstName,
                LastName = registerRequest.LastName,
                Email = registerRequest.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password),
                RoleId = userRole.Id
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
            if (string.IsNullOrEmpty(_jwtKey) || string.IsNullOrEmpty(_jwtIssuer) || string.IsNullOrEmpty(_jwtAudience) || string.IsNullOrEmpty(_jwtExpiresInMinutes))
            {
                throw new Exception("JWT configuration is missing from environment variables.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var role = user.RoleId == 2 ? "admin" : "user";

            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, role),
                new Claim("RoleId", user.RoleId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                _jwtIssuer,
                _jwtAudience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(_jwtExpiresInMinutes)),
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

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _jwtIssuer,
                    ValidAudience = _jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey))
                };

                var claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                System.Diagnostics.Debug.WriteLine($"Extracted email after validation: {email}");

                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new { message = "Email not found in token" });
                }

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