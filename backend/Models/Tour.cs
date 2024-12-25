namespace backend.Models
{
    public class Tour
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
       
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public int ReservedTickets { get; set; }
        public ICollection<TourPurchase>? TourPurchases { get; set; }
    }
}
