import { Link } from "react-router-dom";
import NavBar from "../../ui/Header/Header";
import Card from "./Card/Card";

export const PaginaInicial = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow p-4">
        <h2 className="text-xl font-bold">Atualizações</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <Card color="bg-blue-500" title="x documentos recebidos" description="" />
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
      </div>
    </div>
  );
};

export default PaginaInicial;