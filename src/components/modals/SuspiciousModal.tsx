import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItemReport } from '../../types';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SuspiciousModalProps {
  item?: ItemReport;
  itemId?: string;
  itemTitle?: string;
  isOpen?: boolean;
  onClose: () => void;
}

export const SuspiciousModal: React.FC<SuspiciousModalProps> = ({
  item,
  itemId,
  itemTitle,
  isOpen = true,
  onClose,
}) => {
  const { flagSuspicious } = useApp();
  const effectiveId = itemId || item?.id || '';
  const effectiveTitle = itemTitle || item?.title || 'Item';

  const [reason, setReason] = useState('Inaccurate item details or deceptive claims');
  const [customDetails, setCustomDetails] = useState('');
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customDetails ? `${reason}: ${customDetails}` : reason;
    flagSuspicious(effectiveId, finalReason);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Listing Flagged</h3>
            <p className="text-sm text-stone-600">
              Campus Security administrators have been notified to review this listing for integrity.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Report Suspicious Listing
                </h3>
                <p className="text-xs text-stone-500 truncate max-w-xs">
                  {effectiveTitle}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Reason for reporting *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800"
              >
                <option value="Inaccurate item details or deceptive claims">Inaccurate item details or deceptive claims</option>
                <option value="Possible duplicate or fraudulent report">Possible duplicate or fraudulent report</option>
                <option value="Offensive, inappropriate, or sensitive content">Offensive, inappropriate, or sensitive content</option>
                <option value="Item already claimed or returned elsewhere">Item already claimed or returned elsewhere</option>
                <option value="Other security concern">Other security concern</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Additional Observations
              </label>
              <textarea
                rows={2}
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Explain why this listing seems suspicious..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
