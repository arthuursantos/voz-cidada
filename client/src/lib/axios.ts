import axios, { AxiosInstance } from 'axios';
import { parseCookies } from 'nookies';

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const { "vozcidada.accessToken": accessToken } = parseCookies();
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config;
})

export default api;