using System;

namespace Sistema_Planejamento_Dietas_Refeicoes.Models;

public class Refeicao
{
    public int id { get; set; }
    public string nome { get; set; }
    public string descricao { get; set; }
    public DateTime dataRefeicao { get; set; }
    public int calorias { get; set; }
    public double proteinas { get; set; }
    public double carboidratos { get; set; }
    public double gorduras { get; set; }
    

    public int usuarioId { get; set; }
    public Usuario usuario { get; set; }
}