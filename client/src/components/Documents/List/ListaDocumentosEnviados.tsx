import { Table } from "@radix-ui/themes";
import { useAuth } from "../../../infra/context/AuthProvider";
import { useEffect, useState } from "react";
import { Download, SearchIcon } from 'lucide-react';
import api from "../../../infra/hooks/useAPI";
import NavBar from "../../Header/Header";
import { toast } from "sonner";
import { IDocumento } from "../../../interfaces/IDocumento";

const ListaDocumentosEnviados: React.FC = () => {
    const { userId, token, loading } = useAuth();
    const [documentos, setDocumentos] = useState<IDocumento[]>([]);

    useEffect(() => {
        const fetchDocumentosEnviados = async () => {
            try {
                const response = await api.get(`/documentos/enviados`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDocumentos(response.data);
            } catch (error) {
                console.error('Erro ao buscar documentos enviados:', error);
                toast.error("Erro ao buscar documentos enviados.");
            }
        };

        if (userId && token) {
            fetchDocumentosEnviados();
        }
    }, [userId, token]);

    const formatarData = (data: string | undefined) => {
        if (!data) return 'N/A';

        const dataObj = new Date(data);
        const dia = dataObj.getDate().toString().padStart(2, '0');
        const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
        const ano = dataObj.getFullYear();

        return `${dia}/${mes}/${ano}`;
    };

    const handleDownload = async (documentoId: number) => {
        try {
            const response = await api.get(`/documentos/download/${documentoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `documento_${documentoId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro ao baixar o documento:", error);
            toast.error("Não foi possível baixar o documento.");
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6">Documentos Enviados</h2>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4 w-1/2">
                            <input
                                type="text"
                                placeholder="Pesquisar documento..."
                                className="w-1/2 px-3 py-2 border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                            />
                            <div className="p-2 cursor-pointer border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300">
                                <SearchIcon className="cursor-pointer text-blue-800" />
                            </div>
                        </div>
                        <div className="flex gap-10">
                            <a href="/EnviarDocumento">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                                    Enviar documento
                                </button>
                            </a>
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-[70vh]">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Data de Envio</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Enviado para</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Tipo de Documento</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {documentos.map((documento) => (
                                    <Table.Row key={documento.id}>
                                        <Table.Cell>{documento.nome ? documento.nome : 'N/A'}</Table.Cell>
                                        <Table.Cell>{formatarData(documento.dataEnvio)}</Table.Cell>
                                        <Table.Cell>{documento.recebidoPor ? documento.recebidoPor : 'N/A'}</Table.Cell>
                                        <Table.Cell>{documento.tipoDocumento ? documento.tipoDocumento : 'N/A'}</Table.Cell>
                                        <Table.Cell className="flex justify-center">
                                            <button
                                                onClick={() => handleDownload(documento.id)}
                                            >
                                                <Download className="text-blue-500" />
                                            </button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListaDocumentosEnviados;
