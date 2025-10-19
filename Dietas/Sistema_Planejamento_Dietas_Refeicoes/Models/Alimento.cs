using System;
using System.Text.Json.Serialization;

namespace Sistema_Planejamento_Dietas_Refeicoes.Models;

public class Alimento
{
    public int Id { get; set; }
    public string? Nome { get; set; }
    public string? Tipo { get; set; } 
    public string? Unidade { get; set; }
    public double CaloriasPorPorcao { get; set; }

    [JsonIgnore]
    public List<RefeicaoAlimento> RefeicaoAlimentos { get; set; } = new List<RefeicaoAlimento>();
}
