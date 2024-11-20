import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./infra/context/AuthProvider";
import { PaginaInicial } from "./components/Home/PaginaInicial";
import ListaCliente from "./components/Client/List/ListaCliente";
import VisualizarCliente from "./components/Client/Single/VisualizarCliente/VisualizarCliente";
import EditarCliente from "./components/Client/Edit/EditarCliente";
import InserirCliente from "./components/Client/Create/InserirCliente";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Login from "./components/Login/Login";
import ListaDocumentos from "./components/Documents/List/ListaDocumentos";
import EnviarDocumento from "./components/Documents/Create/EnviarDocumento";
import { Toaster } from "sonner";
import SessaoAjuda from "./components/HelpSession/SessaoAjuda";
import ListaDocumentosEnviados from "./components/Documents/List/ListaDocumentosEnviados";
import ListaTiposDocumetos from "./components/TiposDocumentos/List";
import VisualizarInformaçõesLadoCliente from "./components/Client/Single/LadoCliente";
import EditarClienteCliente from "./components/Client/Edit/LadoCliente";
import { EditarPerfil } from "./components/EditProfile/EditarPerfil";
import Layout from "./components/Layout/Layout";

const App: React.FC = () => {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <Routes>
          {/* Rota de Login */}
          <Route path="/Login" element={<Login />} />

          {/* Rotas protegidas com Layout */}
          <Route element={<Layout />}>
            {/* Rotas comuns entre CONTADOR e CLIENTE */}
            <Route
              element={<PrivateRoute allowedRoles={["CONTADOR", "CLIENTE"]} />}
            >
              <Route path="/PaginaInicial" element={<PaginaInicial />} />
              <Route path="/EditarPerfil" element={<EditarPerfil />} />
              <Route path="/ListaDocumento" element={<ListaDocumentos />} />
              <Route
                path="/ListaDocumentosEnviados"
                element={<ListaDocumentosEnviados />}
              />
              <Route path="/EnviarDocumento" element={<EnviarDocumento />} />
              <Route path="/Ajuda" element={<SessaoAjuda />} />
            </Route>

            {/* Rotas exclusivas para CONTADOR */}
            <Route element={<PrivateRoute allowedRoles={["CONTADOR"]} />}>
              <Route path="/EditarCliente/:id" element={<EditarCliente />} />
              <Route
                path="/VisualizarCliente/:id"
                element={<VisualizarCliente />}
              />
              <Route path="/ListaCliente" element={<ListaCliente />} />
              <Route path="/InserirCliente" element={<InserirCliente />} />
              <Route
                path="/ListarTiposDocumentos/"
                element={<ListaTiposDocumetos />}
              />
            </Route>

            {/* Rotas exclusivas para CLIENTE */}
            <Route element={<PrivateRoute allowedRoles={["CLIENTE"]} />}>
              <Route
                path="/VisualizarClienteCliente"
                element={<VisualizarInformaçõesLadoCliente />}
              />
              <Route
                path="/EditarClienteCliente"
                element={<EditarClienteCliente />}
              />
            </Route>
          </Route>

          {/* Redirecionamento padrão */}
          <Route path="/" element={<Navigate to="/PaginaInicial" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
