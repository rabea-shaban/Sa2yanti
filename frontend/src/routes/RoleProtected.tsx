import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import type { UserRole } from '../types/auth';

interface Props {
  allowedRoles: UserRole[];
}

export default function RoleProtected({ allowedRoles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
