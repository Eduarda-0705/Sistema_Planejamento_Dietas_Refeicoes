import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5123',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos
  withCredentials: false, // Importante para CORS
});

// Interceptor para log de requisições
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Enviando:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erro ao configurar requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros global
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ Erro da API:', {
        status: error.response.status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('❌ Sem resposta da API:', error.request);
    } else {
      console.error('❌ Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
