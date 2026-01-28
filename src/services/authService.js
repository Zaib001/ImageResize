import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authService = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/admin/login`, { email, password });
        return response.data;
    },
    getProfile: async () => {
        const response = await axios.get(`${API_URL}/admin/profile`);
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await axios.put(`${API_URL}/admin/profile`, data);
        return response.data;
    }
};

export default authService;
