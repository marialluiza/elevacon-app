import api from 'axios'; // Importa a instância do axios configurada

interface DocumentoDTO {
  nome: string;
  tipo: string;
  clienteId?: number;
  clienteNome?: string;
  contadorId?: number;
  contadorNome?: string;
}

// Função para buscar documentos de um contador
export const getDocumentosPorContador = async (contadorId: number): Promise<DocumentoDTO[]> => {
  const response = await api.get(`/contador/${contadorId}`);
  return response.data;
};

// Função para buscar documentos de um cliente específico de um contador
export const getDocumentosPorContadorECliente = async (contadorId: number, clienteId: number): Promise<DocumentoDTO[]> => {
  const response = await api.get(`/contador/${contadorId}/cliente/${clienteId}`);
  return response.data;
};

// Função para buscar documentos enviados por um cliente
export const getDocumentosPorCliente = async (clienteId: number): Promise<DocumentoDTO[]> => {
  const response = await api.get(`/cliente/${clienteId}`);
  return response.data;
};
