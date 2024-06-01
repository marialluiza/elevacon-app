import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth/ProvedorAutentica";
import { Flex, Text, Button } from '@radix-ui/themes';
import NavBar from "./ui/NavBar";
import Card from "./ui/Card";

export const PaginaInicial = () => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow p-4">
        <h2 className="text-xl font-bold">Atualizações</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <Card color="bg-blue-500" title="x documentos" description="x clientes" />
          <Card color="bg-yellow-500" title="x documentos pendentes" description="x clientes" />
          <Card color="bg-green-500" title="" description="Visualizar tudo" />
        </div>
        <h2 className="text-xl font-bold mt-8">Acessar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <Link to="/ListaCliente" className="bg-gray-200 p-4 rounded-lg text-center hover:bg-gray-300 transition-colors duration-300">
            Clientes
          </Link>
          <Link to="#" className="bg-gray-200 p-4 rounded-lg text-center hover:bg-gray-300 transition-colors duration-300">
            Documentos
          </Link>
        </div>
      </div>
      <div className="p-4">
        <Button
          onClick={logout}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          Sair
        </Button>
      </div>
    </div>
  );
};

export default PaginaInicial;