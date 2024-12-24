namespace backend.Models
{
    public class FlightPurchase
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int FlightId { get; set; }
        public Flight Flight { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int SeatsReserved { get; set; }
        public decimal TotalPrice { get; set; }

    }
}
