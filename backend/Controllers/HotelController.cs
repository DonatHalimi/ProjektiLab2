

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using System.IO;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Text;


namespace backend.Controllers
{
    [Route("api/hotels")]
    [ApiController]
    public class HotelController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HotelController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/hotels/get
        [HttpGet("get")]
        public async Task<IActionResult> GetHotels()
        {
            var hotels = await _context.Hotels.ToListAsync();

            var response = hotels.Select(hotel => new
            {
                hotel.HotelID,
                hotel.Name,
                hotel.Location,
                hotel.Capacity,
                hotel.Amenities,
                hotel.RoomTypes,
                Image = hotel.Image != null ? Convert.ToBase64String(hotel.Image) : null, 
                hotel.CreatedAt,
                hotel.UpdatedAt
            });

            return Ok(new { success = true, message = "Hotels fetched successfully", data = response });
        }


        // GET: /api/hotels/get/{id}
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetHotels(int id)
        {
            var hotel = await _context.Hotels.FindAsync(id);

            if (hotel == null)
            {
                return NotFound(new { success = false, message = $"Hotel with ID {id} not found" });
            }

            return Ok(new { success = true, message = "Hotel fetched successfully", data = hotel });
        }




        // POST: /api/hotels/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateHotel([FromForm] HotelCreateRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Location))
            {
                return BadRequest(new { success = false, message = "Invalid hotel data" });
            }

            var hotel = new Hotel
            {
                Name = request.Name,
                Location = request.Location,
                Capacity = request.Capacity,
                Amenities = request.Amenities,
                RoomTypes = request.RoomTypes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

         
            if (request.Image != null)
            {
                using var memoryStream = new MemoryStream();
                await request.Image.CopyToAsync(memoryStream);
                hotel.Image = memoryStream.ToArray();
            }

            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHotels), new { id = hotel.HotelID }, new { success = true, message = "Hotel created successfully", data = hotel });
        }


        // PUT: /api/hotels/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateHotel(int id, [FromForm] HotelCreateRequest request)
        {
            if (id != request.HotelID)
            {
                return BadRequest(new { success = false, message = "ID mismatch" });
            }

            var existingHotel = await _context.Hotels.FirstOrDefaultAsync(h => h.HotelID == id);
            if (existingHotel == null)
            {
                return NotFound(new { success = false, message = $"Hotel with ID {id} not found" });
            }

 
            existingHotel.Name = request.Name;
            existingHotel.Location = request.Location;
            existingHotel.Amenities = request.Amenities;
            existingHotel.RoomTypes = request.RoomTypes;
            existingHotel.Capacity = request.Capacity;

            if (request.Image != null)
            {
                using var memoryStream = new MemoryStream();
                await request.Image.CopyToAsync(memoryStream);
                existingHotel.Image = memoryStream.ToArray(); 
            }

            existingHotel.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound(new { success = false, message = $"Hotel with ID {id} not found" });
            }

            return Ok(new { success = true, message = "Hotel updated successfully" });
        }




        // DELETE: /api/hotels/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteHotel(int id) 
        {
            var hotel = await _context.Hotels.FindAsync(id);
            if (hotel == null)
            {
                return NotFound(new { success = false, message = $"Hotel with ID {id} not found" });
            }

            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Hotel deleted successfully" });
        }
    }
}
