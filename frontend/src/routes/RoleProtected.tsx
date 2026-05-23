import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

type Props = { allowedRoles: string[] };

export default function RoleProtected({ allowedRoles }: Props) {
  const { user } = useAuth();
  return user && allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />;
}
