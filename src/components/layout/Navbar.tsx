import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageView } from '../../types';
import { GlobalSearchBar } from '../common/GlobalSearchBar';
import {
  Search,
  Menu,
  X,
  Layers,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  PackageCheck,
  Compass,
  Sparkles,
  FileText,
  Info,
  ShieldAlert,
  UserCheck,
  LogIn,
  UserPlus,
  Cloud
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    logout,
    setBrowseTab,
    isFirebaseConnected
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);

  const pagesList: { view: PageView; label: string; number: number; icon: React.ReactNode }[] = [
    { view: 'home', label: '1. Home Page', number: 1, icon: <Search className="w-3.5 h-3.5" /> },
    { view: 'login', label: '2. Login Page', number: 2, icon: <LogIn className="w-3.5 h-3.5" /> },
    { view: 'signup', label: '3. Sign Up Page', number: 3, icon: <UserPlus className="w-3.5 h-3.5" /> },
    { view: 'student-dashboard', label: '4. Student Dashboard', number: 4, icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { view: 'report-lost', label: '5. Report Lost Item', number: 5, icon: <PlusCircle className="w-3.5 h-3.5" /> },
    { view: 'report-found', label: '6. Report Found Item', number: 6, icon: <PackageCheck className="w-3.5 h-3.5" /> },
    { view: 'browse', label: '7. Browse Items', number: 7, icon: <Compass className="w-3.5 h-3.5" /> },
    { view: 'matches', label: '8. Match Notifications', number: 8, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { view: 'item-details', label: '9. Item Details Page', number: 9, icon: <FileText className="w-3.5 h-3.5" /> },
    { view: 'about', label: '10. About Page', number: 10, icon: <Info className="w-3.5 h-3.5" /> },
    { view: 'admin-dashboard', label: '11. Admin Dashboard', number: 11, icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { view: 'profile', label: '12. Profile Page', number: 12, icon: <UserCheck className="w-3.5 h-3.5" /> },
  ];

  const handleNavClick = (view: PageView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setPagesDropdownOpen(false);
  };

  const handleBrowseLost = () => {
    setBrowseTab('lost');
    setCurrentView('browse');
    setMobileMenuOpen(false);
  };

  const handleBrowseFound = () => {
    setBrowseTab('found');
    setCurrentView('browse');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Tagline */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#1B2A4A] to-[#2E4A7D] flex items-center justify-center text-white shadow-md shadow-indigo-950/20 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
                  Campus<span className="text-indigo-600">Lost</span>
                </span>
                {isFirebaseConnected && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200" title="Connected to Firebase Firestore & Auth">
                    <Cloud className="w-3 h-3 text-emerald-600 animate-pulse" />
                    Live Cloud
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-widest text-stone-500 uppercase block -mt-1">
                Find • Report • Reunite
              </span>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <GlobalSearchBar variant="header" className="w-full" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                currentView === 'home'
                  ? 'text-indigo-600 bg-indigo-50 font-bold'
                  : 'hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={handleBrowseLost}
              className={`px-3 py-2 rounded-xl transition-colors ${
                currentView === 'browse'
                  ? 'text-indigo-600 bg-indigo-50 font-bold'
                  : 'hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              Lost Items
            </button>

            <button
              onClick={handleBrowseFound}
              className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-stone-100 transition-colors"
            >
              Found Items
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                currentView === 'about'
                  ? 'text-indigo-600 bg-indigo-50 font-bold'
                  : 'hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              About
            </button>

            {/* 12-Page Portal Navigator Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPagesDropdownOpen(!pagesDropdownOpen)}
                className="px-3 py-2 rounded-xl hover:bg-stone-100 flex items-center gap-1 text-indigo-700 font-bold bg-indigo-50/60 border border-indigo-100 transition-colors"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>All 12 Pages</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${pagesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {pagesDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setPagesDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Reference Mockup Directory
                    </p>
                    <p className="text-[11px] text-stone-400">Direct access to all 12 wireframe screens</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto py-1">
                    {pagesList.map((p) => (
                      <button
                        key={p.view}
                        onClick={() => handleNavClick(p.view)}
                        className={`w-full px-4 py-2 text-left text-xs flex items-center gap-3 transition-colors ${
                          currentView === p.view
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'text-slate-700 hover:bg-stone-50 hover:text-indigo-600'
                        }`}
                      >
                        <span className="p-1.5 rounded-lg bg-stone-100 text-stone-600 group-hover:text-indigo-600">
                          {p.icon}
                        </span>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Auth CTA Buttons or User Pill */}
          <div className="hidden sm:flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-indigo-300 bg-white hover:bg-stone-50 transition-all text-xs font-bold text-slate-800 shadow-2xs"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-stone-200"
                  />
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full uppercase font-extrabold ${
                    currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {currentUser.role}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-stone-500 hover:text-rose-600 px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-[#1B2A4A] hover:bg-stone-100 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#1B2A4A] hover:bg-[#0B192C] shadow-md shadow-slate-900/10 active:scale-95 transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <GlobalSearchBar variant="compact" className="w-full" />

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleNavClick('home')}
              className="p-2.5 rounded-xl bg-stone-50 text-left hover:bg-indigo-50 hover:text-indigo-600"
            >
              Home
            </button>
            <button
              onClick={handleBrowseLost}
              className="p-2.5 rounded-xl bg-stone-50 text-left hover:bg-indigo-50 hover:text-indigo-600"
            >
              Lost Items
            </button>
            <button
              onClick={handleBrowseFound}
              className="p-2.5 rounded-xl bg-stone-50 text-left hover:bg-indigo-50 hover:text-indigo-600"
            >
              Found Items
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="p-2.5 rounded-xl bg-stone-50 text-left hover:bg-indigo-50 hover:text-indigo-600"
            >
              About
            </button>
          </div>

          {/* Mobile 12-Screen Directory */}
          <div className="pt-2 border-t border-stone-100">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              All 12 Wireframe Pages
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {pagesList.map((p) => (
                <button
                  key={p.view}
                  onClick={() => handleNavClick(p.view)}
                  className={`p-2 rounded-lg text-left text-xs flex items-center gap-2 ${
                    currentView === p.view
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-stone-50 text-slate-700 hover:bg-stone-100'
                  }`}
                >
                  {p.icon}
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Auth Button */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-800">
                  Logged in as {currentUser.name}
                </span>
                <button
                  onClick={logout}
                  className="text-xs font-bold text-rose-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-xl border border-stone-300 text-slate-800"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-[#1B2A4A] text-white"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
