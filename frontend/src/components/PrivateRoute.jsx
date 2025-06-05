import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        if (location.pathname == "/verification")
            return children
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default PrivateRoute;
