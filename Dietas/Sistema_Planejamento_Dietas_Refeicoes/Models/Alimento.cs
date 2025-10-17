using System;

namespace Sistema_Planejamento_Dietas_Refeicoes.Models;

public class Alimento
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Tipo { get; set; } 
    public string Unidade { get; set; }
    public double CaloriasPorPorcao { get; set; }
}
