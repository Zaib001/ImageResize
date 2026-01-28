import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('adminToken', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('adminToken');
        }
    }, [token]);

    const checkAuthStatus = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${API_URL}/admin/profile`);
            if (response.data.success) {
                setUser(response.data.data);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
