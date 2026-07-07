import { createContext, useEffect, useState } from 'react';
import axiosInstance from '../../services/Api';
import type { AuthContextType, AuthUser } from '../../types/auth';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      setUser(res.data.user);
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
    <AuthContext.Provider value={{ user, setUser, loading, getMe, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
