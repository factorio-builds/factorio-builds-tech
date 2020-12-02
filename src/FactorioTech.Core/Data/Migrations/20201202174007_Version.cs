using Microsoft.EntityFrameworkCore.Migrations;

namespace FactorioTech.Core.Data.Migrations
{
    public partial class Version : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LatestGameVersion",
                table: "Blueprints",
                type: "character varying(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "0.0.0.0");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LatestGameVersion",
                table: "Blueprints");
        }
    }
}
