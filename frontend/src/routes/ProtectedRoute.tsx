import { Navigate } from 'react-router-dom';
import ManLayout from '../components/layout/ManLayout';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return user ? <ManLayout /> : <Navigate to="/auth/login" replace />;
}
