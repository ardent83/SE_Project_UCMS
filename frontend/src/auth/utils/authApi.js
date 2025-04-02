const apiBaseUrl = "";

export const login = async (username, password) => {
    const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    return response;
};

export const register = async (username, email, password, confirmPassword) => {
    const response = await fetch(`${apiBaseUrl}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
    });
    return response;
};

export const logout = async () => {
    const response = await fetch(`${apiBaseUrl}/api/logout`, {
        method: 'GET',
    });
    return response;
};
