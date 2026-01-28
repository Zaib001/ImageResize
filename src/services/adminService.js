import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminService = {
    getSettings: async () => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API_URL}/admin/settings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateSettings: async (data) => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.put(`${API_URL}/admin/settings`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getLogs: async () => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API_URL}/admin/logs`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default adminService;
