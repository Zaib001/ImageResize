import axios from 'axios';

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {

=======
const API_URL = import.meta.env.VITE_API_URL || 'https://image-resize-backend-xf8f.vercel.app/api';

export const api = {
    
>>>>>>> 278c49c0a54eae1b5e66d9f77c069b8423ae4461
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
<<<<<<< HEAD
            if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
                throw error; // Re-throw so caller can handle cancellation, but don't log it here
            }
=======
>>>>>>> 278c49c0a54eae1b5e66d9f77c069b8423ae4461
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
