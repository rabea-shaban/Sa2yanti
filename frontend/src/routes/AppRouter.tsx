import { createBrowserRouter, Navigate } from 'react-router-dom';

import Auth from '../pages/auth/Auth';
import Login from '../pages/auth/Login/Login';
import Register from '../pages/auth/register/Register';

import LandingPage from '../components/LandingPage/LandingPage';
import ServiceRequest from '../components/ui/ServiceRequest';
import Home from '../pages/Home/page';
import Orders from '../pages/orders/page';
import ProtectedRoute from './ProtectedRoute';
import RoleProtected from './RoleProtected';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },

  {
    path: '/login',
    element: <Navigate to="/auth/login" replace />,
  },

  {
    path: '/register',
    element: <Navigate to="/auth/register" replace />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },

      {
        path: 'app',
        element: <ServiceRequest />,
      },

      {
        path: 'orders',
        element: <Orders />,
      },

      {
        element: <RoleProtected allowedRoles={['user', 'admin']} />,
        children: [
          {
            path: 'user-dashboard',
            element: <>User Dashboard</>,
          },
        ],
      },

      {
        element: <RoleProtected allowedRoles={['technician', 'admin']} />,
        children: [
          {
            path: 'technician',
            element: <>Technician Dashboard</>,
          },
        ],
      },
    ],
  },

  {
    path: '/auth',
    element: <Auth />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },

  {
    path: '*',
    element: <>NotFound</>,
  },
]);

export default AppRouter;
