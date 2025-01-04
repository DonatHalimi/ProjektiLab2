using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourPurchaseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TourPurchaseController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TourPurchases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourPurchase>>> GetTourPurchases()
        {
            return await _context.TourPurchases
                .Include(tp => tp.Tour)
                .Include(tp => tp.User)
                .ToListAsync();
        }

        // GET: api/TourPurchases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TourPurchase>> GetTourPurchase(int id)
        {
            var tourPurchase = await _context.TourPurchases
                .Include(tp => tp.Tour)
                .Include(tp => tp.User)
                .FirstOrDefaultAsync(tp => tp.Id == id);

            if (tourPurchase == null)
            {
                return NotFound();
            }

            return tourPurchase;
        }

        // GET: api/TourPurchases/my/5
        [HttpGet("my/{id}")]
        public async Task<ActionResult<List<TourPurchase>>> GetMyTourPurchases(int id)
        {
            var tourPurchases = await _context.TourPurchases
                .Include(tp => tp.Tour)
                .Include(tp => tp.User)
                .Where(tp => tp.UserId == id)
                .ToListAsync();

            if (tourPurchases == null || !tourPurchases.Any())
            {
                return NotFound();
            }

            return Ok(tourPurchases);
        }

        // POST: api/TourPurchases
        [HttpPost]
        public async Task<ActionResult<TourPurchase>> CreateTourPurchase(TourPurchaseDTO tourPurchaseDTO)
        {
            if (tourPurchaseDTO.ReservedTickets > 8 || tourPurchaseDTO.ReservedTickets < 1)
            {
                return BadRequest("Cannot reserve more than 8 tickets or less than 1.");
            }

            var tour = await _context.Tours.FindAsync(tourPurchaseDTO.TourId);
            if (tour == null)
            {
                return NotFound("Tour not found.");
            }

            if (tour.StartDate < DateTime.Now)
            {
                return BadRequest("Cannot reserve a tour in the past.");
            }

            if (tour.ReservedTickets + tourPurchaseDTO.ReservedTickets > tour.Capacity)
            {
                return BadRequest("Not enough available seats.");
            }

            var tourPurchase = new TourPurchase
            {
                UserId = tourPurchaseDTO.UserId,
                TourId = tourPurchaseDTO.TourId,
                ReservedTickets = tourPurchaseDTO.ReservedTickets,
                PurchaseDate = DateTime.Now,
                TotalPrice = tourPurchaseDTO.ReservedTickets * tour.Price
            };

            tour.ReservedTickets += tourPurchaseDTO.ReservedTickets;

            _context.TourPurchases.Add(tourPurchase);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTourPurchase", new { id = tourPurchase.Id }, tourPurchase);
        }

        // PUT: api/TourPurchases/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTourPurchase(int id, TourPurchaseDTO tourPurchaseDTO)
        {
            if (id != tourPurchaseDTO.Id)
            {
                return BadRequest("Tour Purchase ID mismatch.");
            }

            var existingTourPurchase = await _context.TourPurchases.FindAsync(id);
            if (existingTourPurchase == null)
            {
                return NotFound("Tour Purchase not found.");
            }

            var tour = await _context.Tours.FindAsync(tourPurchaseDTO.TourId);
            if (tour == null)
            {
                return NotFound("Tour not found.");
            }

            if (tour.StartDate < DateTime.Now)
            {
                return BadRequest("Cannot reserve a tour in the past.");
            }

            if (tour.ReservedTickets - existingTourPurchase.ReservedTickets + tourPurchaseDTO.ReservedTickets > tour.Capacity)
            {
                return BadRequest("Not enough available seats.");
            }

            // Update reserved tickets in the tour
            tour.ReservedTickets = tour.ReservedTickets - existingTourPurchase.ReservedTickets + tourPurchaseDTO.ReservedTickets;

            // Update the existing tour purchase
            existingTourPurchase.TourId = tourPurchaseDTO.TourId;
            existingTourPurchase.ReservedTickets = tourPurchaseDTO.ReservedTickets;
            existingTourPurchase.TotalPrice = tourPurchaseDTO.ReservedTickets * tour.Price;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourPurchaseExists(id))
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

        // DELETE: api/TourPurchases/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTourPurchase(int id)
        {
            var tourPurchase = await _context.TourPurchases.FindAsync(id);
            if (tourPurchase == null)
            {
                return NotFound();
            }

            var tour = await _context.Tours.FindAsync(tourPurchase.TourId);
            if (tour != null)
            {
                tour.ReservedTickets -= tourPurchase.ReservedTickets;
            }

            _context.TourPurchases.Remove(tourPurchase);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TourPurchaseExists(int id)
        {
            return _context.TourPurchases.Any(e => e.Id == id);
        }

        // DELETE: /api/TourPurchases/delete-bulk
        [HttpDelete("delete-bulk")]
        public async Task<IActionResult> DeleteTourPurchasesBulk([FromBody] BulkDeleteRequest request)
        {
            if (request?.Ids == null || !request.Ids.Any())
            {
                return BadRequest(new { success = false, message = "No IDs provided for deletion" });
            }

            var itemsToDelete = await _context.TourPurchases.Where(r => request.Ids.Contains(r.Id)).ToListAsync();

            if (!itemsToDelete.Any())
            {
                return NotFound(new { success = false, message = "No tour purchases found for the provided IDs" });
            }

            _context.TourPurchases.RemoveRange(itemsToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Tour purchases deleted successfully" });
        }
    }
}
