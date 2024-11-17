export type IDocumento = {
  id: number;
  nome: string;
  dataEnvio: string;
  enviadoPor: string;
  tipoDocumento: string;
  recebidoPor: string;
  totalDocumentosEnviados: number;
  loading: boolean;
};
