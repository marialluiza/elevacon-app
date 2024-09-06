import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { PaginaInicial } from './components/pages/Home/PaginaInicial';
import ListaCliente from './components/pages/Client/List/ListaCliente';
import VisualizarCliente from './components/pages/VisualizarCliente/VisualizarCliente';
import EditarCliente from './components/pages/Client/Edit/EditarCliente';
import InserirCliente from './components/pages/Client/Create/InserirCliente';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/pages/login/Login';
import ListaDocumentos from './components/pages/Documents/List/ListaDocumentos';
import EnviarDocumento from './components/pages/Documents/Create/EnviarDocumento';

const App: React.FC = () => {
  return (
    <Router>
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
