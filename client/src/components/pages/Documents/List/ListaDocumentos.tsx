import { Table } from "@radix-ui/themes";
import * as Dialog from '@radix-ui/react-dialog';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/auth/AuthProvider";
import { useEffect, useState } from "react";
import api from "../../../../hooks/useAPI";
import NavBar from "../../../ui/Header/Header";
import { Edit, SearchIcon, SquareArrowOutUpRight, Trash2Icon } from 'lucide-react';
import { getDocumentosPorCliente } from "../../../../api/documentoService";

interface Documento {
    id_documento: number;
    nome: string;
    tipo: string;
    data_abertura: string;
    enviado: boolean;
  }
  
  interface Cliente {
    id_cliente: number;
    nome?: string;
    documentos: Documento[];
  }
  
  const ListaDocumentos: React.FC = () => {
    const { userId, token, loading } = useAuth();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteIdParaExcluir, setClienteIdParaExcluir] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchClientes = async () => {
        try {
          // Supondo que você tenha uma lista de clientes
          const response = await api.get(`/cliente/listar-clientes`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const clientesData = response.data;
  
          // Buscar documentos para cada cliente
          const clientesComDocumentos = await Promise.all(clientesData.map(async (cliente: Cliente) => {
            const documentos = await getDocumentosPorCliente(cliente.id_cliente);
            return { ...cliente, documentos };
          }));
  
          setClientes(clientesComDocumentos);
          console.log('Clientes com documentos recebidos:', clientesComDocumentos);
        } catch (error) {
          console.error('Erro ao buscar clientes e documentos:', error);
        }
      };
  
      if (userId && token) {
        fetchClientes();
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
  
    const handleEditarClick = (id_cliente: number) => {
      navigate(`/EditarCliente/${id_cliente}`);
    };
  
    const handleExcluirCliente = async () => {
      if (clienteIdParaExcluir === null) return;
      try {
        const response = await api.delete(`/cliente/excluir-cliente/${clienteIdParaExcluir}`);
        setClientes(clientes.filter(cliente => cliente.id_cliente !== clienteIdParaExcluir));
        setIsOpen(false);
        setClienteIdParaExcluir(null);
        console.log(`Cliente com o id ${clienteIdParaExcluir} foi excluído com sucesso!`);
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    };
  
    const handleAbrirModalExcluir = (idCliente: number) => {
      setClienteIdParaExcluir(idCliente);
      setIsOpen(true);
    };
  
    const handleFecharModal = () => {
      setIsOpen(false);
      setClienteIdParaExcluir(null);
    };
  
    const handleNaviteVisualizar = (id_cliente: number) => {
      navigate(`/VisualizarCliente/${id_cliente}`);
    };
  
    if (loading) {
      return <div>Carregando...</div>; // ou um spinner de carregamento
    }
  
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-100 p-4 ">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Lista de Documentos</h2>
            <div className="mb-4 flex items-center gap-4">
              <input
                type="text"
                placeholder="Pesquisar cliente..."
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
                    <Table.ColumnHeaderCell>Cliente</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Documento</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Aberto em</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Enviado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
  
                <Table.Body>
                  {clientes.map(cliente => (
                    cliente.documentos.map(documento => (
                      <Table.Row key={documento.id_documento}>
                        <Table.Cell>{cliente.nome}</Table.Cell>
                        <Table.Cell>{documento.nome}</Table.Cell>
                        <Table.Cell>{formatarData(documento.data_abertura)}</Table.Cell>
                        <Table.Cell>{documento.enviado ? 'Sim' : 'Não'}</Table.Cell>
                        <Table.Cell>
                          <SquareArrowOutUpRight className="cursor-pointer" onClick={() => handleNaviteVisualizar(cliente.id_cliente)} />
                        </Table.Cell>
                        <Table.Cell>
                          <Edit className="cursor-pointer" onClick={() => handleEditarClick(cliente.id_cliente)} />
                        </Table.Cell>
                        <Table.Cell>
                          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                            <Dialog.Trigger asChild>
                              <Trash2Icon className="text-red-700 cursor-pointer" onClick={() => handleAbrirModalExcluir(cliente.id_cliente)} />
                            </Dialog.Trigger>
  
                            <Dialog.Portal>
                              <Dialog.Overlay className="inset-0 fixed bg-black/10">
                                <Dialog.Content>
                                  <div className="fixed flex flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md outline-none justify-center items-center">
                                    <div className="p-4 w-full max-w-lg h-full md:h-auto">
                                      <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8">
                                        <div className="mb-4 text-sm font-light text-gray-500 dark:text-gray-400">
                                          <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Tem certeza?</h3>
                                          <p className="text-white">
                                            Tem certeza de que deseja excluir esse cliente? Esta ação é irreversível e todas as informações serão perdidas permanentemente.
                                          </p>
                                        </div>
                                        <div className="pt-0 space-y-4 sm:flex sm:space-y-0">
                                          <div className="space-y-4 sm:space-x-4 sm:flex sm:space-y-0">
                                            <button id="close-modal"
                                              type="button"
                                              onClick={handleFecharModal}
                                              className="py-2 px-4 w-full text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 sm:w-auto hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                              Cancelar
                                            </button>
  
                                            <button id="confirm-button"
                                              type="button"
                                              onClick={handleExcluirCliente}
                                              className="bg-red-700 py-2 px-4 w-full text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-auto hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                            >Sim, apagar!
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Dialog.Content>
                              </Dialog.Overlay>
                            </Dialog.Portal>
                          </Dialog.Root>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ))}
                </Table.Body>
              </Table.Root>
            </div>
  
          </div>
        </div>
      </>
    );
  };
  
  export default ListaDocumentos;