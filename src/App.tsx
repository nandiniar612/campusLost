/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';
import { BrowsePage } from './pages/BrowsePage';
import { MatchNotificationsPage } from './pages/MatchNotificationsPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { ClaimModal } from './components/modals/ClaimModal';
import { PageView } from './types';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Shield,
  Search,
} from 'lucide-react';

const SCREENS_LIST: { id: PageView; label: string; num: string }[] = [
  { id: 'home', label: 'Home Page', num: '1' },
  { id: 'login', label: 'Login Page', num: '2' },
  { id: 'signup', label: 'Sign Up Page', num: '3' },
  { id: 'student-dashboard', label: 'Student Dashboard', num: '4' },
  { id: 'report-lost', label: 'Report Lost Item', num: '5' },
  { id: 'report-found', label: 'Report Found Item', num: '6' },
  { id: 'browse', label: 'Browse Items', num: '7' },
  { id: 'matches', label: 'Match Notifications', num: '8' },
  { id: 'item-details', label: 'Item Details Page', num: '9' },
  { id: 'about', label: 'About Page', num: '10' },
  { id: 'admin-dashboard', label: 'Admin Dashboard', num: '11' },
  { id: 'profile', label: 'Profile Page', num: '12' },
];

function AppContent() {
  const {
    currentView,
    setCurrentView,
    claimModalItem,
    setClaimModalItem,
    currentUser,
    switchDemoUser,
  } = useApp();

  const [navBarExpanded, setNavBarExpanded] = useState(false);

  // Render view matching current state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignUpPage />;
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'report-lost':
        return <ReportLostPage />;
      case 'report-found':
        return <ReportFoundPage />;
      case 'browse':
        return <BrowsePage />;
      case 'matches':
        return <MatchNotificationsPage />;
      case 'item-details':
        return <ItemDetailsPage />;
      case 'about':
        return <AboutPage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-slate-800">
      {renderCurrentView()}

      {/* Global Claim Modal */}
      {claimModalItem && (
        <ClaimModal
          item={claimModalItem}
          onClose={() => setClaimModalItem(null)}
        />
      )}

      {/* Bottom Floating Quick Navigator for 12 Screens from Mockup */}
      <div className="fixed bottom-4 right-4 z-50 print:hidden">
        {navBarExpanded ? (
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-slate-700/80 w-80 max-h-[85vh] overflow-y-auto space-y-3 animate-in fade-in slide-in-from-bottom-2">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  12 Mockup Pages
                </span>
              </div>
              <button
                onClick={() => setNavBarExpanded(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Role Switch */}
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Logged in as: <strong className="text-white">{currentUser?.name || 'Guest'}</strong> ({currentUser?.role || 'None'})
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => switchDemoUser('student')}
                  className="py-1 px-2 rounded-xl text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Student</span>
                </button>
                <button
                  onClick={() => switchDemoUser('admin')}
                  className="py-1 px-2 rounded-xl text-[11px] font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* 12 Pages List */}
            <div className="space-y-1">
              {SCREENS_LIST.map((screen) => {
                const isActive = currentView === screen.id;
                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      setCurrentView(screen.id);
                      setNavBarExpanded(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center text-slate-400">
                        {screen.num}
                      </span>
                      <span>{screen.label}</span>
                    </span>
                    {isActive && (
                      <span className="text-[10px] text-indigo-200">Active</span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        ) : (
          <button
            onClick={() => setNavBarExpanded(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-bold shadow-xl border border-slate-700/80 hover:border-indigo-500 transition-all hover:scale-105"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Screen Navigator ({SCREENS_LIST.find(s => s.id === currentView)?.num}/12)</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
