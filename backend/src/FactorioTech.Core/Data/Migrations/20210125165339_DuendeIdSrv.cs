using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

namespace FactorioTech.Core.Data.Migrations
{
    public partial class DuendeIdSrv : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeviceFlowCodes",
                schema: "identity");

            migrationBuilder.DropTable(
                name: "PersistedGrants",
                schema: "identity");

            migrationBuilder.AlterColumn<Instant>(
                name: "CreatedAt",
                table: "Favorites",
                type: "timestamp",
                nullable: false,
                oldClrType: typeof(Instant),
                oldType: "timestamp",
                oldDefaultValueSql: "timezone('utc', now())");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("3d15ca3a-584e-4d30-94df-b43d2303a4f4"),
                column: "ConcurrencyStamp",
                value: "578cbfc3-f70a-482c-b484-3f21265459ea");

            migrationBuilder.UpdateData(
                schema: "identity",
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("52a39ea9-ab54-40ab-8ee0-98c069504f69"),
                column: "ConcurrencyStamp",
                value: "21343f97-0f36-4fea-9280-0763730d0eca");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Instant>(
                name: "CreatedAt",
                table: "Favorites",
                type: "timestamp",
                nullable: false,
                defaultValueSql: "timezone('utc', now())",
                oldClrType: typeof(Instant),
                oldType: "timestamp");

            migrationBuilder.CreateTable(
                name: "DeviceFlowCodes",
                schema: "identity",
                columns: table => new
                {
                    UserCode = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ClientId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Data = table.Column<string>(type: "character varying(50000)", maxLength: 50000, nullable: false),
                    Description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    DeviceCode = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Expiration = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    SessionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SubjectId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceFlowCodes", x => x.UserCode);
                });

            migrationBuilder.CreateTable(
                name: "PersistedGrants",
                schema: "identity",
                columns: table => new
                {
                    Key = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ClientId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ConsumedTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Data = table.Column<string>(type: "character varying(50000)", maxLength: 50000, nullable: false),
                    Description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Expiration = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    SessionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SubjectId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersistedGrants", x => x.Key);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_DeviceFlowCodes_DeviceCode",
                schema: "identity",
                table: "DeviceFlowCodes",
                column: "DeviceCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DeviceFlowCodes_Expiration",
                schema: "identity",
                table: "DeviceFlowCodes",
                column: "Expiration");

            migrationBuilder.CreateIndex(
                name: "IX_PersistedGrants_Expiration",
                schema: "identity",
                table: "PersistedGrants",
                column: "Expiration");

            migrationBuilder.CreateIndex(
                name: "IX_PersistedGrants_SubjectId_ClientId_Type",
                schema: "identity",
                table: "PersistedGrants",
                columns: new[] { "SubjectId", "ClientId", "Type" });

            migrationBuilder.CreateIndex(
                name: "IX_PersistedGrants_SubjectId_SessionId_Type",
                schema: "identity",
                table: "PersistedGrants",
                columns: new[] { "SubjectId", "SessionId", "Type" });
        }
    }
}
