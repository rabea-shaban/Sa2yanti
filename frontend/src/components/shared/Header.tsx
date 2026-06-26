import { FaClipboardList, FaSignOutAlt, FaTools, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
        {/* Logo */}

        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
            <FaTools className="text-white text-lg" />
          </div>

          <h1 className="font-extrabold text-4xl text-slate-900">صيانتي</h1>
        </Link>

        {/* Left Section */}

        <div className="flex items-center gap-8">
          {/* Nav */}

          <nav className="flex items-center gap-6">
            {user?.role === 'user' && (
              <Link
                to="/orders"
                className="text-gray-600 hover:text-blue-600 font-medium transition"
              >
                طلباتي
              </Link>
            )}

            {user?.role === 'technician' && (
              <Link
                to="/technician"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
              >
                <FaClipboardList />
                لوحة التحكم
              </Link>
            )}
          </nav>

          {/* User */}

          <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
            <div className="text-right">
              <h3 className="font-semibold text-sm text-slate-800">{user?.name || 'مستخدم'}</h3>

              <p className="text-xs text-gray-500">{user?.email || 'user@email.com'}</p>
            </div>

            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
              <FaUserCircle className="text-3xl text-gray-500" />
            </div>
          </div>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition duration-300"
          >
            <FaSignOutAlt />

            <span className="font-medium">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}
