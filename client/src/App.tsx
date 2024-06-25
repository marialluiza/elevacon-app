import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/auth/ProvedorAutentica';
import { PaginaInicial } from './components/PaginaInicial';
import ListaCliente from './components/ListaCliente';
import Login from './components/pages/Login/Login';
import InserirCliente from './components/InserirCliente';
import EditarCliente from './components/EditarCliente';
import VisualizarCliente from './components/pages/VisualizarCliente/VisualizarCliente';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider> 
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/PaginaInicial" element={<PaginaInicial />} />
            <Route path="/ListaCliente" element={<ListaCliente />} />
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
