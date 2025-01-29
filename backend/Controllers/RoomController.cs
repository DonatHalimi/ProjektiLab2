using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.Services;
using System.IO;

namespace backend.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/rooms/get
        [HttpGet("get")]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _context.Rooms
                .Include(r => r.Hotel)
                .Include(r => r.Images)
                .ToListAsync();

            var baseUrl = $"{Request.Scheme}://{Request.Host}/api/";

            var response = rooms.Select(room => new
            {
                room.Id,
                room.HotelID,
                HotelName = room.Hotel.Name,
                HotelLocation = room.Hotel.Location,
                HotelImage = room.Hotel.Image != null ? Convert.ToBase64String(room.Hotel.Image) : null,
                room.RoomType,
                room.Capacity,
                room.Price,
                room.CreatedAt,
                room.UpdatedAt,
                Images = room.Images.Select(image => $"{baseUrl}{image.Url.Replace("\\", "/")}")
            });

            return Ok(new { success = true, message = "Rooms fetched successfully", data = response });
        }


        [HttpGet("uploads/{filename}")]
        public IActionResult GetImage(string filename)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", filename);
            if (System.IO.File.Exists(filePath))
            {
                return PhysicalFile(filePath, "image/png");
            }
            return NotFound();
        }

        // DELETE: /api/rooms/delete-image/{imageName}
        [HttpDelete("delete-image/{imageName}")]
        [RequireAdmin]
        public async Task<IActionResult> DeleteImage(string imageName)
        {
            var image = await _context.RoomImages.FirstOrDefaultAsync(img => img.Url.Contains(imageName));

            if (image == null)
            {
                return NotFound(new { success = false, message = "Image not found" });
            }

            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), image.Url.Replace("Uploads", ""));

            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }

            _context.RoomImages.Remove(image);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Image deleted successfully" });
        }

        // GET: /api/rooms/get/{id}
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Hotel)
                .Include(r => r.Images)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound(new { success = false, message = $"Room with ID {id} not found" });
            }

            return Ok(new
            {
                success = true,
                message = "Room fetched successfully",
                data = new
                {
                    room.Id,
                    room.HotelID,
                    HotelName = room.Hotel.Name,
                    HotelLocation = room.Hotel.Location,
                    room.RoomType,
                    room.Capacity,
                    room.Price,
                    room.CreatedAt,
                    room.UpdatedAt,
                    Images = room.Images.Select(image => image.Url)
                }
            });
        }

        // POST: /api/rooms/create
        [HttpPost("create")]
        [RequireAdmin]
        public async Task<IActionResult> CreateRoom([FromForm] RoomCreateRequest roomRequest)
        {
            if (roomRequest == null || string.IsNullOrWhiteSpace(roomRequest.RoomType))
            {
                return BadRequest(new { success = false, message = "Invalid room data" });
            }

            var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == roomRequest.HotelID);
            if (!hotelExists)
            {
                return NotFound(new { success = false, message = $"Hotel with ID {roomRequest.HotelID} not found" });
            }

            var room = new Room
            {
                HotelID = roomRequest.HotelID,
                RoomType = roomRequest.RoomType,
                Capacity = roomRequest.Capacity,
                Price = roomRequest.Price,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(uploadsDirectory))
            {
                Directory.CreateDirectory(uploadsDirectory);
            }

            if (roomRequest.Images != null && roomRequest.Images.Count > 0)
            {
                foreach (var imageFile in roomRequest.Images)
                {
                    if (imageFile.Length > 0)
                    {
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                        var filePath = Path.Combine(uploadsDirectory, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(stream);
                        }

                        var roomImage = new RoomImage
                        {
                            RoomId = room.Id,
                            Url = Path.Combine("Uploads", fileName)
                        };

                        _context.RoomImages.Add(roomImage);
                    }
                }

                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, new { success = true, message = "Room created successfully", data = room });
        }

        // PUT: /api/rooms/update/{id}
        [HttpPut("update/{id}")]
        [RequireAdmin]
        public async Task<IActionResult> UpdateRoom(int id, [FromForm] RoomUpdateRequest roomRequest)
        {
            if (!RoomExists(id))
            {
                return NotFound(new { success = false, message = $"Room with ID {id} not found" });
            }

            var room = await _context.Rooms.Include(r => r.Images).FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound(new { success = false, message = $"Room with ID {id} not found" });
            }

            room.HotelID = roomRequest.HotelID;
            room.RoomType = roomRequest.RoomType;
            room.Capacity = roomRequest.Capacity;
            room.Price = roomRequest.Price;
            room.UpdatedAt = DateTime.UtcNow;

            if (roomRequest.Images != null && roomRequest.Images.Count > 0)
            {
                var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

                foreach (var imageFile in roomRequest.Images)
                {
                    var imageExists = room.Images.Any(img => Path.GetFileName(img.Url) == imageFile.FileName);
                    if (!imageExists && imageFile.Length > 0)
                    {
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                        var filePath = Path.Combine(uploadsDirectory, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(stream);
                        }

                        var roomImage = new RoomImage
                        {
                            RoomId = room.Id,
                            Url = Path.Combine("Uploads", fileName)
                        };

                        _context.RoomImages.Add(roomImage);
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Room updated successfully" });
        }

        // DELETE: /api/rooms/delete/{id}
        [HttpDelete("delete/{id}")]
        [RequireAdmin]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Images)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound(new { success = false, message = $"Room with ID {id} not found" });
            }

            var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            foreach (var image in room.Images)
            {
                var imagePath = Path.Combine(uploadsDirectory, Path.GetFileName(image.Url));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.RoomImages.RemoveRange(room.Images);

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Room and its images deleted successfully" });
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }

        // DELETE: /api/rooms/delete-bulk
        [HttpDelete("delete-bulk")]
        [RequireAdmin]
        public async Task<IActionResult> DeleteRoomsBulk([FromBody] BulkDeleteRequest request)
        {

            try
            {
                if (request?.Ids == null || !request.Ids.Any())
                {
                    return BadRequest(new { success = false, message = "No IDs provided for deletion" });
                }

                var itemsToDelete = await _context.Rooms
                    .Include(r => r.Images)
                    .Where(r => request.Ids.Contains(r.Id))
                    .ToListAsync();

                if (!itemsToDelete.Any())
                {
                    return NotFound(new { success = false, message = "No rooms found for the provided IDs" });
                }

                var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                foreach (var room in itemsToDelete)
                {
                    foreach (var image in room.Images)
                    {
                        var imagePath = Path.Combine(uploadsDirectory, Path.GetFileName(image.Url));
                        if (System.IO.File.Exists(imagePath))
                        {
                            System.IO.File.Delete(imagePath);
                        }
                    }
                }

                foreach (var room in itemsToDelete)
                {
                    _context.RoomImages.RemoveRange(room.Images);
                    _context.Rooms.Remove(room);
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Rooms and their images deleted successfully" });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx &&
                    sqlEx.Number == 547)
                {
                    return Conflict(new
                    {
                        success = false,
                        message = "Cannot delete rooms with existing purchases. Please ensure no related purchases are linked to these rooms."
                    });
                }

                Console.Error.WriteLine(ex);
                return StatusCode(500, new { success = false, message = "An error occurred while deleting rooms." });
            }
        }
    }
}