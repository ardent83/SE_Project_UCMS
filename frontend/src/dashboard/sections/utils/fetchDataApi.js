export const fetchData = async (endpoint) => {
    const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response.json();
};