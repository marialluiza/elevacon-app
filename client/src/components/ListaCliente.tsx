import { Table } from "@radix-ui/themes";
import * as Dialog from '@radix-ui/react-dialog';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/ProvedorAutentica";
import { useEffect, useState } from "react";
import api from "../hooks/usaAPI";
import NavBar from "./ui/Header/Header";
import { Edit, SearchIcon, SquareArrowOutUpRight, Trash2Icon, X } from 'lucide-react';

const ListaCliente = () => {

  const { userId } = useAuth();
  const [clientes, setClientes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get(`/cliente/listar-clientes`);
        setClientes(response.data);
        console.log('Clientes recebidos:', response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    if (userId) {
      fetchClientes();
    }
  }, [userId]);

  const formatarData = (data: string | undefined) => {
    if (!data) return 'N/A';

    const dataObj = new Date(data);
    const dia = dataObj.getDate().toString().padStart(2, '0'); // recebe o dia e adiciona o zero à esquerda se necessário
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); // obtém o mês - comeca em janeiro=0
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  const handleEditarClick = (id_cliente: number) => {
    navigate(`/EditarCliente/${id_cliente}`);
  };

  const handleExcluirCliente = async (idCliente: number) => {
    try {
      const response = await api.delete(`/cliente/excluir-cliente/${idCliente}`);
      setClientes(clientes.filter(cliente => cliente.id_cliente !== idCliente));
      setIsOpen(false);
      console.log('Cliente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleFecharModal = () => {
    setIsOpen(false);
  };

  const handleNaviteVisualizar = (id_cliente: number) => {
    navigate(`/VisualizarCliente/${id_cliente}`);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-4 ">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Lista de Clientes</h2>
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
                  {/* <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell> */}
                  <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Telefone</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>CPF</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Data de nascimento</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Ocupação</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Titulo Eleitoral</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {clientes.map(cliente => (
                  <Table.Row key={cliente.id}>
                    {/* <Table.RowHeaderCell>{cliente.id_cliente}</Table.RowHeaderCell> */}
                    <Table.Cell>{cliente.nome ? cliente.nome : 'N/A'}</Table.Cell>
                    <Table.Cell>{cliente.telefone ? cliente.telefone : 'N/A'}</Table.Cell>
                    <Table.Cell>{cliente.cpf ? cliente.cpf : 'N/A'}</Table.Cell>
                    <Table.Cell>{formatarData(cliente.data_nascimento)}</Table.Cell>
                    <Table.Cell>{cliente.ocupacao_principal ? cliente.ocupacao_principal : 'N/A'}</Table.Cell>
                    <Table.Cell >{cliente.titulo_eleitoral ? cliente.titulo_eleitoral : 'N/A'}</Table.Cell>

                    <Table.Cell>
                      <SquareArrowOutUpRight className="cursor-pointer" onClick={() => handleNaviteVisualizar(cliente.id_cliente)} />
                    </Table.Cell>
                    <Table.Cell>
                      <Edit className="cursor-pointer" onClick={() => handleEditarClick(cliente.id_cliente)} />
                    </Table.Cell>
                    <Table.Cell>
                      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                        <Dialog.Trigger>
                          <Trash2Icon className="text-red-700" />
                        </Dialog.Trigger>

                        <Dialog.Portal>
                          <Dialog.Overlay className="inset-0 fixed bg-black/10" >
                            <Dialog.Content>
                              <div id="" className="fixed flex flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md outline-none justify-center items-center">
                                <div className=" p-4 w-full max-w-lg h-full md:h-auto">
                                  <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8">
                                    <div className="mb-4 text-sm font-light text-gray-500 dark:text-gray-400">
                                      <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Tem certeza?</h3>
                                      <p className="text-white">
                                        Tem certeza de que deseja excluir esse cliente? Esta ação é irreversível e todas as informações serão perdidas permanentemente.
                                      </p>
                                    </div>
                                    <div className=" pt-0 space-y-4 sm:flex sm:space-y-0">

                                      <div className=" space-y-4 sm:space-x-4 sm:flex sm:space-y-0">
                                        <button id="close-modal"
                                          type="button"
                                          onClick={handleFecharModal}
                                          className="py-2 px-4 w-full text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 sm:w-auto hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                          Cancelar
                                        </button>

                                        <button id="confirm-button"
                                          type="button"
                                          onClick={() => handleExcluirCliente(cliente.id_cliente)}
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
                ))}
              </Table.Body>
            </Table.Root>
          </div>

          <div className="mt-4 flex justify-between">
            {/* <Link to="/PaginaInicial" className="fixed bottom-4  bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700">
              Página anterior
            </Link> */}

            <Link to="/InserirCliente" className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700 z-50">
              Inserir Cliente
            </Link>
          </div>
        </div>
      </div>
    </>

  );
};
export default ListaCliente;
