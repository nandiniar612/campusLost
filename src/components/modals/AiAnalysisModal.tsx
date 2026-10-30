import React from 'react';
import { ItemMatch } from '../../types';
import { Sparkles, X, CheckCircle2, HelpCircle, ShieldCheck, Cpu } from 'lucide-react';

interface AiAnalysisModalProps {
  match: ItemMatch | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  match,
  isOpen = true,
  onClose,
}) => {
  if (!isOpen || !match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">
                  Gemini AI Match Analysis
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-700 border border-indigo-200">
                  {match.confidence}% Match
                </span>
              </div>
              <p className="text-xs text-stone-500">
                AI Cross-correlation between Lost #{match.lostItemId} & Found #{match.foundItemId}
              </p>
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                Lost Item Report
              </span>
              <p className="font-bold text-slate-900 mt-1">{match.lostItem.title}</p>
              <p className="text-[11px] text-stone-500">{match.lostItem.location}</p>
              <p className="text-[11px] text-stone-400 mt-1">{match.lostItem.date}</p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                Found Item Report
              </span>
              <p className="font-bold text-slate-900 mt-1">{match.foundItem.title}</p>
              <p className="text-[11px] text-stone-500">{match.foundItem.location}</p>
              <p className="text-[11px] text-stone-400 mt-1">{match.foundItem.date}</p>
            </div>
          </div>

          {/* AI Analysis Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" />
              Machine Learning Rationale
            </h4>
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 leading-relaxed space-y-2">
              <p className="font-semibold text-indigo-950">
                {match.matchReason}
              </p>
              {match.aiAnalysis && (
                <p className="text-stone-600 border-t border-indigo-100/60 pt-2 text-[11px]">
                  {match.aiAnalysis}
                </p>
              )}
            </div>
          </div>

          {/* Verification Questions to ask claimant */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              Recommended Custody Verification Questions
            </h4>
            <p className="text-[11px] text-stone-500">
              Ask the student claimant these security questions without revealing the answers:
            </p>

            <div className="space-y-2">
              {(match.verificationQuestions || [
                "Can you describe any unique marks or scratches on the item?",
                "Can you specify the exact brand or model number?",
                "What were the exact contents or accessories accompanying the item?"
              ]).map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-2 border-t border-stone-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-[#1B2A4A] hover:bg-[#0B192C] rounded-xl shadow-md transition-all"
            >
              Close Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
