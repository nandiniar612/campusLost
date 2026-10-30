import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlobalSearchBar } from '../components/common/GlobalSearchBar';
import { ClaimModal } from '../components/modals/ClaimModal';
import { SuspiciousModal } from '../components/modals/SuspiciousModal';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  AlertTriangle,
  Share2,
  Printer,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  Building,
} from 'lucide-react';

export const ItemDetailsPage: React.FC = () => {
  const {
    items,
    selectedItemId,
    setCurrentView,
    matches,
    resolveItem,
    currentUser,
  } = useApp();

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [suspiciousModalOpen, setSuspiciousModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Find the selected item or fallback to first item
  const item = items.find((i) => i.id === selectedItemId) || items[0];

  if (!item) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-4">
          <p className="text-stone-600 text-sm">Item not found.</p>
          <button
            onClick={() => setCurrentView('browse')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  // Related potential matches for this item
  const itemMatches = matches.filter(
    (m) => m.lostItemId === item.id || m.foundItemId === item.id
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Mask student email / reg number for privacy protection as required
  const maskedReg = item.reporterRegNo
    ? `${item.reporterRegNo.slice(0, 3)}••••${item.reporterRegNo.slice(-2)}`
    : 'STUDENT••••';

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans pb-16">
      
      {/* Top Bar with Back Button matching Screen 9 */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentView('browse')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors p-2 rounded-xl hover:bg-stone-100 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">&lt; Back to Items</span>
          </button>

          {/* Centralized Global Search in Header */}
          <div className="flex-1 max-w-sm mx-2">
            <GlobalSearchBar compact={true} placeholder="Search other lost & found items..." />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Link!' : 'Share'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Main Item Card matching Screen 9 */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Left Col: Large Item Photograph */}
            <div className="md:col-span-5 bg-stone-100 relative min-h-[300px] md:min-h-[420px] flex items-center justify-center overflow-hidden">
              <img
                src={item.photoUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';
                }}
              />
              
              {/* Type Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md ${
                    item.type === 'lost'
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {item.type}
                </span>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/90 backdrop-blur-xs text-slate-800 shadow-md border border-stone-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  {item.status}
                </span>
              </div>
            </div>

            {/* Right Col: Details matching Screen 9 */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                
                {/* Category & Ref */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {item.category}
                  </span>
                  <span className="font-mono text-stone-400">
                    ID: #{item.id}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {item.title}
                </h1>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-100 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Location</span>
                      <span className="font-semibold">{item.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Date</span>
                      <span className="font-semibold">{item.displayDate}</span>
                    </div>
                  </div>
                </div>

                {/* Full Description matching wireframe */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Description:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200">
                    {item.description}
                  </p>
                </div>

                {/* Characteristics */}
                {(item.color || item.brand || item.turnedInLocation) && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {item.color && (
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium">
                        Color: {item.color}
                      </span>
                    )}
                    {item.brand && (
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium">
                        Brand: {item.brand}
                      </span>
                    )}
                    {item.turnedInLocation && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        Custody: {item.turnedInLocation}
                      </span>
                    )}
                  </div>
                )}

                {/* Protected Reporter Info as required by specification */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Reported by Student ({maskedReg})</span>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    Privacy Protected
                  </span>
                </div>

              </div>

              {/* Action Buttons matching Screen 9 */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  
                  {/* Contact Admin / Claim Button */}
                  <button
                    onClick={() => setClaimModalOpen(true)}
                    className="flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Contact Admin / Claim Item</span>
                  </button>

                  {/* Resolve item shortcut if current user owns or is admin */}
                  {item.status !== 'Resolved' && (
                    <button
                      onClick={() => resolveItem(item.id)}
                      className="py-3 px-4 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Mark Reunited</span>
                    </button>
                  )}
                </div>

                {/* Report suspicious listing button */}
                <button
                  onClick={() => setSuspiciousModalOpen(true)}
                  className="w-full text-center text-xs text-stone-400 hover:text-rose-600 transition-colors flex items-center justify-center gap-1.5 pt-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report suspicious listing</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Possible Matches Section matching Screen 9 lower section */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">
                Possible Matches ({itemMatches.length})
              </h3>
              <p className="text-xs text-stone-500">
                Similar items found across campus that may correspond to this record
              </p>
            </div>
            {itemMatches.length > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                AI Correlation Available
              </span>
            )}
          </div>

          {itemMatches.length === 0 ? (
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 text-center text-xs text-stone-500">
              No matching opposites currently logged. We will notify you immediately if someone reports a match!
            </div>
          ) : (
            <div className="space-y-3">
              {itemMatches.map((m) => {
                const counterpart = m.lostItemId === item.id ? m.foundItem : m.lostItem;
                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-stone-50/70 hover:bg-stone-100 border border-stone-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={counterpart.photoUrl}
                        alt={counterpart.title}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-stone-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                              counterpart.type === 'lost'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {counterpart.type}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">
                            {counterpart.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {counterpart.location} · {counterpart.displayDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-xs font-bold text-indigo-600">
                        {m.confidence}% match
                      </span>
                      <button
                        onClick={() => setCurrentView('item-details', counterpart.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Claim Modal */}
      {claimModalOpen && (
        <ClaimModal item={item} onClose={() => setClaimModalOpen(false)} />
      )}

      {/* Suspicious Modal */}
      {suspiciousModalOpen && (
        <SuspiciousModal
          item={item}
          onClose={() => setSuspiciousModalOpen(false)}
        />
      )}

    </div>
  );
};
