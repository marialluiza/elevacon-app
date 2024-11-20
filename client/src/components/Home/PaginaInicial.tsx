import { Link } from "react-router-dom";
import { useAuth } from "../../infra/context/AuthProvider";
import MediaCard from "./Card/Card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../infra/hooks/useAPI";

export const PaginaInicial = () => {
  const { token, userRole } = useAuth();
  const [documentosEnviados, setDocumentosEnviados] = useState<number | null>(
    null
  );
  const [documentosRecebidos, setDocumentosRecebidos] = useState<number | null>(
    null
  );
  const [totalDocumentos, setTotalDocumentos] = useState<number | null>(null);

  useEffect(() => {
    const fetchDocumentCounts = async () => {
      try {
        const enviadosResponse = await api.get("/documentos/enviados", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocumentosEnviados(enviadosResponse.data.length);

        const recebidosResponse = await api.get("/documentos/recebidos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocumentosRecebidos(recebidosResponse.data.length);

        setTotalDocumentos(
          enviadosResponse.data.length + recebidosResponse.data.length
        );
      } catch (error) {
        console.error("Erro ao buscar dados de documentos:", error);
        toast.error("Erro ao buscar os dados de documentos.");
      }
    };

    if (token) {
      fetchDocumentCounts();
    }
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-4">
        <h2 className="text-xl font-bold">Atualizações</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <MediaCard
            title="Documentos Recebidos"
            shareText="Solicitar"
            learnMoreText="Visualizar todos"
            badgeContent={documentosRecebidos ?? 0}
            shareRoute="/SolicitarDocumento"
            learnMoreRoute="/ListaDocumento"
          />
          <MediaCard
            title="Documentos Enviados"
            shareText="Enviar"
            learnMoreText="Visualizar todos"
            badgeContent={documentosEnviados ?? "-"}
            shareRoute="/EnviarDocumento"
            learnMoreRoute="/ListaDocumentosEnviados"
          />
          {/* <MediaCard
            title="Todos os Documentos"
            shareText="Criar novo tipo"
            learnMoreText="Visualizar todos"
            badgeContent={totalDocumentos ?? "-"}
          /> */}
        </div>
        <h2 className="text-xl font-bold mt-8">Acessar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {userRole === "CONTADOR" && (
            <Link
              to="/ListaCliente"
              className="bg-gray-300 p-4 rounded-lg text-center hover:bg-gray-300 transition-colors duration-300"
            >
              Clientes
            </Link>
          )}

          {userRole === "CLIENTE" && (
            <>
              <Link
                to="/VisualizarClienteCliente"
                className="bg-gray-300 p-4 rounded-lg text-center hover:bg-gray-300 transition-colors duration-300"
              >
                Informações pessoais
              </Link>
            </>
          )}

          <Link
            to="/ListaDocumento"
            className="bg-gray-300 p-4 rounded-lg text-center hover:bg-gray-300 transition-colors duration-300"
          >
            Documentos
          </Link>
        </div>
      </div>
      <div className="p-4"></div>
    </div>
  );
};

export default PaginaInicial;
