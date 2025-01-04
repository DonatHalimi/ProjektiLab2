using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FlightsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Flights
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flight>>> GetFlights()
        {
            return await _context.Flights.ToListAsync();
        }

        // GET: api/Flights/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Flight>> GetFlight(int id)
        {
            var flight = await _context.Flights.FindAsync(id);

            if (flight == null)
            {
                return NotFound();
            }

            return flight;
        }

        // PUT: api/Flights/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlight(int id, Flight flight)
        {
            if (id != flight.Id)
            {
                return BadRequest("Flight ID mismatch.");
            }

            var existingFlight = await _context.Flights.FindAsync(id);
            if (existingFlight == null)
            {
                return NotFound("Flight not found.");
            }

            existingFlight.Name = flight.Name;
            existingFlight.DepartureCity = flight.DepartureCity;
            existingFlight.ArrivalCity = flight.ArrivalCity;
            existingFlight.StartDate = flight.StartDate;
            existingFlight.EndDate = flight.EndDate;
            existingFlight.Price = flight.Price;
            existingFlight.Capacity = flight.Capacity;
            existingFlight.ReservedSeats = flight.ReservedSeats;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightExists(id))
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

        // POST: api/Flights
        [HttpPost]
        public async Task<ActionResult<Flight>> CreateFlight(Flight flight)
        {

            if (flight == null)
            {
                return NotFound("Flight not found.");
            }

            if (flight.StartDate < DateTime.Now)
            {
                return BadRequest("Cannot reserve a flight in the past.");
            }


            if (flight.EndDate < flight.StartDate)
            {
                return BadRequest("End Date is Earlier then StartDate!");
            }


            _context.Flights.Add(flight);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFlight", new { id = flight.Id }, flight);
        }

        // DELETE: api/Flights/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
            {
                return NotFound();
            }

            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FlightExists(int id)
        {
            return _context.Flights.Any(e => e.Id == id);
        }

        // DELETE: /api/Flights/delete-bulk
        [HttpDelete("delete-bulk")]
        public async Task<IActionResult> DeleteFlightsBulk([FromBody] BulkDeleteRequest request)
        {
            if (request?.Ids == null || !request.Ids.Any())
            {
                return BadRequest(new { success = false, message = "No IDs provided for deletion" });
            }

            var itemsToDelete = await _context.Flights.Where(r => request.Ids.Contains(r.Id)).ToListAsync();

            if (!itemsToDelete.Any())
            {
                return NotFound(new { success = false, message = "No flights found for the provided IDs" });
            }

            _context.Flights.RemoveRange(itemsToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Flights deleted successfully" });
        }
    }
}
