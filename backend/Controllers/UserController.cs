using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuthChecker _adminChecker;

        public UserController(AppDbContext context, IAuthChecker adminChecker)
        {
            _context = context;
            _adminChecker = adminChecker;
        }

        // GET: /api/users/get
        [HttpGet("get")]
        public async Task<IActionResult> GetUsers()
        {
            if (!_adminChecker.IsAdmin(Request))
            {
                return Unauthorized(new { success = false, message = "Only admins can perform this action" });
            }

            var users = await _context.Users.Include(u => u.Role).ToListAsync();
            return Ok(new { success = true, message = "Users fetched successfully", data = users });
        }

        // GET: /api/users/get/{id}
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            if (!_adminChecker.IsAdmin(Request))
            {
                return Unauthorized(new { success = false, message = "Only admins can perform this action" });
            }

            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { success = false, message = $"User with ID {id} not found" });
            }

            return Ok(new { success = true, message = "User fetched successfully", data = user });
        }

        // POST: /api/users/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(User user)
        {
            if (!_adminChecker.IsAdmin(Request))
            {
                return Unauthorized(new { success = false, message = "Only admins can perform this action" });
            }

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
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (!_adminChecker.IsAdmin(Request))
            {
                return Unauthorized(new { success = false, message = "Only admins can perform this action" });
            }

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

        // DELETE: /api/users/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!_adminChecker.IsAdmin(Request))
            {
                return Unauthorized(new { success = false, message = "Only admins can perform this action" });
            }

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
    }
}