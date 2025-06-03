import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login, register, logout, profile, authStatus } from '../utils/authApi';
import { resetAuthRedirectFlag } from '../../utils/setupAuthInterceptor';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await authStatus();
                if (res.ok)
                    return;
                navigate('/auth');
            } catch (error) {
                if (location.pathname === "/verification") return;
                navigate('/auth');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (email, password) => {
        try {
            const loginResponse = await login(email, password);
            if (loginResponse.ok) {
                const profileResponse = await profile();
                if (profileResponse.ok) {
                    const responseJson = await profileResponse.json();
                    setUser(responseJson.data);
                    localStorage.setItem("user", JSON.stringify(responseJson.data));
                }
                resetAuthRedirectFlag();
                navigate('/dashboard');
                return true;
            } else {
                const errorData = await loginResponse.json();
                throw new Error(errorData.message || 'Login failed');
            }
        } catch (error) {
            throw error;
        }
    };

    const handleRegister = async (username, email, password, confirmPassword, roleId) => {
        try {
            const response = await register(username, email, password, confirmPassword, roleId);
            if (response.ok) {
                navigate('/verification');
                return true;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }
        } catch (error) {
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response.ok) {
                setUser(null);
                localStorage.removeItem("user");
                navigate('/auth');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Logout failed');
            }
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};