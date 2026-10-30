import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/layout/Sidebar';
import { GlobalSearchBar } from '../components/common/GlobalSearchBar';
import { ItemReport, ItemStatus } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  FileDown,
  Filter,
  Search,
  ExternalLink,
  Users,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    items,
    updateItemStatus,
    setCurrentView,
    currentUser,
    resolveItem,
    switchDemoUser,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | ItemStatus | 'Suspicious'>('All');
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<ItemReport | null>(null);

  // Metrics matching Screen 11
  const totalReportsCount = items.length;
  const pendingCount = items.filter((i) => i.status === 'Pending').length;
  const resolvedCount = items.filter((i) => i.status === 'Resolved').length;
  const usersCount = 32;

  const filteredItems = items.filter((item) => {
    if (statusFilter === 'Suspicious') return item.suspiciousFlag;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.reporterName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Title,Type,Category,Location,Date,Status,Reporter\n';
    const rows = items
      .map(
        (i) =>
          `"${i.id}","${i.title}","${i.type}","${i.category}","${i.location}","${i.displayDate}","${i.status}","${i.reporterName}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusLost_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans">
      <Sidebar isAdmin={true} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-stone-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-800 hidden sm:block">
              Campus Security Console
            </h1>
          </div>

          {/* Centralized Global Search in Admin Header */}
          <div className="flex-1 max-w-md mx-3">
            <GlobalSearchBar compact={true} placeholder="Global search across all reports..." />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export CSV</span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 text-xs font-semibold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Officer Sharma</span>
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-8">
          
          {/* Header Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Campus Lost and Found verification metrics and custody operations
            </p>
          </div>

          {/* 4 Stat Cards matching Screen 11 in wireframe */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            
            {/* 1: Total Reports (24) */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Total Reports
              </span>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                {totalReportsCount > 0 ? totalReportsCount : 24}
              </p>
              <span className="text-[10px] text-stone-400 mt-1 block">Active repository entries</span>
            </div>

            {/* 2: Pending (8) */}
            <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                Pending
              </span>
              <p className="text-3xl sm:text-4xl font-black text-amber-600 mt-2">
                {pendingCount > 0 ? pendingCount : 8}
              </p>
              <span className="text-[10px] text-amber-700/80 mt-1 block">Requires staff verification</span>
            </div>

            {/* 3: Resolved (14) */}
            <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Resolved
              </span>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 mt-2">
                {resolvedCount > 0 ? resolvedCount : 14}
              </p>
              <span className="text-[10px] text-emerald-700/80 mt-1 block">Successfully reunited</span>
            </div>

            {/* 4: Users (32) */}
            <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-xs">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
                Users
              </span>
              <p className="text-3xl sm:text-4xl font-black text-purple-600 mt-2">
                {usersCount}
              </p>
              <span className="text-[10px] text-purple-700/80 mt-1 block">Registered students & staff</span>
            </div>

          </div>

          {/* Table Management Container */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            
            {/* Table Header & Filters */}
            <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  Latest Reports
                </h3>
                <p className="text-xs text-stone-500">
                  Inspect, verify, approve, or resolve campus reports
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {(['All', 'Pending', 'Verified', 'Resolved', 'Suspicious'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Search filter within admin */}
            <div className="px-6 py-3 bg-stone-50 border-b border-stone-200/60 flex items-center gap-3">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Filter by report title, location or student name..."
                className="bg-transparent text-xs w-full focus:outline-hidden text-slate-800"
              />
            </div>

            {/* Latest Reports Table matching Screen 11 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200/80 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-6">Item</th>
                    <th className="py-3.5 px-6">Type</th>
                    <th className="py-3.5 px-6">Reported By</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-slate-700">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Item */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.photoUrl}
                            alt={item.title}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-stone-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{item.title}</span>
                            <span className="text-[10px] text-stone-400">{item.location}</span>
                            {item.suspiciousFlag && (
                              <span className="inline-block mt-0.5 text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                ⚠ Flagged Suspicious
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            item.type === 'lost'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>

                      {/* Reporter */}
                      <td className="py-3.5 px-6">
                        <span className="font-medium text-slate-800 block">{item.reporterName}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{item.reporterRegNo}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-6">
                        {item.status === 'Resolved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Resolved
                          </span>
                        )}
                        {item.status === 'In Progress' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800">
                            <Clock className="w-3 h-3" /> In Progress
                          </span>
                        )}
                        {item.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            <AlertCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
                        {item.status === 'Verified' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-6 text-stone-500 font-mono text-[11px]">
                        {item.displayDate}
                      </td>

                      {/* Admin Actions */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== 'Verified' && (
                            <button
                              onClick={() => updateItemStatus(item.id, 'Verified')}
                              className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                              title="Verify Report"
                            >
                              Approve
                            </button>
                          )}
                          {item.status !== 'Rejected' && item.status !== 'Resolved' && (
                            <button
                              onClick={() => updateItemStatus(item.id, 'Rejected')}
                              className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                              title="Reject Report"
                            >
                              Reject
                            </button>
                          )}
                          {item.status !== 'Resolved' && (
                            <button
                              onClick={() => resolveItem(item.id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                              title="Confirm Owner Received Item"
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            onClick={() => setCurrentView('item-details', item.id)}
                            className="p-1.5 text-stone-400 hover:text-slate-800 rounded-lg hover:bg-stone-100 cursor-pointer"
                            title="Inspect Full Listing"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Quick Notice Banner */}
          <div className="p-4 rounded-3xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>
                Authorized Administrator Role: Campus Security Desk Custodian
              </span>
            </div>
            <button
              onClick={() => switchDemoUser('student')}
              className="text-xs font-bold text-indigo-700 hover:underline"
            >
              Switch back to Student View →
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};
