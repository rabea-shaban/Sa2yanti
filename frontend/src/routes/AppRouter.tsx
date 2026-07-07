import { createBrowserRouter, Navigate } from 'react-router-dom';

import Auth from '../pages/auth/Auth';
import Login from '../pages/auth/Login/Login';
import Register from '../pages/auth/register/Register';

import LandingPage from '../components/LandingPage/LandingPage';
import TechnicianDashboard from '../components/technician/TechnicianDashboard';
import ServiceRequest from '../components/ui/ServiceRequest';
import Orders from '../pages/orders/page';
import NearbyCentersPage from '../pages/nearby/NearbyCentersPage';
import TechnicianDetailsPage from '../pages/nearby/TechnicianDetailsPage';
import Unauthorized from '../pages/Unauthorized';
import ProtectedRoute from './ProtectedRoute';
import RoleProtected from './RoleProtected';

// Super Admin components
import { AdminAuthProvider } from '../admin/context/AdminAuthContext';
import AdminProtectedRoute from '../admin/routes/AdminProtectedRoute';
import AdminLogin from '../admin/pages/Login/Login';
import AdminDashboard from '../admin/pages/Dashboard/Dashboard';
import AdminUsers from '../admin/pages/Users/Users';
import AdminTechnicians from '../admin/pages/Technicians/Technicians';
import AdminOrders from '../admin/pages/Orders/Orders';
import AdminServices from '../admin/pages/Services/Services';
import AdminCategories from '../admin/pages/Categories/Categories';
import AdminStatistics from '../admin/pages/Statistics/Statistics';
import AdminSettings from '../admin/pages/Settings/Settings';

import Profile from '../pages/profile/Profile';

const AppRouter = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '/login', element: <Navigate to="/auth/login" replace /> },
  { path: '/register', element: <Navigate to="/auth/register" replace /> },

  {
    element: <ProtectedRoute />,
    children: [
      { path: 'profile', element: <Profile /> },
      
      // user + admin
      {
        element: <RoleProtected allowedRoles={['user', 'admin']} />,
        children: [
          { path: 'app', element: <ServiceRequest /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/create', element: <ServiceRequest /> },
          { path: 'nearby', element: <NearbyCentersPage /> },
          { path: 'technicians/:id', element: <TechnicianDetailsPage /> },
        ],
      },

      // technician + admin
      {
        element: <RoleProtected allowedRoles={['technician', 'admin']} />,
        children: [
          { path: 'technician', element: <TechnicianDashboard /> },
          { path: 'technician/orders', element: <TechnicianDashboard /> },
        ],
      },
    ],
  },

  {
    path: '/auth',
    element: <Auth />,
    children: [
      { index: true, element: <Login /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },

  // Super Admin Routes
  {
    path: '/admin',
    element: (
      <AdminAuthProvider>
        <AdminProtectedRoute />
      </AdminAuthProvider>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'technicians', element: <AdminTechnicians /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'statistics', element: <AdminStatistics /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <AdminAuthProvider>
        <AdminLogin />
      </AdminAuthProvider>
    ),
  },

  { path: '*', element: <Navigate to="/unauthorized" replace /> },
]);

export default AppRouter;
