import axios from 'axios';
import {
    startRegistration,
    startAuthentication,
} from '@simplewebauthn/browser';

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
    },

    // Passkey Registration
    registerPasskey: async () => {
        // 1. Get options from server
        const { data: options } = await axios.post(`${API_URL}/admin/passkey/register-options`);

        // 2. Start WebAuthn registration
        const attestationResponse = await startRegistration({ optionsJSON: options });

        // 3. Verify with server
        const { data: result } = await axios.post(`${API_URL}/admin/passkey/register-verify`, attestationResponse);
        return result;
    },

    // Passkey Login
    loginWithPasskey: async (email) => {
        // 1. Get options from server
        const { data: options } = await axios.post(`${API_URL}/admin/passkey/login-options`, { email });

        // 2. Start WebAuthn authentication
        const assertionResponse = await startAuthentication({ optionsJSON: options });

        // 3. Verify with server
        const { data: result } = await axios.post(`${API_URL}/admin/passkey/login-verify`, {
            email,
            body: assertionResponse
        });
        return result;
    }
};

export default authService;
