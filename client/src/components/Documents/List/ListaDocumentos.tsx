import { Table } from "@radix-ui/themes";
import { useAuth } from "../../../infra/context/AuthProvider";
import { useEffect, useState } from "react";
import { SearchIcon } from 'lucide-react';
import api from "../../../infra/hooks/useAPI";
import NavBar from "../../Header/Header";

interface Documento {
    id_documento: number;
    nome?: string;
    dataEnvio?: string;
    enviadoPor?: string;
    tipoDocumento?: string;
}

const ListaDocumento: React.FC = () => {
    const { userId, token, loading } = useAuth();
    const [documentos, setDocumentos] = useState<Documento[]>([]);

    useEffect(() => {
        const fetchDocumentos = async () => {

            try {
                const response = await api.get(`/documentos/recebidos`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDocumentos(response.data);
                console.log('Documentos recebidos:', response.data);
            } catch (error) {
                console.error('Erro ao buscar documentos:', error);
            }
        };

        if (userId && token) {
            fetchDocumentos();
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

    if (loading) {
        return <div>Carregando...</div>;

    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Documentos Recebidos</h2>
                    <div className="mb-4 flex items-center justify-between mb-8">
                        <div className=" flex items-center gap-4 w-1/2">
                            <input
                                type="text"
                                placeholder="Pesquisar documento..."
                                className="w-1/2 px-3 py-2 border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300 w-full"
                            />
                            <div className="p-2 cursor-pointer border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300">
                                <SearchIcon className="cursor-pointer text-blue-800" />
                            </div>
                        </div>
                        <div>
                            <a href="/EnviarDocumento">
                                <button
                                    type="submit"
                                    className=" right-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
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
                                    <Table.ColumnHeaderCell>Recebido de</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Tipo de Documento</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {documentos.map((documento) => (
                                    <Table.Row key={documento.id_documento}>
                                        <Table.Cell>{documento.nome ? documento.nome : 'N/A'}</Table.Cell>
                                        <Table.Cell>{formatarData(documento.dataEnvio)}</Table.Cell>
                                        <Table.Cell>{documento.enviadoPor ? documento.enviadoPor : 'N/A'}</Table.Cell>
                                        <Table.Cell>{documento.tipoDocumento ? documento.tipoDocumento : 'N/A'}</Table.Cell>
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

export default ListaDocumento;
