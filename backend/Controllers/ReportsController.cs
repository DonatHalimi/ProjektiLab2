using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Reports/Generate
        [HttpPost("Generate")]
        public async Task<ActionResult<IEnumerable<FlightPurchase>>> GenerateReport([FromBody] ReportCriteria criteria)
        {
            var query = _context.FlightPurchases
                .Include(fp => fp.Flight)
                .Include(fp => fp.User)
                .AsQueryable();

            if (criteria.StartDate.HasValue)
            {
                query = query.Where(fp => fp.Flight.StartDate >= criteria.StartDate.Value);
            }

            if (criteria.EndDate.HasValue)
            {
                query = query.Where(fp => fp.Flight.EndDate <= criteria.EndDate.Value);
            }

            if (!string.IsNullOrEmpty(criteria.UserEmail))
            {
                query = query.Where(fp => fp.User.Email == criteria.UserEmail);
            }

            if (!string.IsNullOrEmpty(criteria.FlightName))
            {
                query = query.Where(fp => fp.Flight.Name == criteria.FlightName);
            }

            if (!string.IsNullOrEmpty(criteria.SortBy))
            {
                query = query.OrderBy(criteria.SortBy);
            }

            var result = await query.ToListAsync();

            return Ok(result);
        }
    }

    public class ReportCriteria
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string UserEmail { get; set; }
        public string FlightName { get; set; }
        public string SortBy { get; set; }
    }
}