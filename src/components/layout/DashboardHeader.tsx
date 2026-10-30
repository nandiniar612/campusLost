import React from 'react';
import { useApp } from '../../context/AppContext';
import { GlobalSearchBar } from '../common/GlobalSearchBar';
import { Menu, Bell, Sparkles, Cloud } from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
}) => {
  const {
    currentUser,
    unreadCount,
    setCurrentView,
    setSidebarMobileOpen,
    isFirebaseConnected,
  } = useApp();

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarMobileOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-stone-100 transition-colors"
          aria-label="Open portal navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title ? (
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {title}
              {isFirebaseConnected && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200" title="Connected to Firebase Firestore & Auth">
                  <Cloud className="w-3 h-3 text-emerald-600 animate-pulse" />
                  Synced
                </span>
              )}
            </h1>
            {subtitle && (
              <p className="text-xs text-stone-500 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-slate-900">
              Welcome, {currentUser?.name?.split(' ')[0] || 'Student'}!
            </span>
            <p className="text-xs text-stone-500">
              Here's what's happening on campus today.
            </p>
          </div>
        )}
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden sm:block">
        <GlobalSearchBar variant="header" className="w-full" />
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Notifications Icon with Badge */}
        <button
          onClick={() => setCurrentView('matches')}
          className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-stone-100 transition-colors"
          title="Match Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Pill */}
        {currentUser && (
          <div
            onClick={() => setCurrentView('profile')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-stone-100 cursor-pointer transition-colors border border-stone-200 bg-white"
          >
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-stone-300"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-stone-500 leading-tight capitalize">
                {currentUser.role} • {currentUser.regNo}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
