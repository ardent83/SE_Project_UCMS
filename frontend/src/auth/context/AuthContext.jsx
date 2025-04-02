import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout } from '../utils/authApi';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/user/me');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false); // Set loading to false after 3 seconds
                }, 3000);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (username, password) => {
        try {
            const response = await login(username, password);
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                navigate('/dashboard');
                return true;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
        } catch (error) {
            throw error;
        }
    };

    const handleRegister = async (username, email, password, confirmPassword) => {
        try {
            const response = await register(username, email, password, confirmPassword);
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                navigate('/dashboard');
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
                navigate('/login');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Logout failed');
            }
        } catch (error) {
            console.error("Logout error:", error);
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
