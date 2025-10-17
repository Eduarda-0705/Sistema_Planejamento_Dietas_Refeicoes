using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sistema_Planejamento_Dietas_Refeicoes.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCalculatedFieldsFromRefeicao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "calorias",
                table: "Refeicoes");

            migrationBuilder.DropColumn(
                name: "carboidratos",
                table: "Refeicoes");

            migrationBuilder.DropColumn(
                name: "gorduras",
                table: "Refeicoes");

            migrationBuilder.DropColumn(
                name: "proteinas",
                table: "Refeicoes");

            migrationBuilder.AlterColumn<string>(
                name: "nome",
                table: "Usuarios",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "Usuarios",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Objetivo",
                table: "Usuarios",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "nome",
                table: "Usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "Usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Objetivo",
                table: "Usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "calorias",
                table: "Refeicoes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "carboidratos",
                table: "Refeicoes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "gorduras",
                table: "Refeicoes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "proteinas",
                table: "Refeicoes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
