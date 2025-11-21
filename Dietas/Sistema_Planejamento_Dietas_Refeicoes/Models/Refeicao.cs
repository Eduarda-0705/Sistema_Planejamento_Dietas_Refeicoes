using System;

namespace Sistema_Planejamento_Dietas_Refeicoes.Models;

public class Refeicao
{
    public int Id { get; set; }
    public string? Nome { get; set; }
    public string? Descricao { get; set; }
    public DateTime DataRefeicao { get; set; }
    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
    public List<RefeicaoAlimento> RefeicaoAlimentos { get; set; } = new List<RefeicaoAlimento>();
}