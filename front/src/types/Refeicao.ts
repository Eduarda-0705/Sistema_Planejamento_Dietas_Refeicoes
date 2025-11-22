import Alimento from "./Alimento";
import { Usuario } from "./Usuario";

export interface RefeicaoAlimento {
  alimentoId: number;
  quantidade: number; // g ou ml
  alimento?: Alimento; // Opcional, usado apenas para exibir o nome na tela
}

export interface Refeicao {
  id?: number;
  usuarioId: number;
  nome: string;
  descricao?: string;
  dataRefeicao: string; // ISO string (YYYY-MM-DDTHH:mm)
  refeicaoAlimentos: RefeicaoAlimento[];
  usuario?: Usuario; // Opcional, para exibição
}