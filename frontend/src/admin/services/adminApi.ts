import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
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
