import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://image-resize-backend-xf8f.vercel.app/api';

// Create axios instance with interceptor for auth
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const contactService = {
    // Public
    submitContact: async (data) => {
        const response = await axios.post(`${API_URL}/contact`, data);
        return response.data;
    },

    // Admin
    getContacts: async (params) => {
        const response = await axiosInstance.get('/contact', { params });
        return response.data;
    },

    updateContactStatus: async (id, status) => {
        const response = await axiosInstance.patch(`/contact/${id}`, { status });
        return response.data;
    },

    deleteContact: async (id) => {
        const response = await axiosInstance.delete(`/contact/${id}`);
        return response.data;
    }
};
