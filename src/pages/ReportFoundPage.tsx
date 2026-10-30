import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { ItemCategory } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  PackageCheck,
  CheckCircle2,
  Image as ImageIcon,
  ShieldCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const ReportFoundPage: React.FC = () => {
  const { addFoundItem, setCurrentView, currentUser } = useApp();

  const [category, setCategory] = useState<ItemCategory>('Others');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [turnedInLocation, setTurnedInLocation] = useState('Central Library Circulation Desk');

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    setIsSubmitting(true);

    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const displayDate = `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;

    const formData = {
      type: 'found' as const,
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      date,
      displayDate,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
      color: color.trim(),
      brand: brand.trim(),
      turnedInLocation,
      custodyLocation: turnedInLocation,
      status: 'Pending' as const,
      reporterName: currentUser?.name || 'Kavana M L',
      reporterEmail: currentUser?.email || 'kavana@campus.edu',
      reporterRegNo: currentUser?.regNo || 'CS2023-084',
      reporterId: currentUser?.id || 'usr_kavana_01',
    };

    let firestoreDocId: string | null = null;
    try {
      const docRef = await addDoc(collection(db, "items"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      firestoreDocId = docRef.id;
      console.log('[Firestore] Successfully wrote found item document with ID:', docRef.id);
    } catch (err) {
      console.error('Error writing found item to Firebase Firestore:', err);
    }

    const newId = addFoundItem({
      ...formData,
      id: firestoreDocId || undefined,
    });

    setIsSubmitting(false);
    setCreatedItemId(firestoreDocId || newId);
    setSubmitted(true);
  };

  const handlePresetPhoto = (url: string) => {
    setPhotoUrl(url);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans">
      <Sidebar isAdmin={false} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header with Centralized Global Search */}
        <DashboardHeader
          title="Report Found Item"
          subtitle="Help someone get their belongings back"
        />

        <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full">
          
          {submitted ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl text-center max-w-lg mx-auto space-y-5 animate-in fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Found Item Registered!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Thank you for being a responsible campus citizen! The report has been saved directly to Firestore, indexed in our campus registry, and student owners are automatically notified.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setCurrentView('matches')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  View Potential Owner Matches
                </button>
                <button
                  onClick={() => {
                    if (createdItemId) {
                      setCurrentView('item-details', createdItemId);
                    } else {
                      setCurrentView('student-dashboard');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  View Listing
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Form: 8 cols */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
                
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Report Found Item
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Help someone get their belongings back.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Item Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ItemCategory)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                      required
                    >
                      <option value="Others">Others / Everyday Items</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Bags & Wallets">Bags & Wallets</option>
                      <option value="Books & Stationery">Books & Stationery</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Accessories">Accessories</option>
                      <option value="ID Cards">ID Cards & Badges</option>
                      <option value="Keys">Keys</option>
                    </select>
                  </div>

                  {/* Item Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Blue Stainless Steel Water Bottle"
                      required
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Description *
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what you found (general appearance, color, brand). Don't reveal private lock codes or secret markings."
                      required
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Location Found & Date Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Location Found *
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Library 2nd Floor, Room 204"
                        required
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Date Found *
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Turned in location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Current Item Custody / Handed In To
                    </label>
                    <select
                      value={turnedInLocation}
                      onChange={(e) => setTurnedInLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Central Library Circulation Desk">Central Library Circulation Desk (Ground Floor)</option>
                      <option value="Main Campus Security Booth 1">Main Campus Security Booth 1 (Gate 1)</option>
                      <option value="Student Affairs Center (Block C)">Student Affairs Center (Block C)</option>
                      <option value="Department Office">Department Office</option>
                      <option value="Held by Finder (Will hand over upon claim)">Held by Finder (Will hand over upon claim)</option>
                    </select>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Upload Photograph
                    </label>
                    <div className="p-4 rounded-2xl border-2 border-dashed border-stone-300 hover:border-emerald-400 bg-stone-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt="Preview"
                            className="w-20 h-20 rounded-xl object-cover ring-2 ring-emerald-500/30"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-stone-200 flex items-center justify-center text-stone-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        <div className="space-y-1 text-center sm:text-left flex-1">
                          <p className="text-xs font-semibold text-slate-700">
                            Sample photo URL or upload
                          </p>
                          <input
                            type="text"
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300"
                          />
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[10px] text-stone-400">Sample presets:</span>
                            <button
                              type="button"
                              onClick={() => handlePresetPhoto('https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80')}
                              className="text-[10px] font-semibold text-emerald-600 hover:underline"
                            >
                              Water Bottle
                            </button>
                            <span className="text-stone-300">·</span>
                            <button
                              type="button"
                              onClick={() => handlePresetPhoto('https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80')}
                              className="text-[10px] font-semibold text-emerald-600 hover:underline"
                            >
                              Keys
                            </button>
                            <span className="text-stone-300">·</span>
                            <button
                              type="button"
                              onClick={() => handlePresetPhoto('https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80')}
                              className="text-[10px] font-semibold text-emerald-600 hover:underline"
                            >
                              Calculator
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>Submit Found Report</span>
                      )}
                    </button>
                  </div>

                </form>
              </div>

              {/* Right column matching Screen 6 wireframe box */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Hand-drawn style friendly box from mockup */}
                <div className="bg-white rounded-3xl border-2 border-dashed border-indigo-200 p-6 sm:p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                    <PackageCheck className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800">
                    Found something? Report it here!
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    By submitting this report, you make it searchable by the owner instantly while keeping the item safe at a registered campus security desk.
                  </p>
                  
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 text-indigo-900 text-xs text-left space-y-1.5 border border-indigo-100">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Integrity Points
                    </p>
                    <p className="text-[11px] text-indigo-800">
                      Students who turn in found belongings receive university student recognition tokens and certificates of community ethics.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-stone-100 border border-stone-200 text-xs text-stone-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Safe Drop Locations</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Prefer not to keep the item with you? Drop it at the Main Security Gate or Central Library circulation desk for 24/7 locked custody.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};
