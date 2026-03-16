
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9999',
    headers: {
        'Content-Type': 'application/json',
    },
});

// log lỗi chung hoặc xử lý response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Lỗi API:', error.message);
        return Promise.reject(error);
    }
);

export default api;