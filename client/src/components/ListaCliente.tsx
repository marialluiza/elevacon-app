import { Table } from "@radix-ui/themes";
import { Link, Navigate, useNavigate } from "react-router-dom";


const ListaCliente = () => {
  const clients = [
    { id: 1, name: 'Flaviane Santos Drummond', status: 'Finalizado', documents: '0 pendentes', opened: '08/03/2024', finished: '13/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
    { id: 3, name: 'Natalia Licha Pereira', status: 'Em andamento', documents: '2 pendentes', opened: '09/03/2024' }
  ];

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
                <Table.ColumnHeaderCell>Cliente</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Documentos</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Aberto em</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Finalizado</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {clients.map(client => (
                <Table.Row key={client.id}>
                  <Table.RowHeaderCell>{client.name}</Table.RowHeaderCell>
                  <Table.Cell>{client.status}</Table.Cell>
                  <Table.Cell>{client.documents}</Table.Cell>
                  <Table.Cell>{client.opened}</Table.Cell>
                  <Table.Cell >{client.finished ? client.finished : 'N/A'}</Table.Cell>
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
