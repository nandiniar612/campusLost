import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import {
  FileText,
  Sparkles,
  Bell,
  ArrowRight,
  PlusCircle,
  PackageCheck,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Tag
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    items,
    matches,
    notifications,
    setCurrentView,
    setBrowseTab,
    unreadCount,
    resolveItem,
  } = useApp();

  const [activityTab, setActivityTab] = useState<'all' | 'lost' | 'found'>('all');

  const userReports = items.filter(
    (i) => i.reporterId === currentUser?.id || i.reporterName === currentUser?.name
  );

  const filteredReports = userReports.filter((i) => {
    if (activityTab === 'lost') return i.type === 'lost';
    if (activityTab === 'found') return i.type === 'found';
    return true;
  });

  const myMatches = matches.filter(
    (m) =>
      m.lostItem.reporterId === currentUser?.id ||
      m.lostItem.reporterName === currentUser?.name ||
      m.foundItem.reporterId === currentUser?.id ||
      m.foundItem.reporterName === currentUser?.name
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Sidebar */}
      <Sidebar activeView="student-dashboard" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Student Dashboard"
          subtitle="Manage your lost reports, custody turn-ins, and match notifications."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 max-w-7xl mx-auto w-full">
          
          {/* Welcome Banner matching Screen 4 */}
          <div className="bg-gradient-to-r from-white to-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Hello, {currentUser?.name || 'Student'}! 👋
              </h2>
              <p className="text-sm text-stone-500 font-medium">
                Here's what's happening with your reported items across campus.
              </p>
            </div>

            {/* Quick shortcuts */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setCurrentView('report-lost')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Lost</span>
              </button>
              <button
                onClick={() => setCurrentView('report-found')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Report Found</span>
              </button>
              <button
                onClick={() => {
                  setBrowseTab('all');
                  setCurrentView('browse');
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-stone-500" />
                <span>Browse All</span>
              </button>
            </div>
          </div>

          {/* 3 Metric Cards matching Screen 4 wireframe */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Metric 1: My Reports */}
            <div
              onClick={() => setCurrentView('profile')}
              className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  My Reports
                </span>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  {userReports.length}
                </span>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Active lost & found submissions
              </p>
            </div>

            {/* Metric 2: Matches */}
            <div
              onClick={() => setCurrentView('matches')}
              className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Possible Matches
                </span>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-4xl font-black text-indigo-600 tracking-tight">
                  {myMatches.length}
                </span>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                  Inspect <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                AI cross-referenced correlations
              </p>
            </div>

            {/* Metric 3: Notifications */}
            <div
              onClick={() => setCurrentView('matches')}
              className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Unread Alerts
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-4xl font-black text-amber-600 tracking-tight">
                  {unreadCount}
                </span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                  View feed <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Custody status updates & verifications
              </p>
            </div>

          </div>

          {/* Recent Activity Table Section matching Screen 4 */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Recent Activity
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time status of your submissions on campus
                </p>
              </div>

              {/* Table Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActivityTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activityTab === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-stone-500 hover:text-slate-900'
                  }`}
                >
                  All ({userReports.length})
                </button>
                <button
                  onClick={() => setActivityTab('lost')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activityTab === 'lost'
                      ? 'bg-white text-rose-700 shadow-2xs'
                      : 'text-stone-500 hover:text-slate-900'
                  }`}
                >
                  Lost
                </button>
                <button
                  onClick={() => setActivityTab('found')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activityTab === 'found'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-stone-500 hover:text-slate-900'
                  }`}
                >
                  Found
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-6">Item Name</th>
                    <th className="py-3 px-6">Location</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-stone-50/60 transition-colors group"
                      >
                        {/* Type */}
                        <td className="py-3.5 px-6 font-bold">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              report.type === 'lost'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {report.type}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={report.photoUrl || report.image}
                              alt={report.title}
                              className="w-9 h-9 rounded-lg object-cover border border-stone-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                                {report.title}
                              </p>
                              <span className="text-[11px] text-stone-400">
                                {report.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-6 text-stone-600 max-w-xs truncate">
                          {report.location}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-6">
                          {report.status === 'Resolved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
                            </span>
                          )}
                          {report.status === 'In Progress' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3 text-amber-600" /> In Progress
                            </span>
                          )}
                          {report.status === 'Pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                              <Clock className="w-3 h-3 text-blue-600" /> Pending
                            </span>
                          )}
                          {report.status === 'Rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-6 text-stone-500 whitespace-nowrap">
                          {report.date}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-6 text-right space-x-2">
                          <button
                            onClick={() => setCurrentView('item-details', report.id)}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold transition-colors"
                          >
                            View
                          </button>
                          {report.status !== 'Resolved' && (
                            <button
                              onClick={() => resolveItem(report.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold transition-colors"
                              title="Mark as Reunited"
                            >
                              Mark Reunited
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-stone-400">
                        No submissions recorded under this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Showing {filteredReports.length} of {userReports.length} reports</span>
              <button
                onClick={() => setCurrentView('browse')}
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Browse Campus Listings →
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
