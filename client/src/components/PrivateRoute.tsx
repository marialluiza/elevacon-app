import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth/ProvedorAutentica';

const PrivateRoute: React.FC = () => {
    const { signed } = useAuth();
    const location = useLocation();

    return signed ? <Outlet /> : <Navigate to="/Login" state={{ from: location }} />;
};

export default PrivateRoute;