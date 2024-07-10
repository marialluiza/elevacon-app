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

