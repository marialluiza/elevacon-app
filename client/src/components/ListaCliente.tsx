import { Table } from "@radix-ui/themes";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/ProvedorAutentica";
import { useEffect, useState } from "react";
import api from "../hooks/usaAPI";


const ListaCliente = () => {

  const { userId } = useAuth();
  const [clientes, setClientes] = useState<any[]>([]);

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
    if (!data) return 'N/A'; // Retorna 'N/A' se a data for indefinida ou nula

    const dataObj = new Date(data);
    const dia = dataObj.getDate().toString().padStart(2, '0'); // Obtém o dia e adiciona o zero à esquerda se necessário
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês (vale lembrar que Janeiro é 0)
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Lista de Clientes</h2>
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Pesquisar cliente..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <button className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Filtrar</button>
          <button className="min-w-max ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Limpar Filtros</button>
        </div>
        <div className="overflow-y-auto max-h-[70vh]">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>CPF</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Data de Nascimento</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Ocupação</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Titulo Eleitoral</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {clientes.map(cliente => (
                <Table.Row key={cliente.id}>
                  <Table.RowHeaderCell>{cliente.id_cliente}</Table.RowHeaderCell>
                  <Table.Cell>{cliente.cpf ? cliente.cpf : 'N/A'}</Table.Cell>
                  <Table.Cell>{formatarData(cliente.data_nascimento)}</Table.Cell>
                  <Table.Cell>{cliente.ocupacao_principal ? cliente.ocupacao_principal : 'N/A'}</Table.Cell>
                  <Table.Cell >{cliente.titulo_eleitoral ? cliente.titulo_eleitoral : 'N/A'}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Inserir cliente</button>
          <Link to="/InserirCliente">Inserir Cliente</Link>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Gerar acesso</button>
        </div>
      </div>
    </div>
  );
};

export default ListaCliente;
