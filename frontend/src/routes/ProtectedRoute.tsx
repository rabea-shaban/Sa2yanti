import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ManLayout from '../components/layout/ManLayout';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">جاري التحقق من الهوية...</p>
        </div>
      </div>
    );
  }

  return user ? <ManLayout /> : <Navigate to="/auth/login" replace />;
}
