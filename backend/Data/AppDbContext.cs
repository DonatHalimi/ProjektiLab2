using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        public DbSet<Flight> Flights { get; set; }

        public DbSet<FlightPurchase> FlightPurchases { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<FlightPurchase>()
                .HasOne(fp => fp.User)
                .WithMany(u => u.FlightPurchases)
                .HasForeignKey(fp => fp.UserId);

            modelBuilder.Entity<FlightPurchase>()
                .HasOne(fp => fp.Flight)
                .WithMany(f => f.FlightPurchases)
                .HasForeignKey(fp => fp.FlightId);
        }
    }
}