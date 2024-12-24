namespace backend.Models
{
    public class Flight
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string DepartureCity { get; set; }
        public string ArrivalCity { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public int ReservedSeats { get; set; }

        public ICollection<FlightPurchase>? FlightPurchases { get; set; }
    }
}
