import { useEffect, useState } from "react";
import { Table } from "@radix-ui/themes";
import { useAuth } from "../../../infra/context/AuthProvider";
import api from "../../../infra/hooks/useAPI";
import { toast } from "sonner";
import { ITipoDocumento } from "../../../interfaces/ITipoDocumento";
import { Edit, Trash2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Pagination, Stack } from "@mui/material";
import CreateDocumentNewType from "../../Documents/CreateType";

const ListaTiposDocumentos: React.FC = () => {
    const { token, loading, contador, userRole } = useAuth();
    const [tiposDocumentos, setTiposDocumentos] = useState<ITipoDocumento[]>([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState<ITipoDocumento | null>(null);
    const idContador = contador?.id_contador;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isOpen, setOpen] = useState<boolean>(false);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchTiposDocumentos = async () => {
            try {
                const response = await api.get(`/tipo-documentos/listar?id_contador=${idContador}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setTiposDocumentos(response.data);
            } catch (err) {
                console.error('Erro ao buscar tipos de documentos:', err);
                toast.error("Não foi possível carregar os tipos de documentos.");
            }
        };

        if (idContador && token) {
            fetchTiposDocumentos();
        }
    }, [idContador, token]);

    const handleChangePage = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteConfirm = (tipoDocumento: ITipoDocumento) => {
        setSelectedTipoDocumento(tipoDocumento);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedTipoDocumento) return;
        try {
            await api.delete(`/tipo-documentos/${selectedTipoDocumento.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Tipo de documento arquivado com sucesso.');
            setTiposDocumentos(prev => prev.filter(doc => doc.id !== selectedTipoDocumento.id));
        } catch (err) {
            console.error('Erro ao arquivar tipo de documento:', err);
            toast.error('Erro ao arquivar tipo de documento.');
        } finally {
            setConfirmDeleteOpen(false);
            setSelectedTipoDocumento(null);
        }
    };

    const handleCreateTipoDocumento = (novoTipoDocumento: ITipoDocumento) => {
        setTiposDocumentos((prevTipos) => [...prevTipos, novoTipoDocumento]);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }


    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTipos = tiposDocumentos.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <div className="min-h-[89vh] bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">

                    <h2 className="text-2xl font-semibold mb-6">Tipos de Documentos</h2>

                    <div className="overflow-y-auto min-h-[65vh] max-h-[70vh] flex justify-between flex-col">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Formato</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Descrição</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="flex justify-center align-middle">Ações</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {paginatedTipos.map((tipoDocumento) => (
                                    <Table.Row key={tipoDocumento.id}>
                                        <Table.Cell>{tipoDocumento.nome ? tipoDocumento.nome : 'N/A'}</Table.Cell>
                                        <Table.Cell>{tipoDocumento.formato ? tipoDocumento.formato : 'N/A'}</Table.Cell>
                                        <Table.Cell className="max-w-md">{tipoDocumento.descricao ? tipoDocumento.descricao : 'N/A'}</Table.Cell>
                                        <Table.Cell className="max-w-10">
                                            <div className="flex justify-start gap-2">
                                                <button>
                                                    <Edit className="text-blue-500" />
                                                </button>
                                                <button onClick={() => handleDeleteConfirm(tipoDocumento)}>
                                                    <Trash2 className="text-red-500 ml-8" />
                                                </button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>

                        <Stack spacing={2} className="mt-4 flex justify-between align-middle" direction="row">
                            <Pagination
                                count={Math.ceil(tiposDocumentos.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handleChangePage}
                                shape="rounded"
                            />

                            {userRole === "CONTADOR" && (
                                <>
                                    <button
                                        onClick={() => { setOpen(true) }}
                                        type="button"
                                        className="right-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                                        Criar novo tipo
                                    </button>
                                    <CreateDocumentNewType isOpen={isOpen} onClose={() => setOpen(false)} onCreate={handleCreateTipoDocumento} />
                                </>
                            )}
                        </Stack>
                    </div>
                </div>

                {confirmDeleteOpen && (
                    <Dialog.Root open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                        <Dialog.Portal>
                            <Dialog.Overlay className="inset-0 fixed bg-black/10" />
                            <Dialog.Content>
                                <div className="fixed flex flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md outline-none justify-center items-center">
                                    <div className="p-4 w-full max-w-lg h-full md:h-auto">
                                        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-700 md:p-8">
                                            <div className="mb-4 text-sm font-light text-gray-500 dark:text-gray-400">
                                                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Tem certeza?</h3>
                                                <p className="text-gray-600 text-[16px] dark:text-gray-300">
                                                    Realmente deseja excluir este tipo de documento?
                                                </p>
                                            </div>
                                            <div className="flex justify-end pt-0 space-y-4 sm:flex sm:space-y-0">
                                                <div className="space-y-4 sm:space-x-4 sm:flex sm:space-y-0 mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDeleteOpen(false)}
                                                        className="py-2 px-4 w-full text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 sm:w-auto hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                                    >
                                                        Cancelar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={confirmDelete}
                                                        className="bg-red-700 py-2 px-4 w-full text-sm font-medium text-white rounded-lg sm:w-auto hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-400 dark:focus:ring-red-600"
                                                    >
                                                        Sim, apagar!
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                )}

            </div>
        </>
    );
};

export default ListaTiposDocumentos;

