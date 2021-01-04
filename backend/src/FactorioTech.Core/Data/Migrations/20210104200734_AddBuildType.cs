using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FactorioTech.Core.Data.Migrations
{
    public partial class AddBuildType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "BlueprintVersions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LatestType",
                table: "Blueprints",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "BlueprintPayloads",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                column: "ConcurrencyStamp",
                value: "f52272c2-81a6-43ee-86aa-a077a227c4a2");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("52a39ea9-ab54-40ab-8ee0-98c069504f69"),
                column: "ConcurrencyStamp",
                value: "09518c7c-fe1b-48e5-9daf-1074a3578d2f");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "BlueprintVersions");

            migrationBuilder.DropColumn(
                name: "LatestType",
                table: "Blueprints");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "BlueprintPayloads");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                column: "ConcurrencyStamp",
                value: "70a41d30-91d3-48ce-9253-f7c770bac4e2");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("52a39ea9-ab54-40ab-8ee0-98c069504f69"),
                column: "ConcurrencyStamp",
                value: "c3d7aeab-5d68-4b66-878f-c199f2433ffa");
        }
    }
}
