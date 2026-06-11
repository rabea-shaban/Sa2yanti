import { createContext, useEffect, useState } from 'react';
import axiosInstance from '../../services/Api';

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      setUser(res.data.user);
      setRole(res.data.user.role);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axiosInstance.post('/auth/logout');
    setUser(null);
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, getMe, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
}
