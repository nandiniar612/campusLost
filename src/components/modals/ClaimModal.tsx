import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItemReport } from '../../types';
import { ShieldCheck, X, FileText, CheckCircle2, Lock } from 'lucide-react';

interface ClaimModalProps {
  item?: ItemReport | null;
  onClose?: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, onClose }) => {
  const { claimModalItem, setClaimModalItem, submitClaim } = useApp();

  const activeItem = item || claimModalItem;

  const handleClose = () => {
    if (onClose) onClose();
    else setClaimModalItem(null);
  };

  const [details, setDetails] = useState('');
  const [proof, setProof] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!activeItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    submitClaim(activeItem.id, details, proof);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      handleClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Claim Request Submitted</h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              Your proof of ownership has been dispatched to the Security Verification Desk. You will be notified once reviewed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Claim Ownership
                </h3>
                <p className="text-xs text-stone-500">
                  Item: <span className="font-bold text-slate-800">{activeItem.title}</span>
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
              <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>
                To prevent false claims, campus policy requires identifying details only known to the real owner (e.g. unique scratches, serial numbers, wallpapers, contents).
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Identifying Characteristics *
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe hidden details, inner compartments, scratches, passcode hint, or specific items inside..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 placeholder-stone-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Proof of Purchase / Serial Number / Photo (Optional)
              </label>
              <input
                type="text"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                placeholder="Invoice reference, student ID photo URL, or IMEI number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 placeholder-stone-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setClaimModalItem(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md active:scale-95 transition-all"
              >
                Submit Ownership Claim
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
