import api from "../config/api";

const relatorioService = {
  // Relatório Diário
  getDiario: async (usuarioId: number, data: string) => {
    const response = await api.get(`/usuarios/${usuarioId}/relatorio/diario`, {
      params: { data }
    });
    return response.data;
  },

  // Relatório Semanal
  getSemanal: async (usuarioId: number, dataFinal: string) => {
    const response = await api.get(`/usuarios/${usuarioId}/relatorio/semanal`, {
      params: { dataFinal }
    });
    return response.data;
  }
};

export default relatorioService;
