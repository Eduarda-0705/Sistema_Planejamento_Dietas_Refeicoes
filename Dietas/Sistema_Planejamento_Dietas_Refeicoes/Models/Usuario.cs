using System;
using System.Text.Json.Serialization;

namespace Sistema_Planejamento_Dietas_Refeicoes.Models;

public class Usuario
{
public int Id { get; set; }
public string? Nome { get; set; }
public string? Email { get; set; }
public double Altura { get; set; }
public double Peso { get; set; }
public string? Objetivo { get; set; }

public DateTime DataCadastro { get; set; } = DateTime.Now;

[JsonIgnore]    
public List<Refeicao> Refeicoes { get; set; } = new List<Refeicao>();
}

