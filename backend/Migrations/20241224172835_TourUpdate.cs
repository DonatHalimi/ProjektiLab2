using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class TourUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourPurchases_TourGuides_TourGuideId",
                table: "TourPurchases");

            migrationBuilder.DropTable(
                name: "TourGuides");

            migrationBuilder.RenameColumn(
                name: "TourGuideId",
                table: "TourPurchases",
                newName: "TourId");

            migrationBuilder.RenameIndex(
                name: "IX_TourPurchases_TourGuideId",
                table: "TourPurchases",
                newName: "IX_TourPurchases_TourId");

            migrationBuilder.CreateTable(
                name: "Tours",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    ReservedTickets = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tours", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_TourPurchases_Tours_TourId",
                table: "TourPurchases",
                column: "TourId",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourPurchases_Tours_TourId",
                table: "TourPurchases");

            migrationBuilder.DropTable(
                name: "Tours");

            migrationBuilder.RenameColumn(
                name: "TourId",
                table: "TourPurchases",
                newName: "TourGuideId");

            migrationBuilder.RenameIndex(
                name: "IX_TourPurchases_TourId",
                table: "TourPurchases",
                newName: "IX_TourPurchases_TourGuideId");

            migrationBuilder.CreateTable(
                name: "TourGuides",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ReservedTickets = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourGuides", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_TourPurchases_TourGuides_TourGuideId",
                table: "TourPurchases",
                column: "TourGuideId",
                principalTable: "TourGuides",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
