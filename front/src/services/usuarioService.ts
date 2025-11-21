import api from '../config/api';
import { Usuario } from '../types/Usuario';

const usuarioService = {
  // Listar todos os usuários — GET /usuarios
  listar: async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  // Buscar usuário por ID — GET /usuarios/{id}
  buscarPorId: async (id: number): Promise<Usuario> => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  // Criar novo usuário — POST /usuarios
  criar: async (usuario: Usuario): Promise<Usuario> => {
    const response = await api.post<Usuario>('/usuarios', usuario);
    return response.data;
  },

  // Atualizar usuário — PUT /usuarios/{id}
  atualizar: async (id: number, usuario: Usuario): Promise<Usuario> => {
    const response = await api.put<Usuario>(`/usuarios/${id}`, usuario);
    return response.data;
  },

  // Deletar usuário — DELETE /usuarios/{id}
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};

export default usuarioService;
