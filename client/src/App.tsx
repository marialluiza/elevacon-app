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
import ListaDocumentos from './components/Documents/List/ListaDocumentos';
import EnviarDocumento from './components/Documents/Create/EnviarDocumento';
import { Toaster} from 'sonner'

const App: React.FC = () => {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <Routes>
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
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
