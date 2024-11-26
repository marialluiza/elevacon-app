import { Link } from "react-router-dom";
import { useAuth } from "../../infra/context/AuthProvider";
import MediaCard from "./Card/Card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../infra/hooks/useAPI";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { Card, CardContent, Typography, Box } from "@mui/material";

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

  const growthData = {
    labels: ["1 mês", "6 meses", "1 ano"],
    datasets: [
      {
        label: "Crescimento de clientes",
        data: [20, 120, 250], // Dados estáticos para o exemplo
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };

  const documentosData = {
    labels: ["Janeiro", "Fevereiro", "Março"], // Exemplo de meses
    datasets: [
      {
        label: "Documentos Enviados",
        data: [30, 50, 70], // Dados fictícios
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Documentos Recebidos",
        data: [40, 60, 90], // Dados fictícios
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const performanceData = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      {
        label: "Performance Mensal",
        data: [65, 80, 90, 75],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <div className="flex-grow p-4">
        <h2 className="text-xl font-bold">Atualizações</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 align-middle">

          <MediaCard
            title="Documentos Recebidos"
            shareText="Solicitar"
            learnMoreText="Visualizar todos"
            badgeContent={documentosRecebidos ?? 0}
            shareRoute="/SolicitarDocumento"
            learnMoreRoute="/ListaDocumento"
            isShareDisabled={true}
          />
          <MediaCard
            title="Documentos Enviados"
            shareText="Enviar"
            learnMoreText="Visualizar todos"
            badgeContent={documentosEnviados ?? "-"}
            shareRoute="/EnviarDocumento"
            learnMoreRoute="/ListaDocumentosEnviados"
          />
          <MediaCard
            title="Tipos de Documentos"
            shareText="Criar novo"
            learnMoreText="Visualizar todos"
            // badgeContent={documentosEnviados ?? "-"}
            shareRoute="/ListarTiposDocumentos"
            learnMoreRoute="/ListarTiposDocumentos"
          />

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

        <div>
        </div>
      </div>
      {
        userRole == "CONTADOR" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ml-5">
            <Card sx={{ maxWidth: 400 }}>
              <CardContent>
                <Typography component="div">Crescimento de Clientes</Typography>
                <Box sx={{ height: "180px", marginTop: 2 }}>
                  <Line data={growthData} />
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ maxWidth: 400 }}>
              <CardContent>
                <Typography component="div">Documentos Enviados e Recebidos</Typography>
                <Box sx={{ height: "180px", marginTop: 2 }}>
                  <Bar data={documentosData} />
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ maxWidth: 400 }}>
              <CardContent>
                <Typography component="div">Performance Mensal</Typography>
                <Box sx={{ height: "180px", marginTop: 2 }}>
                  <Bar data={performanceData} />
                </Box>
              </CardContent>
            </Card>
          </div>
        )
      }
    </div>
  );
};

export default PaginaInicial;
