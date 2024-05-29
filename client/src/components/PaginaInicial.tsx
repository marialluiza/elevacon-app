// import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth/ProvedorAutentica";

export const PaginaInicial = () => {

  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <h1>Hello</h1>

      {/* <Link to="/ListaCliente">Lista Clientes</Link> */}
      <button
        onClick={logout} className="w-42 px-4 py-2 text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600">
        Sair
      </button>
    </div>
  );
}
