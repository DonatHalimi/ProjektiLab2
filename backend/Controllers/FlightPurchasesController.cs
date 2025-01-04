using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightPurchasesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FlightPurchasesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/FlightPurchases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FlightPurchase>>> GetFlightPurchases()
        {
            return await _context.FlightPurchases
                .Include(fp => fp.Flight)
                .Include(fp => fp.User)
                .ToListAsync();
        }

        // GET: api/FlightPurchases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FlightPurchase>> GetFlightPurchase(int id)
        {
            var flightPurchase = await _context.FlightPurchases
                .Include(fp => fp.Flight)
                .Include(fp => fp.User)
                .FirstOrDefaultAsync(fp => fp.Id == id);

            if (flightPurchase == null)
            {
                return NotFound();
            }

            return flightPurchase;
        }

        // GET: api/FlightPurchases/my/5
        [HttpGet("my/{id}")]
        public async Task<ActionResult<List<FlightPurchase>>> GetMyFlightPurchases(int id)
        {
            var flightPurchases = await _context.FlightPurchases
                .Include(fp => fp.Flight)
                .Include(fp => fp.User)
                .Where(fp => fp.User.Id == id) 
                .ToListAsync();

            if (flightPurchases == null || !flightPurchases.Any())  
            {
                return NotFound();
            }

            return Ok(flightPurchases);  
        }

        // POST: api/FlightPurchases
        [HttpPost]
        public async Task<ActionResult<FlightPurchase>> CreateFlightPurchase(FlightPurchaseDTO flightPurchaseDTO)
        {
            if (flightPurchaseDTO.SeatsReserved > 8 || flightPurchaseDTO.SeatsReserved < 1)
            {
                return BadRequest("Cannot reserve more than 8 seats or less than 1.");
            }

            var flight = await _context.Flights.FindAsync(flightPurchaseDTO.FlightId);

            if (flight == null)
            {
                return NotFound("Flight not found.");
            }

            if (flight.StartDate < DateTime.Now)
            {
                return BadRequest("Cannot reserve a flight in the past.");
            }

            if (flight.ReservedSeats + flightPurchaseDTO.SeatsReserved > flight.Capacity)
            {
                return BadRequest("Not enough available seats.");
            }

            var flightPurchase = new FlightPurchase
            {
                UserId = flightPurchaseDTO.UserId,
                FlightId = flightPurchaseDTO.FlightId,
                SeatsReserved = flightPurchaseDTO.SeatsReserved,
                PurchaseDate = DateTime.Now,
                TotalPrice = flightPurchaseDTO.SeatsReserved * flight.Price
            };

            flight.ReservedSeats += flightPurchaseDTO.SeatsReserved;
            _context.FlightPurchases.Add(flightPurchase);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFlightPurchase", new { id = flightPurchase.Id }, flightPurchase);
        }

        // PUT: api/FlightPurchases/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlightPurchase(int id, FlightPurchaseDTO flightPurchaseDTO)
        {
            if (id != flightPurchaseDTO.Id)
            {
                return BadRequest("Flight Purchase ID mismatch.");
            }

            var existingFlightPurchase = await _context.FlightPurchases.FindAsync(id);
            if (existingFlightPurchase == null)
            {
                return NotFound("Flight Purchase not found.");
            }

            var flight = await _context.Flights.FindAsync(flightPurchaseDTO.FlightId);
            if (flight == null)
            {
                return NotFound("Flight not found.");
            }

            if (flight.StartDate < DateTime.Now)
            {
                return BadRequest("Cannot reserve a flight in the past.");
            }

            if (flight.ReservedSeats - existingFlightPurchase.SeatsReserved + flightPurchaseDTO.SeatsReserved > flight.Capacity)
            {
                return BadRequest("Not enough available seats.");
            }

            flight.ReservedSeats = flight.ReservedSeats - existingFlightPurchase.SeatsReserved + flightPurchaseDTO.SeatsReserved;

            existingFlightPurchase.FlightId = flightPurchaseDTO.FlightId;
            existingFlightPurchase.SeatsReserved = flightPurchaseDTO.SeatsReserved;
            existingFlightPurchase.TotalPrice = flightPurchaseDTO.SeatsReserved * flight.Price;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightPurchaseExists(id))
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

        // DELETE: api/FlightPurchases/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlightPurchase(int id)
        {
            var flightPurchase = await _context.FlightPurchases.FindAsync(id);
            if (flightPurchase == null)
            {
                return NotFound();
            }

            var flight = await _context.Flights.FindAsync(flightPurchase.FlightId);
            if (flight != null)
            {
                flight.ReservedSeats -= flightPurchase.SeatsReserved;
            }

            _context.FlightPurchases.Remove(flightPurchase);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FlightPurchaseExists(int id)
        {
            return _context.FlightPurchases.Any(e => e.Id == id);
        }

        // DELETE: /api/FlightPurchases/delete-bulk
        [HttpDelete("delete-bulk")]
        public async Task<IActionResult> DeleteFlightPurchasesBulk([FromBody] BulkDeleteRequest request)
        {
            if (request?.Ids == null || !request.Ids.Any())
            {
                return BadRequest(new { success = false, message = "No IDs provided for deletion" });
            }

            var itemsToDelete = await _context.FlightPurchases.Where(r => request.Ids.Contains(r.Id)).ToListAsync();

            if (!itemsToDelete.Any())
            {
                return NotFound(new { success = false, message = "No roles found for the provided IDs" });
            }

            _context.FlightPurchases.RemoveRange(itemsToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Roles deleted successfully" });
        }
    }
}
