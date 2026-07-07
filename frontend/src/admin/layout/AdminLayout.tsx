import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  Users,
  Wrench,
  ShoppingBag,
  Settings as SettingsIcon,
  BarChart3,
  ListCollapse,
  Menu,
  X,
  LogOut,
  FolderOpen,
  UserCheck2,
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
    >
      <span className="transition-transform duration-200 group-hover:scale-110">{icon}</span>
      <span className="font-semibold text-sm">{label}</span>
    </NavLink>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('admin-theme') as 'dark' | 'light') || 'dark'
  );

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('admin-theme', nextTheme);
  };

  const navigation = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'لوحة التحكم' },
    { to: '/admin/users', icon: <Users size={18} />, label: 'إدارة العملاء' },
    { to: '/admin/technicians', icon: <Wrench size={18} />, label: 'إدارة الفنيين' },
    { to: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'إدارة الطلبات' },
    { to: '/admin/services', icon: <ListCollapse size={18} />, label: 'إدارة الخدمات' },
    { to: '/admin/categories', icon: <FolderOpen size={18} />, label: 'إدارة فئات الصيانة' },
    { to: '/admin/statistics', icon: <BarChart3 size={18} />, label: 'الإحصائيات والتقارير' },
    { to: '/admin/settings', icon: <SettingsIcon size={18} />, label: 'الإعدادات العامة' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'admin-dark bg-black text-slate-100' : 'admin-light bg-slate-50 text-slate-900'} flex font-sans transition-colors duration-200`} dir="rtl">
      {/* 1. Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-l border-slate-800 bg-slate-900 shrink-0">
        <div className="h-16 flex items-center justify-center px-6 border-b border-slate-800">
          <img src={theme === 'light' ? '/logo.png' : '/logoWhite.png'} alt="صيانتي" className="w-20 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => (
            <SidebarLink key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-10 h-10 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UserCheck2 size={18} />
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{admin?.name}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* 2. Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Mobile drawer) */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-64 bg-slate-900 border-l border-slate-850 flex flex-col transition-transform duration-300 transform lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between w-full px-6 border-b border-slate-800">
          <img src={theme === 'light' ? '/logo.png' : '/logoWhite.png'} alt="صيانتي" className="w-20 object-contain" />
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => (
            <SidebarLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-10 h-10 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UserCheck2 size={18} />
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{admin?.name}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setMobileOpen(false);
              logout();
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* 3. Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white focus:outline-none"
            >
              <Menu size={20} />
            </button>
            <div className="text-sm font-medium text-slate-400 hidden sm:block">
              لوحة التحكم الإدارية للنظام
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white transition cursor-pointer flex items-center justify-center border border-slate-800/40 text-sm"
              title={theme === 'dark' ? 'الوضع المضيء' : 'الوضع المظلم'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 tracking-wider">النظام نشط</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-sm font-semibold text-slate-200">
              مرحباً، <span className="text-indigo-400">{admin?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
