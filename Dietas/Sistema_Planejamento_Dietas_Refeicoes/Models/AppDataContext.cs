using Microsoft.EntityFrameworkCore;

namespace Sistema_Planejamento_Dietas_Refeicoes.Models
{
    public class AppDataContext : DbContext
    {
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Refeicao> Refeicoes { get; set; }
        public DbSet<Alimento> Alimentos { get; set; }
        public DbSet<RefeicaoAlimento> RefeicaoAlimentos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=Sistema_Planejamento_Dietas_Refeicoes.db");
        }

        //Adicionamos o método OnModelCreating para configurar o relacionamento
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RefeicaoAlimento>()
                .HasKey(ra => new { ra.RefeicaoId, ra.AlimentoId });

            modelBuilder.Entity<RefeicaoAlimento>()
                .HasOne(ra => ra.Refeicao)
                .WithMany(r => r.RefeicaoAlimentos)
                .HasForeignKey(ra => ra.RefeicaoId);

            modelBuilder.Entity<RefeicaoAlimento>()
                .HasOne(ra => ra.Alimento)
                .WithMany(a => a.RefeicaoAlimentos)
                .HasForeignKey(ra => ra.AlimentoId);
        }
    }
}