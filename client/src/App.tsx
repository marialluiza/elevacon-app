import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { PaginaInicial } from './components/pages/Home/PaginaInicial';
import ListaCliente from './components/ListaCliente';
import Login from './components/pages/login/Login';
import VisualizarCliente from './components/pages/VisualizarCliente/VisualizarCliente';
import EditarCliente from './components/pages/Client/Edit/EditarCliente';
import InserirCliente from './components/pages/Client/Create/InserirCliente';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider> 
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/PaginaInicial" element={<PaginaInicial />} />
            <Route path="/ListaCliente" element={<ListaCliente />} />
            <Route path="/InserirCliente" element={<InserirCliente/>} />
            <Route path="/EditarCliente/:id" element={<EditarCliente/>} />
            <Route path="/VisualizarCliente/:id" element={<VisualizarCliente />} />
          </Route>
          <Route path="/" element={<Navigate to="/PaginaInicial" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
