import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Search, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signup, setCurrentView } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    regNo: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'faculty' | 'staff' | 'admin',
    department: 'Computer Science & Engineering',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid university email.');
      return;
    }
    if (!formData.regNo.trim()) {
      setError('Please enter your student registration / employee number.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await signup(
      {
        name: formData.name,
        email: formData.email,
        regNo: formData.regNo.toUpperCase(),
        role: formData.role,
        department: formData.department,
        phone: formData.phone || '+91 98450 00000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      },
      formData.password
    );

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setCurrentView(formData.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
      }, 1200);
    } else {
      setError(res.error || 'Failed to create account. Please verify input.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-stone-200/90 p-8 sm:p-10">
          
          {/* Logo Badge matching Screen 3 */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#1B2A4A] to-[#2E4A7D] flex items-center justify-center text-white shadow-md shadow-indigo-950/20">
              <Search className="w-7 h-7" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Campus<span className="text-indigo-600">Lost</span>
            </h2>
            <h3 className="text-lg font-bold text-slate-800">
              Create Your Account
            </h3>
            <p className="text-xs text-stone-500">
              Join CampusLost for a safer campus experience
            </p>
          </div>

          {success ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Account Created Successfully!
              </h4>
              <p className="text-xs text-stone-500">
                Redirecting you to your personalized campus portal...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kavana M L"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 placeholder-stone-400 font-medium"
                />
              </div>

              {/* University Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  University Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="kavana@campus.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 placeholder-stone-400 font-medium"
                />
              </div>

              {/* Registration Number & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Registration No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.regNo}
                    onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                    placeholder="e.g. CSE22456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 uppercase placeholder-stone-400 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Select Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 font-medium bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="staff">Campus Staff</option>
                    <option value="admin">Security Administrator</option>
                  </select>
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Department / Branch *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 font-medium bg-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Information Science">Information Science</option>
                  <option value="Business & Management">Business & Management</option>
                  <option value="Security & Campus Facilities">Security & Campus Facilities</option>
                </select>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 placeholder-stone-400 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-800 placeholder-stone-400 font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1B2A4A] hover:bg-[#0B192C] text-white font-bold text-sm shadow-md shadow-indigo-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign Up</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Switch to login */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
            <span>Already have an account? </span>
            <button
              onClick={() => setCurrentView('login')}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Login
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};
