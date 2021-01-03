using System;
using System.Collections.Generic;
using FactorioTech.Core.Domain;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FactorioTech.Core.Data.Migrations
{
    public partial class AddIcons : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<IEnumerable<GameIcon>>(
                name: "Icons",
                table: "BlueprintVersions",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<IEnumerable<GameIcon>>(
                name: "Icons",
                table: "Blueprints",
                type: "jsonb",
                nullable: false);

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Icons",
                table: "BlueprintVersions");

            migrationBuilder.DropColumn(
                name: "Icons",
                table: "Blueprints");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                column: "ConcurrencyStamp",
                value: "70327f83-138b-429b-8c13-2b395307a2f8");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("52a39ea9-ab54-40ab-8ee0-98c069504f69"),
                column: "ConcurrencyStamp",
                value: "5439643c-dea3-438a-9c7d-b0c3318b9bc1");
        }
    }
}
