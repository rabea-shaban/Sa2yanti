import { Navigate } from 'react-router-dom';
import ManLayout from '../components/layout/ManLayout';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  return token ? <ManLayout /> : <Navigate to="/auth/login" replace />;
}
