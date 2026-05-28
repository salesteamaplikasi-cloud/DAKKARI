import { useState, useCallback } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, FileDown, LogOut, Store } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  onLogout: () => void;
}

export default function DashboardLayout({ onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Form Data', icon: FileDown, path: '/data' },
  ];

  return (
    <div className="flex bg-gray-50/50 min-h-screen text-slate-900 font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col shadow-2xl lg:shadow-none lg:border-r lg:border-slate-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-indigo-950">Dakkari</h1>
              <p className="text-[10px] font-medium tracking-widest text-slate-500 uppercase">Purbalingga</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="p-2 lg:hidden text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 relative group",
                  isActive
                    ? "text-indigo-700 bg-indigo-50/80 shadow-sm shadow-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 z-0 bg-indigo-50 rounded-xl border border-indigo-100/50"
                    />
                  )}
                  <item.icon className={cn("w-5 h-5 z-10", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500 transition-colors")} />
                  <span className="z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="w-5 h-5 opacity-80" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content Arena */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-20 px-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60 lg:px-10 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-500 hover:text-indigo-600 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight capitalize hidden sm:block">
              {location.pathname === '/' ? 'Overview Dashboard' : 'Data Management'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
               <span className="text-sm font-semibold text-slate-800 tracking-tight">Admin Dakkari</span>
               <span className="text-xs font-medium text-slate-500">Purbalingga</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold tracking-wider shadow-md shadow-indigo-200 ring-2 ring-indigo-50">
               A
             </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 p-4 lg:p-10 overflow-auto bg-[#fafafa]">
          <div className="max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
