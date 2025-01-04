namespace backend.Models
{
    public class Hotel
    {
        public int Id { get; set; }
        public byte[] Image { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public List<string> Amenities { get; set; }
        public List<string> RoomTypes { get; set; }
        public int Capacity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
    }
}