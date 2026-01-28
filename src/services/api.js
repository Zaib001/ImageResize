import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://image-resize-backend-xf8f.vercel.app/api';

export const api = {

    processImage: async (formData, signal) => {
        try {
            const response = await axios.post(`${API_URL}/process`, formData, {
                responseType: 'blob',
                signal: signal,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
                throw error; // Re-throw so caller can handle cancellation, but don't log it here
            }
            if (error.response?.data instanceof Blob) {
                const text = await error.response.data.text();
                try {
                    const errorJson = JSON.parse(text);
                    console.error("API Error (JSON):", errorJson);
                } catch (e) {
                    console.error("API Error (Text):", text);
                }
            } else {
                console.error('API Error:', error);
            }
            throw error;
        }
    }
};
