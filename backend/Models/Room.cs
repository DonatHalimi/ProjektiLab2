namespace backend.Models
{
    public class Room
    {
        public int Id { get; set; }
        public int HotelID { get; set; }
        public string RoomType { get; set; }
        public int Capacity { get; set; }
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual Hotel Hotel { get; set; }

        // Collection of room images
        public virtual ICollection<RoomImage> Images { get; set; } = new List<RoomImage>();
    }

    public class RoomImage
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string Url { get; set; }

        public virtual Room Room { get; set; }
    }
}