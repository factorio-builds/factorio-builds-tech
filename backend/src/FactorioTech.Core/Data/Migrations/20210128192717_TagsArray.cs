using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FactorioTech.Core.Data.Migrations
{
    public partial class TagsArray : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "Tags",
                table: "Blueprints",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.Sql(@"
                UPDATE ""Blueprints"" b
                SET ""Tags"" = ARRAY(
                    SELECT t.""Value"" FROM ""Tags"" t WHERE t.""BlueprintId"" = b.""BlueprintId"");
            ");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                column: "ConcurrencyStamp",
                value: "8fa9cda7-839c-4b14-a0b5-c83232127c46");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("52a39ea9-ab54-40ab-8ee0-98c069504f69"),
                column: "ConcurrencyStamp",
                value: "0b5b217d-6fb7-43ac-9355-c62c39f9ffd8");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Blueprints");

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    BlueprintId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<string>(type: "character varying(56)", maxLength: 56, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => new { x.BlueprintId, x.Value });
                    table.ForeignKey(
                        name: "FK_Tags_Blueprints_BlueprintId",
                        column: x => x.BlueprintId,
                        principalTable: "Blueprints",
                        principalColumn: "BlueprintId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                column: "ConcurrencyStamp",
                value: "82cd9ad6-a099-4d71-81f0-f24861d63995");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("52a39ea9-ab54-40ab-8ee0-98c069504f69"),
                column: "ConcurrencyStamp",
                value: "fbf88cab-c4d9-4e0c-b194-b36767a5312b");
        }
    }
}
