using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TourReportsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/TourReports/Generate
        [HttpPost("Generate")]
        public async Task<ActionResult<IEnumerable<TourPurchase>>> GenerateReport([FromBody] TourReportCriteria criteria)
        {
            var query = _context.TourPurchases
                .Include(tp => tp.Tour)
                .Include(tp => tp.User)
                .AsQueryable();

            if (criteria.StartDate.HasValue)
            {
                query = query.Where(tp => tp.Tour.StartDate >= criteria.StartDate.Value);
            }

            if (criteria.EndDate.HasValue)
            {
                query = query.Where(tp => tp.Tour.EndDate <= criteria.EndDate.Value);
            }

            if (!string.IsNullOrEmpty(criteria.UserEmail))
            {
                query = query.Where(tp => tp.User.Email == criteria.UserEmail);
            }

            if (!string.IsNullOrEmpty(criteria.TourName))
            {
                query = query.Where(tp => tp.Tour.Name == criteria.TourName);
            }

            if (!string.IsNullOrEmpty(criteria.SortBy))
            {
                query = query.OrderBy(criteria.SortBy);
            }

            var result = await query.ToListAsync();

            return Ok(result);
        }
    }

    public class TourReportCriteria
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string UserEmail { get; set; }
        public string TourName { get; set; }
        public string SortBy { get; set; }
    }
}