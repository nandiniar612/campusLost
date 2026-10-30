import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { ItemMatch } from '../types';
import { AiAnalysisModal } from '../components/modals/AiAnalysisModal';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Calendar,
  MapPin,
} from 'lucide-react';

export const MatchNotificationsPage: React.FC = () => {
  const {
    matches,
    markMatchNotAMatch,
    setCurrentView,
    setClaimModalItem,
    analyzeMatchWithGemini,
    aiLoadingMatchId,
    currentUser,
  } = useApp();

  const [inspectingMatch, setInspectingMatch] = useState<ItemMatch | null>(null);

  const handleAiAnalyze = async (matchId: string) => {
    await analyzeMatchWithGemini(matchId);
    const updated = matches.find((m) => m.id === matchId);
    if (updated) {
      setInspectingMatch(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans">
      <Sidebar isAdmin={false} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header with Centralized Global Search */}
        <DashboardHeader
          title="Match Notifications"
          subtitle="Automated & AI Correlation Engine"
        />

        <div className="p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
          
          {/* Header Banner matching Screen 8 */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Matching Active</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Possible Matches
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                When a student reports a lost item, our system cross-references category, keywords, color traits, location proximity, and timestamps to identify high-probability matches.
              </p>
            </div>
            
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* Match Items List */}
          {matches.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">No Pending Match Alerts</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No new unverified correlations found right now. You will receive an immediate SMS and push alert as soon as an item matching your description is registered.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-3xl border border-stone-200 hover:border-indigo-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Left: Photos & summary description matching Screen 8 */}
                    <div className="flex items-center gap-4">
                      
                      {/* Photo Thumbnail */}
                      <div className="relative shrink-0">
                        <img
                          src={match.foundItem.photoUrl}
                          alt={match.foundItem.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                        />
                        <span className="absolute -bottom-2 -right-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                          Found
                        </span>
                      </div>

                      {/* Text */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            Your lost {match.lostItem.title.toLowerCase()} matches with a found item
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            Reported on {match.foundItem.displayDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            {match.foundItem.location}
                          </span>
                        </p>
                        
                        {/* Match Confidence Badge */}
                        <div className="pt-1 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            {match.confidence}% Confidence Match
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {match.matchReason}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap sm:flex-col items-end gap-2 w-full sm:w-auto shrink-0">
                      
                      {/* View Details green button matching blueprint */}
                      <button
                        onClick={() => setCurrentView('item-details', match.foundItem.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Gemini Deep AI Analysis button */}
                      <button
                        onClick={() => handleAiAnalyze(match.id)}
                        disabled={aiLoadingMatchId === match.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors flex items-center gap-1.5"
                      >
                        {aiLoadingMatchId === match.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            <span>AI Breakdown</span>
                          </>
                        )}
                      </button>

                    </div>

                  </div>

                  {/* Bottom secondary actions bar */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setClaimModalItem(match.foundItem)}
                        className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                      >
                        Contact Admin / Verify Ownership
                      </button>
                    </div>

                    <button
                      onClick={() => markMatchNotAMatch(match.id)}
                      className="text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Mark as Not a Match</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Legal / Policy Callout */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Ownership Verification Policy</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                CampusLost displays possible matches to aid investigation. Possession and custody transfer are exclusively authorized by Campus Security Officers after in-person claimant verification.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* AI Analysis Modal */}
      <AiAnalysisModal
        match={inspectingMatch}
        onClose={() => setInspectingMatch(null)}
      />
    </div>
  );
};
