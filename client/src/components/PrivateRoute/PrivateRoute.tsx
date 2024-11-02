import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../infra/context/AuthProvider';

interface PrivateRouteProps {
  allowedRoles: string[]; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { signed, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>; 
  }

  if (!signed) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/PaginaInicial" replace />; 
  }

  return <Outlet />;
};

export default PrivateRoute;