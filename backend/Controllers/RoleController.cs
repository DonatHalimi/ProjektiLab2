using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/roles")]
    [ApiController]
    [RequireAdmin]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoleController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/roles/get
        [HttpGet("get")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _context.Roles.ToListAsync();
            return Ok(new { success = true, message = "Roles fetched successfully", data = roles });
        }

        // GET: /api/roles/get/{id}
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetRole(int id)
        {
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

        // DELETE: /api/roles/delete-bulk
        [HttpDelete("delete-bulk")]
        public async Task<IActionResult> DeleteRolesBulk([FromBody] BulkDeleteRequest request)
        {
            if (request?.Ids == null || !request.Ids.Any())
            {
                return BadRequest(new { success = false, message = "No IDs provided for deletion" });
            }

            var itemsToDelete = await _context.Roles.Where(r => request.Ids.Contains(r.Id)).ToListAsync();

            if (!itemsToDelete.Any())
            {
                return NotFound(new { success = false, message = "No roles found for the provided IDs" });
            }

            _context.Roles.RemoveRange(itemsToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Roles deleted successfully" });
        }
    }
}