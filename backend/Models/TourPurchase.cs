namespace backend.Models
{
    public class TourPurchase
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int TourId { get; set; }
        public Tour Tour { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int ReservedTickets { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
