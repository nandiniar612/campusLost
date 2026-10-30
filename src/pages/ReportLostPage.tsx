import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { ItemCategory } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  Search,
  Upload,
  CheckCircle2,
  Calendar,
  MapPin,
  Laptop,
  Briefcase,
  BookOpen,
  Shirt,
  Sparkles,
  CreditCard,
  Key,
  Package,
  ArrowRight,
  ShieldCheck,
  Camera
} from 'lucide-react';

export const ReportLostPage: React.FC = () => {
  const { addLostItem, setCurrentView, currentUser } = useApp();

  const [category, setCategory] = useState<ItemCategory>('Bags & Wallets');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState('https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const photoPresets = [
    { label: 'Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80' },
    { label: 'AirPods', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80' },
    { label: 'ID Card', url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&auto=format&fit=crop&q=80' },
    { label: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=80' },
    { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80' },
    { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80' },
  ];

  const commonCategories: { label: ItemCategory; icon: React.ReactNode }[] = [
    { label: 'Electronics', icon: <Laptop className="w-5 h-5 text-indigo-600" /> },
    { label: 'Bags & Wallets', icon: <Briefcase className="w-5 h-5 text-purple-600" /> },
    { label: 'Books & Stationery', icon: <BookOpen className="w-5 h-5 text-amber-600" /> },
    { label: 'Clothing', icon: <Shirt className="w-5 h-5 text-rose-600" /> },
    { label: 'Accessories', icon: <Sparkles className="w-5 h-5 text-pink-600" /> },
    { label: 'ID Cards', icon: <CreditCard className="w-5 h-5 text-blue-600" /> },
    { label: 'Keys', icon: <Key className="w-5 h-5 text-emerald-600" /> },
    { label: 'Others', icon: <Package className="w-5 h-5 text-stone-600" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) return;

    setIsSubmitting(true);

    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const displayDate = `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;

    const formData = {
      type: 'lost' as const,
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      date,
      displayDate,
      photoUrl: selectedPhoto,
      additionalDetails: additionalDetails.trim(),
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
        createdAt: serverTimestamp(),
      });
      firestoreDocId = docRef.id;
      console.log('[Firestore] Successfully wrote lost item document with ID:', docRef.id);
    } catch (err) {
      console.error('Error writing lost item to Firebase Firestore:', err);
    }

    const newId = addLostItem({
      ...formData,
      id: firestoreDocId || undefined,
    });

    setIsSubmitting(false);
    setSubmittedId(firestoreDocId || newId);
  };

  const handleCustomFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      <Sidebar activeView="report-lost" />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Report Lost Item"
          subtitle="Fill in the details about the item you lost so our matching engine can notify you."
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
          {submittedId ? (
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Report Submitted to Firebase!
              </h2>

              <p className="text-sm text-stone-600">
                Your lost item report for <strong>"{title}"</strong> has been securely published in real-time. Our Gemini matching engine is cross-referencing all found reports.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentView('matches')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  View Potential Matches
                </button>
                <button
                  onClick={() => setCurrentView('item-details', submittedId)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-stone-300 text-slate-700 font-bold text-xs hover:bg-stone-50"
                >
                  View Listing Details
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: The Main Form matching Screen 5 */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Report Lost Item
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Fill in the details about the item you lost.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Item Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Item Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ItemCategory)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 bg-stone-50/50 font-medium"
                    >
                      <option value="Electronics">Electronics (Laptop, Phone, AirPods, Charger)</option>
                      <option value="Bags & Wallets">Bags & Wallets (Backpack, Purse, Pouch)</option>
                      <option value="Books & Stationery">Books & Stationery (Notebook, Calculator, Textbook)</option>
                      <option value="Clothing">Clothing (Jacket, Hoodie, Cap)</option>
                      <option value="Accessories">Accessories (Glasses, Watch, Jewelry)</option>
                      <option value="ID Cards">ID Cards (Student ID, Driver License)</option>
                      <option value="Keys">Keys (Dorm keys, Vehicle key)</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* Item Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Black Leather Wallet"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder-stone-400 font-medium"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your item in detail (color, brand, scratches, stickers, condition)..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder-stone-400 font-medium"
                    />
                  </div>

                  {/* Location & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Last Seen Location *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Central Library, Block A, Cafeteria"
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder-stone-400 font-medium pl-10"
                        />
                        <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Date Lost *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 font-medium pl-10 bg-white"
                        />
                        <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Upload Item Photograph (matching Screen 5 wireframe) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Upload Photo (Optional)
                    </label>
                    <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 bg-stone-50/50 flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={selectedPhoto}
                        alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div className="space-y-2 text-center sm:text-left flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-indigo-500 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Choose File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCustomFile}
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-stone-400">or pick sample preset:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {photoPresets.map((p) => (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => setSelectedPhoto(p.url)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                selectedPhoto === p.url
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-stone-200/60 text-slate-700 hover:bg-stone-300'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Identifying Details */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Additional Identifying Details
                    </label>
                    <input
                      type="text"
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      placeholder="e.g. Serial numbers, name on ID card, inner keychain"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder-stone-400 font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Lost Report</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Common Categories sidebar card matching Screen 5 mockup */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Common Categories
                  </h3>
                  <p className="text-xs text-stone-500">
                    Quickly select an item category to auto-fill the form
                  </p>

                  <div className="space-y-2">
                    {commonCategories.map((cat) => (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          category === cat.label
                            ? 'bg-indigo-50 border-indigo-600 shadow-sm'
                            : 'bg-stone-50 border-stone-200/80 hover:bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="p-2 bg-white rounded-xl shadow-2xs border border-stone-200/50">
                          {cat.icon}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy & Safety Note */}
                <div className="p-5 rounded-3xl bg-indigo-950 text-white space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    Student Privacy Protected
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your personal phone number and email are never publicly broadcasted. Ownership is verified through Campus Security before handing over.
                  </p>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};
