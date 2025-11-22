import api from '../config/api';
import { Refeicao } from '../types/Refeicao';

const refeicaoService = {
  // Criar nova refeição
  criar: async (refeicao: Refeicao): Promise<Refeicao> => {
    const response = await api.post<Refeicao>('/refeicoes', refeicao);
    return response.data;
  },

  // Listar refeições de um usuário específico
  listarPorUsuario: async (usuarioId: number): Promise<Refeicao[]> => {
    const response = await api.get<Refeicao[]>(`/usuarios/${usuarioId}/refeicoes`);
    return response.data;
  },

  // Buscar uma refeição específica (caso precise editar/ver detalhes)
  buscarPorId: async (id: number): Promise<Refeicao> => {
    const response = await api.get<Refeicao>(`/refeicoes/${id}`);
    return response.data;
  },

  // Deletar refeição
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/refeicoes/${id}`);
  }
};

export default refeicaoService;