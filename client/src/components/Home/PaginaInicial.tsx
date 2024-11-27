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

interface DocumentosData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export const PaginaInicial = () => {
  const { token, userRole } = useAuth();
  const [documentosEnviados, setDocumentosEnviados] = useState<number>(0);
  const [documentosRecebidos, setDocumentosRecebidos] = useState<number>(0);
  const [documentosData, setDocumentosData] = useState<DocumentosData>({
    labels: [], // Pode ser adaptado para exibir os meses reais
    datasets: [
      {
        label: "Documentos Enviados",
        data: [0, 0, 0], // Dados iniciais fictícios
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Documentos Recebidos",
        data: [0, 0, 0], // Dados iniciais fictícios
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  });

  const getLastThreeMonths = () => {
    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Calculando os três meses anteriores, incluindo o atual
    const labels = [
      months[(now.getMonth() - 2 + 12) % 12], // Subtrai 2, ajustando para dois meses atrás
      months[(now.getMonth() - 1 + 12) % 12], // Subtrai 1, ajustando para o mês anterior
      months[now.getMonth()],
    ];

    return labels;
  };

  useEffect(() => {
    const fetchDocumentCounts = async () => {
      try {
        const enviadosResponse = await api.get("/documentos/enviados", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const recebidosResponse = await api.get("/documentos/recebidos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const enviados = enviadosResponse.data.length;
        const recebidos = recebidosResponse.data.length;

        // Atualiza os estados dos documentos
        setDocumentosEnviados(enviados);
        setDocumentosRecebidos(recebidos);

        // Atualiza os dados para o gráfico
        setDocumentosData((prevData) => ({
          ...prevData,
          labels: getLastThreeMonths(),
          datasets: [
            {
              ...prevData.datasets[0],
              data: [
                ...prevData.datasets[0].data.slice(1), // Remove o valor mais antigo (no início)
                enviados, // Adiciona o novo valor no final
              ],
            },
            {
              ...prevData.datasets[1],
              data: [
                ...prevData.datasets[1].data.slice(1), // Remove o valor mais antigo (no início)
                recebidos, // Adiciona o novo valor no final
              ],
            },
          ],
        }));
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
