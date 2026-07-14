import { useState } from 'react';
import { FaClipboardList, FaPlus, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="صيانتي" className="w-30  object-contain" />
        </Link>

        {/* Left Section (Desktop) */}
        <div className="hidden md:flex items-center gap-8">

          {/* Nav */}
          <nav className="flex items-center gap-6">

            {user?.role === 'user' && (
              <>
                <Link
                  to="/app"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  <FaPlus />
                  خدمة جديدة
                </Link>
                <Link
                  to="/nearby"
                  className="text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  أقرب مركز صيانة
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  طلباتي
                </Link>
              </>
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

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
              >
                <FaClipboardList />
                لوحة الإدارة
              </Link>
            )}

          </nav>

          {/* User */}
          <Link to="/profile" className="flex items-center gap-3 border-r border-gray-200 pr-6 hover:text-blue-600 transition cursor-pointer group">
            <div className="text-right">
              <h3 className="font-semibold text-sm text-slate-800 group-hover:text-blue-600 transition">{user?.name || 'مستخدم'}</h3>
              <p className="text-xs text-gray-500">{user?.email || 'user@email.com'}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition text-gray-505 group-hover:text-blue-600">
              <FaUserCircle className="text-3xl" />
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition duration-300"
          >
            <FaSignOutAlt />
            <span className="font-medium">خروج</span>
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-blue-600 focus:outline-none transition cursor-pointer"
        >
          {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg animate-in slide-in-from-top duration-200 py-4 px-6 space-y-4" dir="rtl">
          <nav className="flex flex-col gap-4 text-right">
            {user?.role === 'user' && (
              <>
                <Link
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-650 hover:text-blue-650 font-semibold transition py-2 border-b border-slate-50"
                >
                  <FaPlus className="text-xs text-slate-400" />
                  خدمة جديدة
                </Link>
                <Link
                  to="/nearby"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-650 hover:text-blue-655 font-semibold transition py-2 border-b border-slate-50"
                >
                  أقرب مركز صيانة
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-650 hover:text-blue-655 font-semibold transition py-2 border-b border-slate-50"
                >
                  طلباتي
                </Link>
              </>
            )}

            {user?.role === 'technician' && (
              <Link
                to="/technician"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-650 hover:text-blue-655 font-semibold transition py-2 border-b border-slate-50"
              >
                <FaClipboardList className="text-slate-400" />
                لوحة التحكم
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-655 hover:text-blue-655 font-semibold transition py-2 border-b border-slate-50"
              >
                <FaClipboardList className="text-slate-400" />
                لوحة الإدارة
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-blue-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <FaUserCircle className="text-2xl" />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-sm text-slate-800">{user?.name || 'مستخدم'}</h3>
                  <p className="text-[10px] text-gray-500 truncate max-w-[180px]">{user?.email || 'user@email.com'}</p>
                </div>
              </div>
              <span className="text-xs text-blue-600 font-bold">تعديل</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-bold transition duration-200 cursor-pointer"
            >
              <FaSignOutAlt />
              <span>خروج</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
