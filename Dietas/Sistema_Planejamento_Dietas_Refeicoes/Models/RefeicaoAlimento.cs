namespace Sistema_Planejamento_Dietas_Refeicoes.Models
{
    public class RefeicaoAlimento
    {
        public int RefeicaoId { get; set; }
        public int AlimentoId { get; set; }

        public double Quantidade { get; set; }

        public Refeicao? Refeicao { get; set; }
        public Alimento? Alimento { get; set; }
    }
}