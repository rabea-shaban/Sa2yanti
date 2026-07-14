import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: `${baseURL}/admin`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, redirect to the admin login page
    // except when verifying the current session at startup
    const isMeCheck = error.config?.url?.includes('/me');
    const isLoginCheck = error.config?.url?.includes('/login');
    if (error.response?.status === 401 && !isMeCheck && !isLoginCheck) {
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;
