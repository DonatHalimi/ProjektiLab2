using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomReportsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/RoomReports/Generate
        [HttpPost("Generate")]
        public async Task<ActionResult<IEnumerable<RoomPurchase>>> GenerateReport([FromBody] RoomReportCriteria criteria)
        {
            var query = _context.RoomPurchases
                .Include(rp => rp.Room)
                .Include(rp => rp.User)
                .AsQueryable();

            // Apply filters based on the criteria
            if (criteria.StartDate.HasValue)
            {
                query = query.Where(rp => rp.StartDate >= criteria.StartDate.Value);
            }

            if (criteria.EndDate.HasValue)
            {
                query = query.Where(rp => rp.EndDate <= criteria.EndDate.Value);
            }

            if (!string.IsNullOrEmpty(criteria.UserEmail))
            {
                query = query.Where(rp => rp.User.Email == criteria.UserEmail);
            }

            if (!string.IsNullOrEmpty(criteria.RoomType))
            {
                query = query.Where(rp => rp.Room.RoomType == criteria.RoomType);
            }

            if (!string.IsNullOrEmpty(criteria.Status))
            {
                query = query.Where(rp => rp.Status == criteria.Status);
            }

            if (criteria.MinPrice.HasValue)
            {
                query = query.Where(rp => rp.TotalPrice >= criteria.MinPrice.Value);
            }

            if (criteria.MaxPrice.HasValue)
            {
                query = query.Where(rp => rp.TotalPrice <= criteria.MaxPrice.Value);
            }

            if (criteria.MinGuests.HasValue)
            {
                query = query.Where(rp => rp.Guests >= criteria.MinGuests.Value);
            }

            if (criteria.MaxGuests.HasValue)
            {
                query = query.Where(rp => rp.Guests <= criteria.MaxGuests.Value);
            }

            if (!string.IsNullOrEmpty(criteria.SortBy))
            {
                query = query.OrderBy(criteria.SortBy);
            }

            // Execute the query and return the results
            var result = await query.ToListAsync();

            return Ok(result);
        }
    }

        public class RoomReportCriteria
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string UserEmail { get; set; }
        public string RoomType { get; set; }
        public string Status { get; set; }
        public string SortBy { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinGuests { get; set; }
        public int? MaxGuests { get; set; }
    }
}