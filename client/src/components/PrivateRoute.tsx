// // components/PrivateRoute.tsx
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../contexts/auth/AuthProvider';

// interface PrivateRouteProps {
//   allowedRoles: ('admin' | 'contador' | 'cliente')[];
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
//   const { signed, role, loading } = useAuth();

//   if (loading) {
//     return <div>Carregando...</div>; // Ou um componente de loading
//   }

//   if (!signed) {
//     return <Navigate to="/Login" />;
//   }

//   if (!allowedRoles.includes(role!)) {
//     // Redireciona para uma página de "Acesso Negado" ou página inicial se não tiver permissão
//     return <Navigate to="/PaginaInicial" />;
//   }

//   return <Outlet />;
// };

// export default PrivateRoute;


import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthProvider';

const PrivateRoute: React.FC = () => {
    const { signed, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div></div>;
    }

    return signed ? <Outlet /> : <Navigate to="/Login" state={{ from: location }} />;
};

export default PrivateRoute;

