import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import {
  User,
  Mail,
  CreditCard,
  Building,
  Phone,
  Edit3,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Heart,
  PlusCircle,
  Check,
  X,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    items,
    setCurrentView,
    resolveItem,
    switchDemoUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my-reports' | 'account-settings'>('my-reports');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Kavana M L');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98450 12345');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const userItems = items.filter(
    (i) => i.reporterId === currentUser?.id || i.reporterName === currentUser?.name
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      currentUser.name = name;
      currentUser.phone = phone;
      currentUser.department = department;
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans">
      <Sidebar isAdmin={currentUser?.role === 'admin'} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16">
        
        {/* Top Header with Centralized Global Search */}
        <DashboardHeader
          title="My Profile & Reports"
          subtitle="Manage student account & filed reports"
        />

        <div className="p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          
          {/* Profile Card Header matching Screen 12 in wireframe */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              
              {/* Avatar & Basic Info */}
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="relative">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80'}
                    alt={currentUser?.name || 'Student'}
                    className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
                  />
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {currentUser?.name || 'Kavana M L'}
                  </h2>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {currentUser?.department || 'IT / CSE'} · Reg. No: {currentUser?.regNo || 'CSE22456'}
                  </p>
                  <p className="text-xs text-stone-500">
                    {currentUser?.email || 'kavana@gmail.com'}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200 capitalize">
                      Role: {currentUser?.role || 'Student'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Hostel Block B
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button matching Screen 12 */}
              <div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl border border-stone-300 hover:border-indigo-500 hover:bg-stone-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Edit Profile</span>
                </button>
              </div>

            </div>
          </div>

          {/* Details Card & My Reports matching Screen 12 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 5 Cols: My Details Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-stone-100 pb-3">
                My Details
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400 font-medium">Name:</span>
                  <span className="font-bold text-slate-800 text-right">{currentUser?.name || 'Kavana M L'}</span>
                </div>

                <div className="flex items-start justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400 font-medium">Email:</span>
                  <span className="font-bold text-slate-800 text-right">{currentUser?.email || 'kavana@gmail.com'}</span>
                </div>

                <div className="flex items-start justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400 font-medium">Registration No.:</span>
                  <span className="font-mono font-bold text-slate-800 text-right">{currentUser?.regNo || 'CSE22456'}</span>
                </div>

                <div className="flex items-start justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400 font-medium">Department:</span>
                  <span className="font-bold text-slate-800 text-right">{currentUser?.department || 'Computer Science'}</span>
                </div>

                <div className="flex items-start justify-between py-1">
                  <span className="text-stone-400 font-medium">Phone:</span>
                  <span className="font-bold text-slate-800 text-right">{currentUser?.phone || '+91 98450 12345'}</span>
                </div>
              </div>

              {/* Demo switch button */}
              <div className="pt-4 border-t border-stone-100">
                <p className="text-[11px] text-stone-500 mb-2">Evaluator Quick Switch:</p>
                <button
                  onClick={() => switchDemoUser('admin')}
                  className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-colors"
                >
                  Switch to Admin View (Officer Sharma)
                </button>
              </div>
            </div>

            {/* Right 7 Cols: My Reports Table / Cards */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900">
                  My Reported Items ({userItems.length})
                </h3>
                <button
                  onClick={() => setCurrentView('report-lost')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Report New</span>
                </button>
              </div>

              {userItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                  <p>You have not reported any items yet.</p>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      onClick={() => setCurrentView('report-lost')}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 font-bold rounded-lg"
                    >
                      Report Lost
                    </button>
                    <button
                      onClick={() => setCurrentView('report-found')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg"
                    >
                      Report Found
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {userItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-stone-50/70 hover:bg-stone-100 border border-stone-200 transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.photoUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md ${
                                item.type === 'lost'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {item.type}
                            </span>
                            <span className="font-bold text-slate-900">{item.title}</span>
                          </div>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            {item.location} · {item.displayDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.status !== 'Resolved' ? (
                          <button
                            onClick={() => resolveItem(item.id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                          >
                            Mark Reunited
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Reunited ✓
                          </span>
                        )}
                        <button
                          onClick={() => setCurrentView('item-details', item.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-slate-800 hover:bg-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Illustrated Motto Banner matching Screen 12 in the blueprint */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 text-center relative overflow-hidden">
            <p className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
              <span>Together for a Safer Campus</span>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </p>
            <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1">
              Thank you for keeping our university grounds honest, caring, and united.
            </p>
          </div>

        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-slate-800">Edit Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-stone-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-800 text-xs font-bold text-center">
                Profile updated successfully!
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
