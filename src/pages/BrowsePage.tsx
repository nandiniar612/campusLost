import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { ItemCard } from '../components/common/ItemCard';
import { ItemReport } from '../types';
import {
  Search,
  Filter,
  MapPin,
  Tag,
  ArrowUpDown,
  PlusCircle,
  PackageCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const {
    items,
    browseTab,
    setBrowseTab,
    categoryFilter,
    setCategoryFilter,
    locationFilter,
    setLocationFilter,
    searchQuery,
    setSearchQuery,
    setCurrentView
  } = useApp();

  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const categories = [
    'All',
    'Electronics',
    'Bags & Wallets',
    'Books & Stationery',
    'Clothing',
    'Accessories',
    'ID Cards',
    'Keys',
    'Others',
  ];

  const locations = [
    'All',
    'Central Library',
    'CSE Block',
    'Campus Cafeteria',
    'Block A',
    'Seminar Hall',
    'Security Booth',
  ];

  // Filtering
  const filteredItems = items
    .filter((item) => {
      if (browseTab === 'lost') return item.type === 'lost';
      if (browseTab === 'found') return item.type === 'found';
      return true;
    })
    .filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      return true;
    })
    .filter((item) => {
      if (locationFilter !== 'All' && !item.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      return true;
    })
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      <Sidebar activeView="browse" />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Browse Items"
          subtitle="Search and filter through all university lost reports and custody turn-ins."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          
          {/* Header Controls: Lost vs Found Tabs matching Screen 7 */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            
            {/* Top Row: Tabs & Reporting Shortcuts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Lost Items vs Found Items Tabs (Screen 7 wireframe) */}
              <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl w-fit">
                <button
                  onClick={() => setBrowseTab('lost')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    browseTab === 'lost'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-stone-600 hover:text-slate-900'
                  }`}
                >
                  Lost Items ({lostCount})
                </button>
                <button
                  onClick={() => setBrowseTab('found')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    browseTab === 'found'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-stone-600 hover:text-slate-900'
                  }`}
                >
                  Found Items ({foundCount})
                </button>
                <button
                  onClick={() => setBrowseTab('all')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    browseTab === 'all'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-stone-600 hover:text-slate-900'
                  }`}
                >
                  All ({items.length})
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('report-lost')}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Lost</span>
                </button>
                <button
                  onClick={() => setCurrentView('report-found')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Report Found</span>
                </button>
              </div>

            </div>

            {/* Filter Bar matching Screen 7 wireframe: Category, Location, Search, Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
              
              {/* Category Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 text-xs font-semibold text-slate-800 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Location Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 text-xs font-semibold text-slate-800 bg-white"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Search text filter */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Keyword Filter
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name or notes..."
                    className="w-full px-3 py-2 pl-8 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 text-xs font-medium text-slate-800"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Sort Order */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Sort By
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 text-xs font-semibold text-slate-800 bg-white"
                >
                  <option value="newest">Latest Reported</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

            </div>

          </div>

          {/* Items Gallery Grid matching Screen 7 */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No items match your active filters
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try clearing your search query or reset the location and category filters to view all records.
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('All');
                  setLocationFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
