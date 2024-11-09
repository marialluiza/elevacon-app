import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './infra/context/AuthProvider';
import { PaginaInicial } from './components/Home/PaginaInicial';
import ListaCliente from './components/Client/List/ListaCliente';
import VisualizarCliente from './components/Client/Single/VisualizarCliente/VisualizarCliente';
import EditarCliente from './components/Client/Edit/EditarCliente';
import InserirCliente from './components/Client/Create/InserirCliente';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './components/Login/Login';
import EditarPerfil from './components/EditProfile/EditarPerfil';
import ListaDocumentos from './components/Documents/List/ListaDocumentos';
import EnviarDocumento from './components/Documents/Create/EnviarDocumento';
import { Toaster } from 'sonner'
import SessaoAjuda from './components/HelpSession';

const App: React.FC = () => {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <AuthProvider>

        <Routes>
          <Route path="/Login" element={<Login />} />

          <Route element={<PrivateRoute allowedRoles={['CONTADOR', 'CLIENTE']} />}>
            <Route path="/PaginaInicial" element={<PaginaInicial />} />
            <Route path="/EditarPerfil" element={<EditarPerfil />} />
            <Route path="/ListaDocumento" element={<ListaDocumentos />} />
            <Route path="/EnviarDocumento" element={<EnviarDocumento />} />
            <Route path="/Ajuda" element={<SessaoAjuda/>} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['CONTADOR']} />}>
            <Route path="/ListaCliente" element={<ListaCliente />} />
            <Route path="/VisualizarCliente/:id" element={<VisualizarCliente />} />
            <Route path="/InserirCliente" element={<InserirCliente />} />
            <Route path="/EditarCliente/:id" element={<EditarCliente />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['CLIENTE']} />}>
          </Route>

          <Route path="/" element={<Navigate to="/PaginaInicial" />} />
        </Routes>


        {/* <Routes>
          <Route path="/Login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/PaginaInicial" element={<PaginaInicial />} />
            <Route path="/ListaCliente" element={<ListaCliente />} />
            <Route path="/ListaDocumento" element={<ListaDocumentos />} />
            <Route path="/EnviarDocumento" element={<EnviarDocumento />} />
            <Route path="/InserirCliente" element={<InserirCliente />} />
            <Route path="/EditarCliente/:id" element={<EditarCliente />} />
            <Route path="/VisualizarCliente/:id" element={<VisualizarCliente />} />
          </Route>
          <Route path="/" element={<Navigate to="/PaginaInicial" />} />
        </Routes> */}
      </AuthProvider>
    </Router>
  );
};

export default App;

