import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Phone, Mail, MapPin, Shield, Clock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-[#0B192C] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Campus<span className="text-indigo-400">Lost</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Centralized Lost and Found Portal for University Students, Faculty, and Staff. Dedicated to restoring misplaced belongings swiftly, transparently, and securely.
            </p>

            <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold">
              <span>TAGLINE:</span>
              <span className="text-white">Find • Report • Reunite</span>
            </div>
          </div>

          {/* Custody Drop-Off Locations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              Custody Desks
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span><strong>Security Main Booth:</strong> Admin Block Gate 1 (24/7)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span><strong>Central Library Desk:</strong> 1st Floor Circulation</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span><strong>Student Union Center:</strong> Ground Floor Helpdesk</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentView('browse')}
                  className="hover:text-white transition-colors"
                >
                  Browse Active Listings
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('report-lost')}
                  className="hover:text-white transition-colors"
                >
                  Report Lost Belonging
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('report-found')}
                  className="hover:text-white transition-colors"
                >
                  Turn In Found Item
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('matches')}
                  className="hover:text-white transition-colors"
                >
                  Smart Match Notifications
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-white transition-colors"
                >
                  About University Initiative
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Helpline & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Campus Helpline
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 80 2345 6789 (Security Desk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>lostandfound@campus.edu</span>
              </div>
              <p className="pt-2 text-[11px] text-slate-500">
                Operating Hours: Monday – Saturday (8:00 AM – 7:30 PM). Security gate open 24/7 for emergency custody.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} CampusLost Portal. University Division of Student Affairs & Security.
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Together for a Safer Campus</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
