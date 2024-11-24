import { Table } from "@radix-ui/themes";
import { useAuth } from "../../../infra/context/AuthProvider";
import { useEffect, useState } from "react";
import { Download, SearchIcon } from 'lucide-react';
import api from "../../../infra/hooks/useAPI";
import { toast } from "sonner";
import { IDocumento } from "../../../interfaces/IDocumento";
import { Pagination, Stack } from "@mui/material";

const ListaDocumento: React.FC = () => {
    const { userId, token, loading } = useAuth();
    const [documentos, setDocumentos] = useState<IDocumento[]>([]);
    const [filteredDocumentos, setFilteredDocumentos] = useState<IDocumento[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const response = await api.get(`/documentos/recebidos`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDocumentos(response.data);
                setFilteredDocumentos(response.data);
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
            toast.error("Não foi possível baixar o documento.")
        }
    };

    const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = documentos.filter((documento) =>
            documento.nome.toLowerCase().includes(term) ||
            documento.enviadoPor.toLowerCase().includes(term) ||
            documento.tipoDocumento.toLowerCase().includes(term)
        );

        setFilteredDocumentos(filtered);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    const paginatedDocumentos = filteredDocumentos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex min-h-[89vh] bg-gray-100 p-4 justify-between flex-col">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Documentos Recebidos</h2>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 w-full">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Pesquisar nome e tipo de documento..."
                            className="w-1/2 px-3 py-2 border rounded-md border-blue-800 focus:outline-none focus:ring focus:border-blue-300"
                        />
                        {/* <div className="p-2 cursor-pointer border rounded-md border-blue-800">
                            <SearchIcon className="text-blue-800" />
                        </div> */}
                    </div>

                    <div className="w-1/2 flex justify-end gap-10">
                        <a href="/EnviarDocumento">
                            <button
                                type="submit"
                                className=" right-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                                Enviar documento
                            </button>

                        </a>

                    </div>
                </div>
                <div className="overflow-y-auto min-h-[60vh] max-h-[60vh] flex justify-between flex-col">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Data de Envio</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Recebido de</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Tipo de Documento</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="flex align-middle justify-center">Ações</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {paginatedDocumentos.map((documento) => (
                                <Table.Row key={documento.id}>
                                    <Table.Cell>{documento.nome || 'N/A'}</Table.Cell>
                                    <Table.Cell>{formatarData(documento.dataEnvio)}</Table.Cell>
                                    <Table.Cell>{documento.enviadoPor || 'N/A'}</Table.Cell>
                                    <Table.Cell>{documento.tipoDocumento || 'N/A'}</Table.Cell>
                                    <Table.Cell className="flex justify-center">
                                        <button onClick={() => handleDownload(documento.id)}>
                                            <Download className="text-blue-500" />
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>

                    <Stack spacing={2} className="mt-4 flex justify-between align-middle" direction="row">
                        <Pagination
                            count={Math.ceil(filteredDocumentos.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            shape="rounded"
                        />
                    </Stack>
                </div>
            </div>
        </div>
    );
};

export default ListaDocumento;