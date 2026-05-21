import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const optimizarCompra = async (requestData) => {
  const response = await api.post('/optimizador/optimizar', requestData);
  return response.data;
};

export const procesarTextoIA = async (textoCrudo) => {
  const response = await api.post('/ingestor/procesar', { textoCrudo });
  return response.data;
};
