import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageView } from '../../types';
import {
  LayoutDashboard,
  PlusCircle,
  PackageCheck,
  Search,
  Bell,
  User,
  LogOut,
  Layers,
  ChevronDown,
  ShieldCheck,
  Home,
  FileText,
  Info,
  ShieldAlert,
  Compass,
  Sparkles,
  X,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeView?: PageView;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, isAdmin: _isAdmin }) => {
  const {
    currentView,
    setCurrentView,
    logout,
    unreadCount,
    currentUser,
    switchDemoUser,
    sidebarMobileOpen,
    setSidebarMobileOpen
  } = useApp();

  const [expandedDirectory, setExpandedDirectory] = useState(false);

  const mainNavItems = [
    { view: 'student-dashboard' as PageView, label: 'Dashboard', icon: LayoutDashboard },
    { view: 'report-lost' as PageView, label: 'Report Lost', icon: PlusCircle },
    { view: 'report-found' as PageView, label: 'Report Found', icon: PackageCheck },
    { view: 'browse' as PageView, label: 'My Items', icon: Compass },
    { view: 'matches' as PageView, label: 'Possible Matches', icon: Sparkles },
    { view: 'profile' as PageView, label: 'Profile', icon: User },
  ];

  const fullPagesList: { view: PageView; label: string; number: number }[] = [
    { view: 'home', label: '1. Home Page', number: 1 },
    { view: 'login', label: '2. Login Page', number: 2 },
    { view: 'signup', label: '3. Sign Up Page', number: 3 },
    { view: 'student-dashboard', label: '4. Student Dashboard', number: 4 },
    { view: 'report-lost', label: '5. Report Lost Item', number: 5 },
    { view: 'report-found', label: '6. Report Found Item', number: 6 },
    { view: 'browse', label: '7. Browse Items', number: 7 },
    { view: 'matches', label: '8. Match Notifications', number: 8 },
    { view: 'item-details', label: '9. Item Details Page', number: 9 },
    { view: 'about', label: '10. About Page', number: 10 },
    { view: 'admin-dashboard', label: '11. Admin Dashboard', number: 11 },
    { view: 'profile', label: '12. Profile Page', number: 12 },
  ];

  const handleSelectView = (view: PageView) => {
    setCurrentView(view);
    setSidebarMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B192C] text-white">
      {/* Top Header / Logo */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div
          onClick={() => handleSelectView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/40 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">
              Campus<span className="text-indigo-400">Lost</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block -mt-1">
              Portal System
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
          Main Navigation
        </div>

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const currentActive = activeView || currentView;
          const isActive = currentActive === item.view;
          return (
            <button
              key={item.view}
              onClick={() => handleSelectView(item.view)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}

        {/* Notifications shortcut with unread badge */}
        <button
          onClick={() => handleSelectView('matches')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
            activeView === 'matches'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-slate-400" />
            <span>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Admin Dashboard Link if Admin */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => handleSelectView('admin-dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeView === 'admin-dashboard'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            <span>Admin Console</span>
          </button>
        )}

        {/* 12 Wireframe Pages Directory */}
        <div className="pt-4 mt-4 border-t border-white/10">
          <button
            onClick={() => setExpandedDirectory(!expandedDirectory)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>All 12 Wireframe Pages</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedDirectory ? 'rotate-180' : ''}`} />
          </button>

          {expandedDirectory && (
            <div className="mt-1 space-y-0.5 pl-2 max-h-56 overflow-y-auto">
              {fullPagesList.map((p) => (
                <button
                  key={p.view}
                  onClick={() => handleSelectView(p.view)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors truncate ${
                    activeView === p.view
                      ? 'text-indigo-300 font-bold bg-indigo-950/60'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Role Quick Switcher & User Profile */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-[#081220]">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Role Switch:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => switchDemoUser('student')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold text-center transition-all ${
                currentUser?.role === 'student'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => switchDemoUser('admin')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold text-center transition-all ${
                currentUser?.role === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Current User Card */}
        {currentUser && (
          <div className="flex items-center justify-between pt-1">
            <div
              onClick={() => handleSelectView('profile')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.regNo}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 lg:w-72 h-screen sticky top-0 flex-shrink-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {sidebarMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
