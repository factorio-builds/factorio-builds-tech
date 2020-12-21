using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FactorioTech.Core.Data.Migrations
{
    public partial class NormalizedSlugs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_Blueprints_OwnerId_Slug",
                table: "Blueprints");

            migrationBuilder.AddColumn<string>(
                name: "NormalizedOwnerSlug",
                table: "Blueprints",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NormalizedSlug",
                table: "Blueprints",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Blueprints_OwnerId_NormalizedSlug",
                table: "Blueprints",
                columns: new[] { "OwnerId", "NormalizedSlug" });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "RoleId",
                keyValue: new Guid("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                column: "ConcurrencyStamp",
                value: "810c72f6-082c-45b6-ac7e-562c943cc8de");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_Blueprints_OwnerId_NormalizedSlug",
                table: "Blueprints");

            migrationBuilder.DropColumn(
                name: "NormalizedOwnerSlug",
                table: "Blueprints");

            migrationBuilder.DropColumn(
                name: "NormalizedSlug",
                table: "Blueprints");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Blueprints_OwnerId_Slug",
                table: "Blueprints",
                columns: new[] { "OwnerId", "Slug" });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "RoleId",
                keyValue: new Guid("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                column: "ConcurrencyStamp",
                value: "5f6c3b71-8c57-410d-99f2-755d1ccac3d7");
        }
    }
}
