import { RouterProvider } from 'react-router-dom';
import AuthProvider from './components/context/AuthContext';
import AppRouter from './routes/AppRouter';
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={AppRouter} />
    </AuthProvider>
  );
}

export default App;
