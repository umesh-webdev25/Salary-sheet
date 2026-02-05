import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  FileText,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Session terminated securelly.');
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'hr';

  const navigation = [
    {
      name: 'Overview',
      href: isAdmin ? '/admin/dashboard' : '/employee/dashboard',
      icon: LayoutDashboard
    },
    ...(isAdmin
      ? [
        { name: 'Workforce', href: '/employees', icon: Users },
        { name: 'Attendance', href: '/attendance', icon: Calendar },
        { name: 'Payroll', href: '/salary/generate', icon: Wallet },
      ]
      : []),
    { name: 'Documents', href: '/salary/sheets', icon: FileText },
    { name: 'My Profile', href: '/profile', icon: UserCircle },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] text-white p-6 shadow-2xl lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-3">
                <div className="bg-accent-500 p-2 rounded-xl">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black">PayScale Pro</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${isActive(item.href)
                      ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20'
                      : 'text-primary-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/5 mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-colors font-bold text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>Secure Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#020617] text-white transition-all duration-300 relative z-30 ${collapsed ? 'w-24' : 'w-72'
          }`}
      >
        <div className={`p-8 mb-4 transition-all duration-300 ${collapsed ? 'items-center' : ''}`}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-accent-500 p-2.5 rounded-2xl flex-shrink-0 animate-pulse-slow">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-black whitespace-nowrap tracking-tighter"
              >
                PayScale <span className="text-accent-400 font-light text-xl">Pro</span>
              </motion.span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center rounded-2xl transition-all font-black text-sm relative group overflow-hidden ${collapsed ? 'justify-center p-4' : 'px-5 py-4 space-x-4'
                } ${isActive(item.href)
                  ? 'bg-accent-500 text-white shadow-2xl shadow-accent-500/30'
                  : 'text-primary-500 hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && <span>{item.name}</span>}
              {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-black uppercase tracking-widest border border-white/10">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex items-center rounded-2xl text-primary-500 hover:bg-white/5 hover:text-white transition-all font-black text-sm w-full ${collapsed ? 'justify-center p-4' : 'px-5 py-4 space-x-4'
              }`}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5 text-accent-500" />}
            {!collapsed && <span>Collapse</span>}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all font-black text-sm w-full ${collapsed ? 'justify-center p-4' : 'px-5 py-4 space-x-4'
              }`}
          >
            <LogOut className="w-5 h-5 transform group-hover:-translate-x-1" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-primary-100 flex items-center justify-between px-8 flex-shrink-0 z-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 bg-primary-50 text-primary-600 rounded-xl lg:hidden hover:bg-primary-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-2xl border border-primary-100 focus-within:ring-2 focus-within:ring-accent-500/20 transition-all group">
              <Search className="w-4 h-4 text-primary-400 group-focus-within:text-accent-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="bg-transparent border-none text-sm font-bold text-primary-700 placeholder-primary-400 focus:ring-0 w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-2">
              <button className="p-2.5 text-primary-400 hover:text-accent-500 hover:bg-accent-50 transition-all rounded-xl relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            <div className="h-8 w-px bg-primary-100 mx-2 hidden sm:block"></div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-primary-900 tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-accent-600 font-black uppercase tracking-widest">{user?.role}</p>
              </div>
              <Link
                to="/profile"
                className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-accent-600 to-accent-400 p-0.5 shadow-lg shadow-accent-500/20 transform hover:rotate-6 transition-transform group active:scale-95"
              >
                <div className="h-full w-full bg-white rounded-[0.85rem] flex items-center justify-center overflow-hidden">
                  <span className="text-accent-600 font-black text-sm group-hover:scale-110 transition-transform">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-8 no-scrollbar scroll-smooth">
          <div className="max-w-[1400px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
