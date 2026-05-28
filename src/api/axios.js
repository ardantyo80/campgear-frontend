import axios from 'axios';

// Hapus atau comment baris ini:
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Tambahkan ini (hardcode):
const API_URL = 'https://campgear-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;