import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const blogService = {
    // Public Endpoints
    getPublishedBlogs: async (params = {}) => {
        const response = await axios.get(`${API_URL}/blogs`, { params });
        return response.data;
    },
    getBlogBySlug: async (slug) => {
        const response = await axios.get(`${API_URL}/blogs/${slug}`);
        return response.data;
    },
    getRelatedBlogs: async (slug) => {
        const response = await axios.get(`${API_URL}/blogs/${slug}/related`);
        return response.data;
    },
    getCategories: async () => {
        const response = await axios.get(`${API_URL}/blogs/categories`);
        return response.data;
    },
    getTags: async () => {
        const response = await axios.get(`${API_URL}/blogs/tags`);
        return response.data;
    },

    // Admin Endpoints
    adminGetAllBlogs: async (params = {}) => {
        const response = await axios.get(`${API_URL}/blogs/admin/all`, { params });
        return response.data;
    },
    adminGetBlogById: async (id) => {
        const response = await axios.get(`${API_URL}/blogs/admin/${id}`);
        return response.data;
    },
    adminCreateBlog: async (data) => {
        const response = await axios.post(`${API_URL}/blogs/admin`, data);
        return response.data;
    },
    adminUpdateBlog: async (id, data) => {
        const response = await axios.put(`${API_URL}/blogs/admin/${id}`, data);
        return response.data;
    },
    adminDeleteBlog: async (id) => {
        const response = await axios.delete(`${API_URL}/blogs/admin/${id}`);
        return response.data;
    },
    adminToggleStatus: async (id) => {
        const response = await axios.patch(`${API_URL}/blogs/admin/${id}/status`);
        return response.data;
    },
    adminGetStats: async () => {
        const response = await axios.get(`${API_URL}/blogs/admin/stats`);
        return response.data;
    }
};

export default blogService;
