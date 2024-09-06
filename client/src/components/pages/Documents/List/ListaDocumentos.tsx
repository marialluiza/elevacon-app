import { Table } from "@radix-ui/themes";
import * as Dialog from '@radix-ui/react-dialog';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/auth/AuthProvider";
import { useEffect, useState } from "react";
import api from "../../../../hooks/useAPI";
import NavBar from "../../../ui/Header/Header";
import { SearchIcon } from 'lucide-react';

interface Documento {
    id_documento: number;
    nome?: string;
    data_envio?: string;
    enviadoPor?: string;
    tipoDocumento?: string;
}

const ListaDocumento: React.FC = () => {
    const { userId, token, loading } = useAuth();
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocumentos = async () => {

            console.log(userId, token)
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
        return <div>Carregando...</div>; // ou um spinner de carregamento
    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Documentos Recebidos</h2>
                    <div className="mb-4 flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Pesquisar documento..."
                            className="w-1/2 px-3 py-2 border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <div className="p-2 cursor-pointer border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300">
                            <SearchIcon className="cursor-pointer text-blue-800" />
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-[70vh]">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Data de Envio</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Enviado Por</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Tipo de Documento</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {documentos.map((documento) => (
                                    <Table.Row key={documento.id_documento}>
                                        <Table.Cell>{documento.nome ? documento.nome : 'N/A'}</Table.Cell>
                                        <Table.Cell>{formatarData(documento.data_envio)}</Table.Cell>
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
