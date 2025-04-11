import React from 'react';
import { useAuth } from './auth/context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div>
            <h1>Welcome, {user ? JSON.stringify(user) : 'Guest'}</h1>
            <button className='border border-solid border-pink-700 cursor-pointer' onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
