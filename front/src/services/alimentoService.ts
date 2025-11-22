import axios from "axios";
import Alimento from "../types/Alimento";

const API_URL = "http://localhost:5123/alimentos";


const alimentoService = {
  listar: async (): Promise<Alimento[]> => {
    const response = await axios.get<Alimento[]>(API_URL);
    return response.data;
  },

  buscarPorId: async (id: number): Promise<Alimento> => {
    const response = await axios.get<Alimento>(`${API_URL}/${id}`);
    return response.data;
  },
};
export default alimentoService;
