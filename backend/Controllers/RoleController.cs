using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuthChecker _authChecker;

        public RoleController(AppDbContext context, IAuthChecker adminChecker)
        {
            _context = context;
            _authChecker = adminChecker;
        }

        // GET: /api/roles/get
        [HttpGet("get")]
        public async Task<IActionResult> GetRoles()
        {
            if (!_authChecker.IsAdmin(Request))
            {
                return Unauthorized(new { success = false, message = "Only admins can perform this action" });
            }

            var roles = await _context.Roles.ToListAsync();
            return Ok(new { success = true, message = "Roles fetched successfully", data = roles });
        }

        // GET: /api/roles/get/{id}
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetRole(int id)
        {
            if (!_authChecker.IsAdmin(Request)) // If you wanted to allow normal users to get a role by id => _authChecker.IsAuthenticated(Request)
            {
                return Unauthorized(new { success = false, message = "You must be logged in to perform this action" });
            }

            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound(new { success = false, message = $"Role with ID {id} not found" });
            }

            return Ok(new { success = true, message = "Role fetched successfully", data = role });
        }

        // POST: /api/roles/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateRole(Role role)
        {
            if (!_authChecker.IsAdmin(Request))
            {
                return Unauthorized(new { success = false, message = "Only admins can perform this action" });
            }

            if (role == null || string.IsNullOrWhiteSpace(role.Name))
            {
                return BadRequest(new { success = false, message = "Invalid role data" });
            }

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, new { success = true, message = "Role created successfully", data = role });
        }

        // PUT: /api/roles/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateRole(int id, Role role)
        {
            if (!_authChecker.IsAdmin(Request))
            {
                return Unauthorized(new { success = false, message = "Only admins can perform this action" });
            }

            if (id != role.Id)
            {
                return BadRequest(new { success = false, message = "ID mismatch" });
            }

            if (string.IsNullOrWhiteSpace(role.Name))
            {
                return BadRequest(new { success = false, message = "Role name cannot be empty" });
            }

            _context.Entry(role).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
                {
                    return NotFound(new { success = false, message = $"Role with ID {id} not found" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { success = true, message = "Role updated successfully" });
        }

        // DELETE: /api/roles/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            if (!_authChecker.IsAdmin(Request))
            {
                return Unauthorized(new { success = false, message = "Only admins can perform this action" });
            }

            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound(new { success = false, message = $"Role with ID {id} not found" });
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Role deleted successfully" });
        }

        private bool RoleExists(int id)
        {
            return _context.Roles.Any(e => e.Id == id);
        }
    }
}