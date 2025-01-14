using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TourController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Tour
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tour>>> GetTours()
        {
            return await _context.Tours.ToListAsync();
        }

        // GET: api/Tour/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tour>> GetTour(int id)
        {
            var tour = await _context.Tours.FindAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            return tour;
        }

        // PUT: api/Tour/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTour(int id, Tour tour)
        {
            if (id != tour.Id)
            {
                return BadRequest("Tour ID mismatch.");
            }

            var existingTour = await _context.Tours.FindAsync(id);
            if (existingTour == null)
            {
                return NotFound("Tour not found.");
            }

            // Update properties
            existingTour.Name = tour.Name;
            existingTour.City = tour.City;
            existingTour.StartDate = tour.StartDate;
            existingTour.EndDate = tour.EndDate;
            existingTour.Price = tour.Price;
            existingTour.Capacity = tour.Capacity;
            existingTour.ReservedTickets = tour.ReservedTickets;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Tour
        [HttpPost]
        public async Task<ActionResult<Tour>> CreateTour(Tour tour)
        {
            if (tour == null)
            {
                return BadRequest("Tour data is invalid.");
            }

            if (tour.StartDate < DateTime.Now)
            {
                return BadRequest("Cannot create a tour in the past.");
            }

            if (tour.EndDate < tour.StartDate)
            {
                return BadRequest("End date cannot be earlier than the start date.");
            }

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTour", new { id = tour.Id }, tour);
        }

        // DELETE: api/Tour/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var tour = await _context.Tours.FindAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            _context.Tours.Remove(tour);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TourExists(int id)
        {
            return _context.Tours.Any(e => e.Id == id);
        }

        [HttpDelete("delete-bulk")]
        public async Task<IActionResult> DeleteToursBulk([FromBody] BulkDeleteRequest request)
        {
            try
            {
                if (request?.Ids == null || !request.Ids.Any())
                {
                    return BadRequest(new { success = false, message = "No IDs provided for deletion" });
                }

                var itemsToDelete = await _context.Tours
                    .Where(t => request.Ids.Contains(t.Id))
                    .ToListAsync();

                if (!itemsToDelete.Any())
                {
                    return NotFound(new { success = false, message = "No tours found for the provided IDs" });
                }

                foreach (var tour in itemsToDelete)
                {
                    _context.Tours.Remove(tour);
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Tours deleted successfully" });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx &&
                    sqlEx.Number == 547)
                {
                    return Conflict(new
                    {
                        success = false,
                        message = "Cannot delete tours with existing purchases. Please ensure no related purchases are linked to these tours."
                    });
                }

                Console.Error.WriteLine(ex);
                return StatusCode(500, new { success = false, message = "An error occurred while deleting tours." });
            }
        }
    }
}
