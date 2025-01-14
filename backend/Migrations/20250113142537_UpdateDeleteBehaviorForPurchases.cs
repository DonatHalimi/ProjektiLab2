using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDeleteBehaviorForPurchases : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FlightPurchases_Flights_FlightId",
                table: "FlightPurchases");

            migrationBuilder.DropForeignKey(
                name: "FK_TourPurchases_Tours_TourId",
                table: "TourPurchases");

            migrationBuilder.AddForeignKey(
                name: "FK_FlightPurchases_Flights_FlightId",
                table: "FlightPurchases",
                column: "FlightId",
                principalTable: "Flights",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TourPurchases_Tours_TourId",
                table: "TourPurchases",
                column: "TourId",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FlightPurchases_Flights_FlightId",
                table: "FlightPurchases");

            migrationBuilder.DropForeignKey(
                name: "FK_TourPurchases_Tours_TourId",
                table: "TourPurchases");

            migrationBuilder.AddForeignKey(
                name: "FK_FlightPurchases_Flights_FlightId",
                table: "FlightPurchases",
                column: "FlightId",
                principalTable: "Flights",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TourPurchases_Tours_TourId",
                table: "TourPurchases",
                column: "TourId",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
