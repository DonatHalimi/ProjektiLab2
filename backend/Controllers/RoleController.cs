using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace backend.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public RoleController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;

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

        [HttpPost("create")]
        public async Task<IActionResult> CreateRole(Role role)
        {
            if (!IsAdmin())
            {
                return Forbid("Only admins can perform this action" );
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

        private bool IsAdmin()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return false;
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

                var claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                var roleClaim = claimsPrincipal.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

                return roleClaim == "admin";
            }
            catch
            {
                return false;
            }
        }


    }
}