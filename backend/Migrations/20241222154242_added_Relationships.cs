using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class added_Relationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
               name: "UserId",
               table: "FlightPurchases",
               type: "int",
               nullable: false,
               defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FlightId",
                table: "FlightPurchases",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_FlightPurchases_UserId",
                table: "FlightPurchases",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FlightPurchases_FlightId",
                table: "FlightPurchases",
                column: "FlightId");

            migrationBuilder.AddForeignKey(
                name: "FK_FlightPurchases_Users_UserId",
                table: "FlightPurchases",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FlightPurchases_Flights_FlightId",
                table: "FlightPurchases",
                column: "FlightId",
                principalTable: "Flights",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
               name: "FK_FlightPurchases_Users_UserId",
               table: "FlightPurchases");

            migrationBuilder.DropForeignKey(
                name: "FK_FlightPurchases_Flights_FlightId",
                table: "FlightPurchases");

            migrationBuilder.DropIndex(
                name: "IX_FlightPurchases_UserId",
                table: "FlightPurchases");

            migrationBuilder.DropIndex(
                name: "IX_FlightPurchases_FlightId",
                table: "FlightPurchases");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "FlightPurchases");

            migrationBuilder.DropColumn(
                name: "FlightId",
                table: "FlightPurchases");

        }
    }
}
