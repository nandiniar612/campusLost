import React from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlobalSearchBar } from '../components/common/GlobalSearchBar';
import { ItemCard } from '../components/common/ItemCard';
import {
  Search,
  PlusCircle,
  PackageCheck,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  Heart
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setCurrentView, items, setBrowseTab } = useApp();

  const recentItems = items.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section matching Screen 1 */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading, description, and hero search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Centralized Smart Lost & Found Portal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B192C] tracking-tight leading-[1.1]">
                Lost Something?<br />
                <span className="text-indigo-600">Found Something?</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                CampusLost helps university students, faculty, and security personnel report misplaced items, search active listings, and automatically reunite belongings with Gemini-powered matching.
              </p>

              {/* Centralized Search Bar directly in Hero */}
              <div className="max-w-xl mx-auto lg:mx-0 pt-2">
                <GlobalSearchBar
                  variant="hero"
                  placeholder="Search by item name, category or location (e.g. Wallet, AirPods, Library)..."
                />
              </div>

              {/* Stats Bar */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-xs text-stone-500 font-semibold border-t border-stone-200/80 max-w-lg">
                <div>
                  <span className="block text-xl font-black text-slate-900">{items.length}+</span>
                  <span>Active Listings</span>
                </div>
                <div>
                  <span className="block text-xl font-black text-emerald-600">92%</span>
                  <span>Reunited Rate</span>
                </div>
                <div>
                  <span className="block text-xl font-black text-indigo-600">3 Min</span>
                  <span>Average Report Time</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hand-drawn Campus Building Sketch (matching Screen 1 illustration) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-stone-200/80 text-center">
                
                {/* SVG Illustration resembling the architectural campus sketch */}
                <svg
                  viewBox="0 0 300 220"
                  className="w-full h-auto text-slate-800"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Sky & clouds */}
                  <path d="M 30 40 Q 40 30 55 35 Q 70 30 80 42 Q 85 45 30 45" stroke="#94A3B8" strokeWidth="1.5" />
                  <path d="M 220 35 Q 230 25 245 30 Q 255 25 265 37 Q 270 40 220 40" stroke="#94A3B8" strokeWidth="1.5" />

                  {/* Campus Main Academic Hall / Tower */}
                  {/* Triangular Pediment */}
                  <polygon points="150,20 80,70 220,70" fill="#EEF2F6" />
                  <circle cx="150" cy="50" r="10" stroke="#4F46E5" fill="#FFFFFF" />
                  
                  {/* Columns & Base */}
                  <rect x="85" y="70" width="130" height="95" fill="#F8FAFC" />
                  <line x1="105" y1="70" x2="105" y2="165" strokeWidth="3" />
                  <line x1="135" y1="70" x2="135" y2="165" strokeWidth="3" />
                  <line x1="165" y1="70" x2="165" y2="165" strokeWidth="3" />
                  <line x1="195" y1="70" x2="195" y2="165" strokeWidth="3" />

                  {/* Main arched entry door */}
                  <path d="M 135 165 V 125 A 15 15 0 0 1 165 125 V 165 Z" fill="#1E293B" />

                  {/* Side Wings */}
                  <rect x="25" y="90" width="60" height="75" fill="#F1F5F9" />
                  <rect x="215" y="90" width="60" height="75" fill="#F1F5F9" />

                  {/* Windows in side wings */}
                  <rect x="35" y="105" width="15" height="20" fill="#CBD5E1" />
                  <rect x="60" y="105" width="15" height="20" fill="#CBD5E1" />
                  <rect x="35" y="135" width="15" height="20" fill="#CBD5E1" />
                  <rect x="60" y="135" width="15" height="20" fill="#CBD5E1" />

                  <rect x="225" y="105" width="15" height="20" fill="#CBD5E1" />
                  <rect x="250" y="105" width="15" height="20" fill="#CBD5E1" />
                  <rect x="225" y="135" width="15" height="20" fill="#CBD5E1" />
                  <rect x="250" y="135" width="15" height="20" fill="#CBD5E1" />

                  {/* Ground line & steps */}
                  <line x1="10" y1="165" x2="290" y2="165" strokeWidth="3" />
                  <line x1="60" y1="172" x2="240" y2="172" strokeWidth="2" />
                  <line x1="80" y1="178" x2="220" y2="178" strokeWidth="2" />

                  {/* Trees on sides */}
                  <path d="M 15 165 C 10 145 20 130 30 140 C 35 125 50 130 45 150 C 48 160 35 165 15 165" fill="#86EFAC" stroke="#16A34A" />
                  <path d="M 285 165 C 290 145 280 130 270 140 C 265 125 250 130 255 150 C 252 160 265 165 285 165" fill="#86EFAC" stroke="#16A34A" />
                </svg>

                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold">
                  <span>Central University Campus</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Safe Portal
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Primary Action Cards Section (from Screen 1 mockup) */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              What would you like to do?
            </h2>
            <p className="text-sm text-stone-500 mt-2">
              Select one of the primary student actions below
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Report Lost Item */}
            <div
              onClick={() => setCurrentView('report-lost')}
              className="group p-6 rounded-3xl bg-[#FDFBF7] border-2 border-stone-200 hover:border-indigo-600 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-md">
                  <Search className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Report Lost Item
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                    Tell us what you lost. Describe identifying marks, category, and last-seen zone.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <span>File Lost Report</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Card 2: Report Found Item */}
            <div
              onClick={() => setCurrentView('report-found')}
              className="group p-6 rounded-3xl bg-[#FDFBF7] border-2 border-stone-200 hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-md">
                  <PackageCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Report Found Item
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                    Help someone get it back. Hand over to security desk or turn it in with photos.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>Hand In Belonging</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Card 3: Browse Items */}
            <div
              onClick={() => {
                setBrowseTab('all');
                setCurrentView('browse');
              }}
              className="group p-6 rounded-3xl bg-[#FDFBF7] border-2 border-stone-200 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <Compass className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    Browse Items
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                    Find lost & found items. Filter by categories, dates, campus blocks, or statuses.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>View Campus Catalog</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Card 4: Track Matching */}
            <div
              onClick={() => setCurrentView('matches')}
              className="group p-6 rounded-3xl bg-[#FDFBF7] border-2 border-stone-200 hover:border-purple-600 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                    Track Matching
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                    Get notified. Smart AI compares lost details against found reports automatically.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                <span>Inspect Matches</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Recently Reported Items Section */}
      <section className="py-12 lg:py-16 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Recently Reported Items
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Latest submissions across campus blocks in real-time
              </p>
            </div>

            <button
              onClick={() => setCurrentView('browse')}
              className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-800 text-xs font-bold transition-all shadow-2xs hover:border-indigo-400"
            >
              View All {items.length} Reports
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
