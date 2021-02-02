using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FactorioTech.Core.Data.Migrations
{
    public partial class CoverMeta : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CoverMeta_Format",
                table: "Blueprints",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CoverMeta_Height",
                table: "Blueprints",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "CoverMeta_Size",
                table: "Blueprints",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "CoverMeta_Width",
                table: "Blueprints",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                column: "ConcurrencyStamp",
                value: "56eedf55-9512-44fe-a7ec-31a9e4541769");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("52a39ea9-ab54-40ab-8ee0-98c069504f69"),
                column: "ConcurrencyStamp",
                value: "997a64fb-5bc9-453c-91e2-ac5ac1b14b2d");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverMeta_Format",
                table: "Blueprints");

            migrationBuilder.DropColumn(
                name: "CoverMeta_Height",
                table: "Blueprints");

            migrationBuilder.DropColumn(
                name: "CoverMeta_Size",
                table: "Blueprints");

            migrationBuilder.DropColumn(
                name: "CoverMeta_Width",
                table: "Blueprints");

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
    }
}
