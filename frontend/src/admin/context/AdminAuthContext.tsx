import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/adminApi';
import toast from 'react-hot-toast';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAdminSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({} as AdminAuthContextType);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminSession = async () => {
    try {
      const res = await adminApi.get('/me');
      if (res.data.success && res.data.user) {
        setAdmin({
          id: res.data.user._id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        });
      } else {
        setAdmin(null);
      }
    } catch (err) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await adminApi.post('/login', { email, password });
      if (res.data.success && res.data.user) {
        setAdmin({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        });
        toast.success(res.data.message || 'Logged in successfully!');
        return true;
      }
      return false;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await adminApi.post('/logout');
      setAdmin(null);
      toast.success('Logged out successfully');
      window.location.href = '/admin/login';
    } catch (err: any) {
      toast.error('Logout failed');
    }
  };

  useEffect(() => {
    checkAdminSession();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, checkAdminSession }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
