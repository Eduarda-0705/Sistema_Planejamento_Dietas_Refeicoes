using System;

using Microsoft.EntityFrameworkCore;

namespace Sistema_Planejamento_Dietas_Refeicoes.Models;

public class AppDataContext : DbContext
{
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Refeicao> Refeicoes { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=Sistema_Planejamento_Dietas_Refeicoes.db");
    }
}
