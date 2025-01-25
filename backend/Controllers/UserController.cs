using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        private readonly string _jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
        private readonly string _jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
        private readonly string _jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
        private readonly string _jwtExpiresInMinutes = Environment.GetEnvironmentVariable("JWT_EXPIRES_IN_MINUTES");

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/users/get
        [HttpGet("get")]
        [RequireAdmin]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.Include(u => u.Role).ToListAsync();
            return Ok(new { success = true, message = "Users fetched successfully", data = users });
        }

        // GET: /api/users/get/{id}
        [HttpGet("get/{id}")]
        [RequireAdmin]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { success = false, message = $"User with ID {id} not found" });
            }

            return Ok(new { success = true, message = "User fetched successfully", data = user });
        }

        // POST: /api/users/create
        [HttpPost("create")]
        [RequireAdmin]
        public async Task<IActionResult> CreateUser(User user)
        {
            if (user == null || string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new { success = false, message = "Invalid user data" });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return Conflict(new { success = false, message = "User with this email already exists" });
            }

            // Ensure the user has a valid role
            var role = await _context.Roles.FindAsync(user.RoleId);
            if (role == null)
            {
                return BadRequest(new { success = false, message = "Invalid role ID" });
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new { success = true, message = "User created successfully", data = user });
        }

        // PUT: /api/users/update/{id}
        [HttpPut("update/{id}")]
        [RequireAdmin]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest(new { success = false, message = "ID mismatch" });
            }

            if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new { success = false, message = "User email or password cannot be empty" });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email && u.Id != id);
            if (existingUser != null)
            {
                return Conflict(new { success = false, message = "User with this email already exists" });
            }

            var role = await _context.Roles.FindAsync(user.RoleId);
            if (role == null)
            {
                return BadRequest(new { success = false, message = "Invalid role ID" });
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound(new { success = false, message = $"User with ID {id} not found" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { success = true, message = "User updated successfully" });
        }

        // PUT: /api/users/update-info/{id}
        [HttpPut("update-info/{id}")]
        [RequireAuth]
        public async Task<IActionResult> UpdateUserInfo(int id, UpdateUserInfoRequest request)
        {
            if (id <= 0 || request == null)
            {
                return BadRequest(new { success = false, message = "Invalid request" });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { success = false, message = $"User with ID {id} not found" });
            }

            // Validate CurrentPassword if it's provided
            if (!string.IsNullOrWhiteSpace(request.CurrentPassword))
            {
                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password))
                {
                    return Unauthorized(new { success = false, message = "Invalid current password" });
                }
            }

            // Make sure CurrentPassword is required if NewPassword is provided
            if (!string.IsNullOrWhiteSpace(request.NewPassword) && string.IsNullOrWhiteSpace(request.CurrentPassword))
            {
                return BadRequest(new { success = false, message = "Current password is required to update the password" });
            }

            // If CurrentPassword is invalid when NewPassword is provided, deny the request
            if (!string.IsNullOrWhiteSpace(request.NewPassword) && !BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password))
            {
                return Unauthorized(new { success = false, message = "Invalid current password" });
            }

            // Update fields if provided
            if (!string.IsNullOrWhiteSpace(request.FirstName))
            {
                user.FirstName = request.FirstName;
            }

            if (!string.IsNullOrWhiteSpace(request.LastName))
            {
                user.LastName = request.LastName;
            }

            bool emailUpdated = false;
            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id);
                if (emailExists)
                {
                    return Conflict(new { success = false, message = "Email already in use" });
                }
                user.Email = request.Email;
                emailUpdated = true;
            }

            if (!string.IsNullOrWhiteSpace(request.NewPassword))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound(new { success = false, message = $"User with ID {id} not found" });
                }
                else
                {
                    throw;
                }
            }

            // Generate a new access token if the email is updated
            if (emailUpdated)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_jwtKey);

                if (!int.TryParse(_jwtExpiresInMinutes, out var expiresInMinutes))
                {
                    expiresInMinutes = 60;
                }

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                new Claim("sub", user.Email),
                new Claim("id", user.Id.ToString()),
                new Claim("role", user.Role?.Name ?? "user")
            }),
                    Expires = DateTime.UtcNow.AddMinutes(expiresInMinutes),
                    Issuer = _jwtIssuer,
                    Audience = _jwtAudience,
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var newToken = tokenHandler.WriteToken(token);

                return Ok(new { success = true, message = "User information updated successfully", token = newToken });
            }

            return Ok(new { success = true, message = "User information updated successfully" });
        }

        // DELETE: /api/users/delete/{id}
        [RequireAdmin]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { success = false, message = $"User with ID {id} not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "User deleted successfully" });
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        // DELETE: /api/users/delete-bulk
        [HttpDelete("delete-bulk")]
        [RequireAdmin]
        public async Task<IActionResult> DeleteUsersBulk([FromBody] BulkDeleteRequest request)
        {
            if (request?.Ids == null || !request.Ids.Any())
            {
                return BadRequest(new { success = false, message = "No IDs provided for deletion" });
            }

            var itemsToDelete = await _context.Users.Where(r => request.Ids.Contains(r.Id)).ToListAsync();

            if (!itemsToDelete.Any())
            {
                return NotFound(new { success = false, message = "No users found for the provided IDs" });
            }

            _context.Users.RemoveRange(itemsToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Users deleted successfully" });
        }
    }
}