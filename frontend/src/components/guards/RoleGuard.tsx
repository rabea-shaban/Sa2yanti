import useAuth from '../../hooks/useAuth';
import type { UserRole } from '../../types/auth';

interface RoleGuardProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) return <>{fallback}</>;

  return <>{children}</>;
}
