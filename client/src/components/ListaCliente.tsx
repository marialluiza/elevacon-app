// import { useAuth } from "../contexts/auth/ProvedorAutentica";

// export const ListaCliente = () => {

//   const { logout } = useAuth();

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-slate-200">
//       <h1>Pagina 2</h1>

//       <button
//         onClick={logout} className="w-42 px-4 py-2 text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600">
//         Sair
//       </button>
//     </div>
//   );
// }
const ListaCliente = () => {
    const clients = [
      { id: 1, name: 'Flaviane Santos Drummond', status: 'Finalizado', documents: '0 pendentes', opened: '08/03/2024', finished: '13/03/2024' },
      { id: 2, name: 'Henrique Gonçalves Pereira', status: 'Não iniciado', documents: '2 pendentes', opened: '09/03/2024' },
      { id: 3, name: 'Natalia Licha Pereira', status: 'Em andamento', documents: '2 pendentes', opened: '09/03/2024' }
    ];
  
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Todos</h2>
          <div className="mb-4 flex items-center">
            <input 
              type="text" 
              placeholder="Pesquisar cliente..." 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Filtrar</button>
            <button className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Limpar filtros</button>
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Clientes</th>
                <th className="py-2">Status</th>
                <th className="py-2">Documentos</th>
                <th className="py-2">Aberto em</th>
                <th className="py-2">Finalizado</th>
                <th className="py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4">{client.name}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full ${client.status === 'Finalizado' ? 'bg-green-200 text-green-800' : client.status === 'Não iniciado' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{client.documents}</td>
                  <td className="py-2 px-4">{client.opened}</td>
                  <td className="py-2 px-4">{client.finished ? client.finished : '-'}</td>
                  <td className="py-2 px-4">
                    <button className="text-blue-500 hover:underline">Abrir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Inserir cliente</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Gerar acesso</button>
          </div>
        </div>
      </div>
    );
  };
  
export default ListaCliente;
