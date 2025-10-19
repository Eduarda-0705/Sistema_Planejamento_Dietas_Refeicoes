using System;
using System.Text.Json.Serialization;

namespace Sistema_Planejamento_Dietas_Refeicoes.Models;

public class Usuario
{
public int id { get; set; }
public string? nome { get; set; }
public string? email { get; set; }
public double Altura { get; set; }
public double Peso { get; set; }
public string? Objetivo { get; set; }

[JsonIgnore]    
public List<Refeicao> Refeicoes { get; set; } = new List<Refeicao>();
}

