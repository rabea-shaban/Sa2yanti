import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthCheck = url.includes('/auth/me');
    const isLoginCheck = url.includes('/auth/login');
    const isRegisterCheck = url.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthCheck && !isLoginCheck && !isRegisterCheck) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
