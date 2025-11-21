using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sistema_Planejamento_Dietas_Refeicoes.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Refeicoes_Usuarios_usuarioId",
                table: "Refeicoes");

            migrationBuilder.RenameColumn(
                name: "nome",
                table: "Usuarios",
                newName: "Nome");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Usuarios",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Usuarios",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "usuarioId",
                table: "Refeicoes",
                newName: "UsuarioId");

            migrationBuilder.RenameColumn(
                name: "nome",
                table: "Refeicoes",
                newName: "Nome");

            migrationBuilder.RenameColumn(
                name: "descricao",
                table: "Refeicoes",
                newName: "Descricao");

            migrationBuilder.RenameColumn(
                name: "dataRefeicao",
                table: "Refeicoes",
                newName: "DataRefeicao");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Refeicoes",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Refeicoes_usuarioId",
                table: "Refeicoes",
                newName: "IX_Refeicoes_UsuarioId");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataCadastro",
                table: "Usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_Refeicoes_Usuarios_UsuarioId",
                table: "Refeicoes",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Refeicoes_Usuarios_UsuarioId",
                table: "Refeicoes");

            migrationBuilder.DropColumn(
                name: "DataCadastro",
                table: "Usuarios");

            migrationBuilder.RenameColumn(
                name: "Nome",
                table: "Usuarios",
                newName: "nome");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Usuarios",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Usuarios",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UsuarioId",
                table: "Refeicoes",
                newName: "usuarioId");

            migrationBuilder.RenameColumn(
                name: "Nome",
                table: "Refeicoes",
                newName: "nome");

            migrationBuilder.RenameColumn(
                name: "Descricao",
                table: "Refeicoes",
                newName: "descricao");

            migrationBuilder.RenameColumn(
                name: "DataRefeicao",
                table: "Refeicoes",
                newName: "dataRefeicao");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Refeicoes",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "IX_Refeicoes_UsuarioId",
                table: "Refeicoes",
                newName: "IX_Refeicoes_usuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Refeicoes_Usuarios_usuarioId",
                table: "Refeicoes",
                column: "usuarioId",
                principalTable: "Usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
