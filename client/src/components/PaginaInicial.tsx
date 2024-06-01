import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth/ProvedorAutentica";
import { Flex, Text, Button } from '@radix-ui/themes';

export const PaginaInicial = () => {

  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <h1>Hello</h1>

      <Link to="/ListaCliente">Lista Clientes</Link>
      <Button
        onClick={logout} 
        className="w-42 px-4 py-2 text-white bg-black rounded-md hover:bg-yellow focus:outline-none focus:bg-yellow"
        >
        Sair
      </Button>
    </div>
  );
}
