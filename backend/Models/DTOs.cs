using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class UpdateUserInfoRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }

    public class FlightPurchaseDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int FlightId { get; set; }
        public int SeatsReserved { get; set; }
    }

    public class TourPurchaseDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TourId { get; set; }
        public int ReservedTickets { get; set; }
    }

    public class HotelCreateRequest
    {
        public int HotelID { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public int Capacity { get; set; }
        public List<string> Amenities { get; set; } = new List<string>();
        public List<string> RoomTypes { get; set; } = new List<string>();
        public IFormFile Image { get; set; }
    }

    public class RoomCreateRequest
    {
        public int HotelID { get; set; }
        public string RoomType { get; set; }
        public int Capacity { get; set; }
        public decimal Price { get; set; }

        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
    }

    public class RoomUpdateRequest
    {
        public int HotelID { get; set; }
        public string RoomType { get; set; }
        public int Capacity { get; set; }
        public decimal Price { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
    }
    public class RoomPurchaseDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Guests { get; set; }
        public string Status { get; set; }
    }

    public class BulkDeleteRequest
    {
        public List<int> Ids { get; set; }
    }
}