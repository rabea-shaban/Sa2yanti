export type UserRole = 'user' | 'technician' | 'admin' | 'super_admin';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  location?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}
