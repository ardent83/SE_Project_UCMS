import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login, register, logout, profile, authStatus, sendResetPasswordEmail, verifyResetPasswordCode } from '../utils/authApi';
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
                throw new Error();
            } catch (error) {
                if (
                    location.pathname === "/verification" ||
                    location.pathname === "/confirmation"
                ) return;
                navigate('/auth');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [location.pathname, navigate]);

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

    const handleSendPasswordResetEmail = async (email) => {
        setLoading(true);
        try {
            console.log('AuthContext: Calling API to send password reset email for:', email);
            const response = await sendResetPasswordEmail(email);

            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    console.log('API response for send email:', data);
                } else {
                    console.log('API response for send email was not JSON or empty but successful.');
                }
                console.log('AuthContext: Password reset email API call successful.');
                return true;
            } else {
                const contentType = response.headers.get("content-type");
                let errorMessage = 'Failed to send password reset email';
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } else {
                    const textError = await response.text();
                    errorMessage = textError || errorMessage;
                }
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('AuthContext: Error sending password reset email:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPasswordResetCode = async (email, code) => {
        setLoading(true);
        try {
            console.log('AuthContext: Calling API to verify password reset code:', { email, code });
            const response = await verifyResetPasswordCode(email, code);

            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    console.log('API response for verify code:', data);
                } else {
                    console.log('API response for verify code was not JSON or empty but successful.');
                }

                console.log('AuthContext: Password reset code verification API call successful.');
                navigate('/auth');
                return true;
            } else {
                const contentType = response.headers.get("content-type");
                let errorMessage = 'Invalid or expired password reset code';
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } else {
                    const textError = await response.text();
                    errorMessage = textError || errorMessage;
                }
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('AuthContext: Error verifying password reset code:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        sendPasswordResetEmail: handleSendPasswordResetEmail,
        verifyPasswordResetCode: handleVerifyPasswordResetCode,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};