using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomPurchaseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomPurchaseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomPurchase>>> GetRoomPurchases()
        {
            return await _context.RoomPurchases
                .Include(rp => rp.Room)
                 .ThenInclude(r => r.Hotel)
                .Include(rp => rp.User)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoomPurchase>> GetRoomPurchase(int id)
        {
            var roomPurchase = await _context.RoomPurchases
                .Include(rp => rp.Room)
                .Include(rp => rp.User)
                .FirstOrDefaultAsync(rp => rp.Id == id);

            if (roomPurchase == null)
            {
                return NotFound();
            }

            return roomPurchase;
        }
      

        [HttpPost]
        public async Task<ActionResult<RoomPurchase>> CreateRoomPurchase(RoomPurchaseDTO roomPurchaseDTO)
        {
          
            if (roomPurchaseDTO.StartDate < DateTime.Now.Date)

            {
                return BadRequest("The check-in date cannot be in the past.");
            }

           
            var room = await _context.Rooms.FindAsync(roomPurchaseDTO.RoomId);
            if (room == null)
            {
                return NotFound("Room not found.");
            }

        
            var conflictingReservation = await _context.RoomPurchases
                .Where(rp => rp.RoomId == roomPurchaseDTO.RoomId)
                .AnyAsync(rp => rp.StartDate < roomPurchaseDTO.EndDate && rp.EndDate > roomPurchaseDTO.StartDate);

            if (conflictingReservation)
            {
                return BadRequest("The room is already reserved for the selected dates.");
            }

            
            var stayDuration = (roomPurchaseDTO.EndDate - roomPurchaseDTO.StartDate).TotalDays;
            if (stayDuration <= 0)
            {
                return BadRequest("End date must be later than start date.");
            }

         
            var totalPrice = room.Price * (decimal)stayDuration;

        
            var roomPurchase = new RoomPurchase
            {
                UserId = roomPurchaseDTO.UserId,
                RoomId = roomPurchaseDTO.RoomId,
                StartDate = roomPurchaseDTO.StartDate,
                EndDate = roomPurchaseDTO.EndDate,
                Guests = roomPurchaseDTO.Guests,
                TotalPrice = totalPrice,
                Status = "Confirmed"
            };

        
            _context.RoomPurchases.Add(roomPurchase);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoomPurchase", new { id = roomPurchase.Id }, roomPurchase);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomPurchase(int id, RoomPurchaseDTO roomPurchaseDTO)
        {
            if (id != roomPurchaseDTO.Id)
            {
                return BadRequest("Room Purchase ID mismatch.");
            }

            var existingRoomPurchase = await _context.RoomPurchases
                .Include(rp => rp.Room) 
                .FirstOrDefaultAsync(rp => rp.Id == id);

            if (existingRoomPurchase == null)
            {
                return NotFound("Room Purchase not found.");
            }

            
            var room = await _context.Rooms.FindAsync(roomPurchaseDTO.RoomId);
            if (room == null)
            {
                return NotFound("Selected room not found.");
            }

        
            var stayDuration = (roomPurchaseDTO.EndDate - roomPurchaseDTO.StartDate).TotalDays;
            if (stayDuration <= 0)
            {
                return BadRequest("End date must be later than start date.");
            }

       
            var totalPrice = room.Price * (decimal)stayDuration;

            existingRoomPurchase.RoomId = roomPurchaseDTO.RoomId;
            existingRoomPurchase.StartDate = roomPurchaseDTO.StartDate;
            existingRoomPurchase.EndDate = roomPurchaseDTO.EndDate;
            existingRoomPurchase.Guests = roomPurchaseDTO.Guests;
            existingRoomPurchase.TotalPrice = totalPrice;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.RoomPurchases.Any(rp => rp.Id == id))
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


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomPurchase(int id)
        {
            var roomPurchase = await _context.RoomPurchases.FindAsync(id);
            if (roomPurchase == null)
            {
                return NotFound();
            }

            _context.RoomPurchases.Remove(roomPurchase);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // DELETE: /api/RoomPurchases/delete-bulk
        [HttpDelete("delete-bulk")]
        public async Task<IActionResult> DeleteRoomPurchasesBulk([FromBody] BulkDeleteRequest request)
        {
            if (request?.Ids == null || !request.Ids.Any())
            {
                return BadRequest(new { success = false, message = "No IDs provided for deletion" });
            }

            var itemsToDelete = await _context.RoomPurchases.Where(r => request.Ids.Contains(r.Id)).ToListAsync();

            if (!itemsToDelete.Any())
            {
                return NotFound(new { success = false, message = "No room purchases found for the provided IDs" });
            }

            _context.RoomPurchases.RemoveRange(itemsToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Room purchases deleted successfully" });
        }


    }
}