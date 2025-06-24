const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const login = async (email, password) => {
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });
    return response;
};

export const register = async (username, email, password, confirmPassword, roleId) => {
    const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, confirmPassword, roleId }),
    });
    return response;
};

export const logout = async () => {
    const response = await fetch(`${apiBaseUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    return response;
};

export const profile = async () => {
    const response = await fetch(`${apiBaseUrl}/api/users/profile`, {
        method: 'GET',
        credentials: 'include',
    });
    return response;
};

export const authStatus = async () => {
    const response = await fetch(`${apiBaseUrl}/api/auth/status`, {
        method: 'GET',
        credentials: 'include',
    });
    return response;
};

export const sendResetPasswordEmail = async (email) => {
    const response = await fetch(`${apiBaseUrl}/api/auth/RequestTempPassword`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
    });
    return response;
};

export const verifyResetPasswordCode = async (email, code) => {
    const currentDateTimeISO = new Date().toISOString(); 

    const response = await fetch(`${apiBaseUrl}/api/auth/TempPassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            email: email,
            oneTimeCode: {
                code: code,
                expiry: currentDateTimeISO 
            }
        }),
    });
    return response;
};