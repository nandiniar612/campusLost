import React from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  FileText,
  Search,
  Bell,
  HeartHandshake,
  ShieldCheck,
  Building,
  Clock,
  Sparkles,
  Users,
  Award,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView, setBrowseTab } = useApp();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-16">
        
        {/* Hero Section matching Screen 10 in wireframe */}
        <section className="py-12 sm:py-16 border-b border-stone-200/80 bg-gradient-to-b from-[#F9F6F0] to-[#FDFBF7]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Security & Student Affairs Initiative</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              About CampusLost
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
              CampusLost is a university-wide platform designed to help students, faculty and staff find lost items and return found items. Our goal is to make campus a safer, more connected community.
            </p>

          </div>
        </section>

        {/* 4 Process Pillars matching Screen 10 illustration */}
        <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1: Report */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-base text-slate-800">1. Report</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Log lost or found items with location, photo, and time details.
              </p>
            </div>

            {/* Step 2: Search */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-base text-slate-800">2. Search</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Browse & find matches using keyword and category filters.
              </p>
            </div>

            {/* Step 3: Get Notified */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-base text-slate-800">3. Get Notified</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Stay updated with automated alerts and AI match ratings.
              </p>
            </div>

            {/* Step 4: Reunite */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 text-center space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-base text-slate-800">4. Reunite</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Safely verify ownership and celebrate successful returns!
              </p>
            </div>

          </div>
        </section>

        {/* Inspirational Banner matching the mockup's handwritten quote */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 border border-indigo-100 text-center relative overflow-hidden">
            <p className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
              🌱 Small actions make a big difference! 🍃
            </p>
            <p className="text-xs text-stone-600 max-w-md mx-auto mt-2">
              Every wallet returned, every pair of earphones handed in, builds trust and camaraderie across our student community.
            </p>
          </div>
        </section>

        {/* Why CampusLost Was Developed & Safety Protocols */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Why Developed */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">
                  Why CampusLost Was Developed
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Prior to CampusLost, lost items were scattered across informal WhatsApp groups, departmental noticeboards, and miscellaneous security desks. Valuable items like calculators, smartwatches, and project notebooks were frequently unclaimed.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                CampusLost creates a unified, single source of truth for the entire campus, preserving privacy while accelerating successful returns with automated correlation.
              </p>
            </div>

            {/* Verification & Security */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">
                  Student Privacy & Verification
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                We protect student identity. Full student email addresses and registration numbers are never displayed publicly. Only verified Campus Security Custodians inspect claim proofs.
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                <li>Proof of serial number or secret markings required.</li>
                <li>In-person verification at designated security gates.</li>
                <li>Spam and fraudulent claim prevention system.</li>
              </ul>
            </div>

          </div>

          {/* Custody Locations */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Campus Custody Desks & Operating Hours</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <strong className="block text-slate-900 font-bold mb-1">
                  Central Library Counter
                </strong>
                <p>Monday - Saturday: 8:00 AM - 9:00 PM</p>
                <p className="text-stone-400 mt-1">Ground Floor Circulation Desk</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <strong className="block text-slate-900 font-bold mb-1">
                  Main Security Gate 1
                </strong>
                <p>24 Hours · 7 Days a Week</p>
                <p className="text-stone-400 mt-1">Emergency Locked Custody Locker</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <strong className="block text-slate-900 font-bold mb-1">
                  Student Affairs (Block C)
                </strong>
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p className="text-stone-400 mt-1">Room 101, Dean's Office</p>
              </div>
            </div>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};
