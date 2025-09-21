import axios from 'axios';

const api = axios.create({
    baseURL: 'https://app-subasta-backend.azurewebsites.net/api'
});

// Interceptor para a�adir el token a cada petici�n si existe
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;