import { createBrowserRouter } from 'react-router-dom';

import Auth from '../pages/auth/Auth';
import Login from '../pages/auth/Login/Login';
import Register from '../pages/auth/register/Register';

import Home from '../pages/Home/page';
import Orders from '../pages/orders/page';
import ProtectedRoute from './ProtectedRoute';
import RoleProtected from './RoleProtected';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,

    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: 'about',
        element: <>About</>,
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
            path: 'technician-dashboard',
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
