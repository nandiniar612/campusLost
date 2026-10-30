import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Search, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentView } = useApp();
  
  const [identifier, setIdentifier] = useState('kavana@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your university email or registration number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    const isAdmin = identifier.toLowerCase().includes('admin') || identifier.toLowerCase().includes('emp-sec');
    const result = await login(identifier, password, isAdmin ? 'admin' : 'student');
    
    setLoading(false);
    if (result.success) {
      if (isAdmin) {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('student-dashboard');
      }
    } else {
      setError(result.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const fillDemo = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setIdentifier('kavana@gmail.com');
      setPassword('password123');
    } else {
      setIdentifier('admin.security@campus.edu');
      setPassword('admin123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200/90 p-8 sm:p-10 relative">
          
          {/* Logo Badge matching Screen 2 */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#1B2A4A] to-[#2E4A7D] flex items-center justify-center text-white shadow-md shadow-indigo-950/20">
              <Search className="w-7 h-7" />
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Campus<span className="text-indigo-600">Lost</span>
              </h2>
              <h3 className="text-lg font-bold text-slate-800 mt-2">
                Welcome Back!
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Login to your account
              </p>
            </div>
          </div>

          {/* Quick 1-Click Demo Buttons */}
          <div className="mb-6 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Demo Credentials:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-indigo-500 text-slate-700 font-semibold text-[11px] hover:text-indigo-600 transition-colors shadow-2xs"
              >
                Student (Kavana)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-purple-500 text-slate-700 font-semibold text-[11px] hover:text-purple-600 transition-colors shadow-2xs"
              >
                Admin (Officer)
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Reg No */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Email / Registration No.
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. student@campus.edu or CSE22456"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder-stone-400 bg-stone-50/50 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder-stone-400 bg-stone-50/50 focus:bg-white transition-all font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-stone-300 focus:ring-indigo-500"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1B2A4A] hover:bg-[#0B192C] text-white font-bold text-sm shadow-md shadow-indigo-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to Sign Up */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
            <span>Don't have an account? </span>
            <button
              onClick={() => setCurrentView('signup')}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Sign Up
            </button>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-slate-900">Reset University Password</h3>
            {forgotSent ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-emerald-600 font-bold">
                  Reset instructions sent to {forgotEmail}!
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="px-4 py-2 bg-stone-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-500">
                  Enter your registered student or staff email to receive password recovery instructions.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-stone-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setForgotSent(true)}
                    className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-xl"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
