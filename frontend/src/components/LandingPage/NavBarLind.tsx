import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const roleLabels: Record<string, string> = {
  user: 'عميل',
  technician: 'فني',
  admin: 'مدير',
};

const NavBarLind = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'الخدمات', href: '#services' },
    { name: 'كيف يعمل', href: '#how-it-works' },
    { name: 'تواصل معنا', href: '#contact' },
  ];

  const roleNavItems = {
    user: [
      { name: 'طلب خدمة', to: '/app' },
      { name: 'طلباتي', to: '/orders' },
    ],
    technician: [{ name: 'طلبات الصيانة', to: '/technician' }],
    admin: [
      { name: 'لوحة التحكم', to: '/admin' },
      { name: 'إدارة المستخدمين', to: '/admin/users' },
    ],
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="صيانتك" className="w-28 object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-slate-600 hover:text-[#EE5A0E] font-bold transition-colors text-sm"
              >
                {item.name}
              </a>
            ))}

            {user &&
              roleNavItems[role as keyof typeof roleNavItems]?.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-slate-600 hover:text-[#EE5A0E] font-bold transition-colors text-sm"
                >
                  {item.name}
                </Link>
              ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F0F5FA] border border-slate-100 rounded-xl">
                  <div className="w-8 h-8 bg-[#00274C] rounded-full flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
                    {user.name?.charAt(0)}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-[#EE5A0E] font-bold mt-1">
                      {roleLabels[user.role] ?? user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-rose-500 font-bold transition-colors text-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  خروج
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-slate-600 hover:text-[#EE5A0E] font-bold transition-colors text-sm cursor-pointer"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 bg-[#00274C] hover:bg-[#001C38] text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm cursor-pointer"
                >
                  إنشاء حساب
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-4 text-right">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-600 hover:text-[#EE5A0E] font-bold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {user &&
                roleNavItems[role as keyof typeof roleNavItems]?.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-600 hover:text-[#EE5A0E] font-bold transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-2 py-1">
                      <div className="w-8 h-8 bg-[#00274C] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user.name?.charAt(0)}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-[#EE5A0E] font-bold">
                          {roleLabels[user.role] ?? user.role}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-2 py-2 text-rose-500 font-bold transition-colors text-right cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-5 py-2 text-slate-600 hover:text-[#EE5A0E] font-bold transition-colors text-right cursor-pointer"
                    >
                      تسجيل الدخول
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-5 py-2.5 bg-[#00274C] hover:bg-[#001C38] text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-center cursor-pointer"
                    >
                      إنشاء حساب
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarLind;
