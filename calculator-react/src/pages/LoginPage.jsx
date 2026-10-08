// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function LoginPage({ onLoginSuccess }) {
  const { addToast } = useToast();

  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Helper to format clean display name from email or input
  const prettyName = (str) => {
    if (!str) return 'BG User';
    return str
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // 1. Submit Sign In
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const email = loginEmail.trim() || 'user@bgcoating.com';
    const rawName = email.split('@')[0];
    const name = prettyName(rawName);

    const userData = {
      name: name,
      email: email,
      role: 'Coating Inspector',
      company: 'BG Coating & Inspection Services',
      provider: 'email',
      lastLogin: new Date().toISOString()
    };

    localStorage.setItem('bg_auth_logged_in', 'true');
    localStorage.setItem('bg_user', JSON.stringify(userData));

    setTimeout(() => {
      setLoading(false);
      addToast('Signed In', `Welcome back, ${name.split(' ')[0]}.`, 'success');
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
    }, 250);
  };

  // 2. Submit Register
  const handleRegister = (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const name = regName.trim() || 'BG Specialist';
    const email = regEmail.trim() || 'engineer@company.com';

    const userData = {
      name: name,
      email: email,
      role: 'Coating Specialist',
      company: 'BG CoatingOS Workspace',
      provider: 'email',
      lastLogin: new Date().toISOString()
    };

    localStorage.setItem('bg_auth_logged_in', 'true');
    localStorage.setItem('bg_user', JSON.stringify(userData));

    setTimeout(() => {
      setLoading(false);
      addToast('Account Created', `Welcome to BG CoatingOS, ${name.split(' ')[0]}!`, 'success');
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
    }, 250);
  };

  // 3. Google Login Setup (Dummy SSO)
  const handleGoogleLogin = () => {
    setLoading(true);
    const userData = {
      name: 'Google Engineer',
      email: 'engineer@google.demo',
      role: 'Corrosion Engineer & Inspector',
      company: 'Industrial Asset Integrity',
      provider: 'google',
      lastLogin: new Date().toISOString()
    };

    localStorage.setItem('bg_auth_logged_in', 'true');
    localStorage.setItem('bg_user', JSON.stringify(userData));

    setTimeout(() => {
      setLoading(false);
      addToast('Google Sign-In', 'Authenticated via Google (demo).', 'success');
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
    }, 250);
  };

  // 4. Microsoft Login Setup (Dummy SSO)
  const handleMicrosoftLogin = () => {
    setLoading(true);
    const userData = {
      name: 'Microsoft User',
      email: 'm.specialist@enterprise.demo',
      role: 'QA/QC Project Manager',
      company: 'Marine & Offshore Infrastructure',
      provider: 'microsoft',
      lastLogin: new Date().toISOString()
    };

    localStorage.setItem('bg_auth_logged_in', 'true');
    localStorage.setItem('bg_user', JSON.stringify(userData));

    setTimeout(() => {
      setLoading(false);
      addToast('Microsoft Sign-In', 'Authenticated via Microsoft (demo).', 'success');
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
    }, 250);
  };

  const handleForgotPassword = () => {
    const target = loginEmail.trim() || 'your email';
    addToast('Reset link sent', `Password reset instructions sent to ${target} (demo).`, 'info');
  };

  return (
    <div className="min-h-screen w-full bg-[#181E29] flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-[#F7941D]/30 selection:text-white">
      
      {/* Centered Clean Auth Card */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F7941D] to-[#8B0E16] p-0.5 shadow-md flex items-center justify-center mb-3">
            <div className="w-full h-full bg-[#181E29] rounded-[14px] flex items-center justify-center p-2 overflow-hidden">
              <img
                src="/logo-2.png"
                alt="BG Coating Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-rajdhani uppercase">
            BG CoatingOS™
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Protective Coatings &amp; Corrosion Engineering Workspace
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div 
          className="flex p-1 bg-slate-100 rounded-full border border-slate-200 mb-6" 
          role="tablist"
          aria-label="Authentication Type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={authTab === 'login'}
            onClick={() => setAuthTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              authTab === 'login'
                ? 'bg-gradient-to-r from-[#F7941D] to-[#E87B1E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={authTab === 'register'}
            onClick={() => setAuthTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              authTab === 'register'
                ? 'bg-gradient-to-r from-[#F7941D] to-[#E87B1E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* ========================================================
            VIEW 1: SIGN IN FORM
            ======================================================== */}
        {authTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Work Email */}
            <div className="space-y-1">
              <label 
                htmlFor="login-email" 
                className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500"
              >
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label 
                htmlFor="login-password" 
                className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#F7941D] focus:ring-[#F7941D] accent-[#F7941D] w-3.5 h-3.5"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] transition cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#F7941D] to-[#E87B1E] hover:from-[#E87B1E] hover:to-[#D97706] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* ========================================================
              VIEW 2: REGISTER FORM
              ======================================================== */
          <form onSubmit={handleRegister} className="space-y-3.5">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label 
                htmlFor="reg-name" 
                className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition"
                />
              </div>
            </div>

            {/* Work Email */}
            <div className="space-y-1">
              <label 
                htmlFor="reg-email" 
                className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500"
              >
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label 
                htmlFor="reg-password" 
                className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#F7941D] to-[#E87B1E] hover:from-[#E87B1E] hover:to-[#D97706] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
            or continue with
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google & Microsoft SSO Buttons */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#F7941D] rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.6z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.1-6.9-5.1L1.2 17C3.1 21.1 7.2 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.1 14.3c-.3-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.2 6.7C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l3.9-3z"
              />
              <path
                fill="#EA4335"
                d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.2 0 3.1 2.9 1.2 6.7l3.9 3C6 6.8 8.8 4.7 12 4.7z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* Microsoft SSO Button */}
          <button
            type="button"
            onClick={handleMicrosoftLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#F7941D] rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <rect width="11" height="11" fill="#F25022" />
              <rect x="13" width="11" height="11" fill="#7FBA00" />
              <rect y="13" width="11" height="11" fill="#00A4EF" />
              <rect x="13" y="13" width="11" height="11" fill="#FFB900" />
            </svg>
            <span>Microsoft</span>
          </button>

        </div>

      </div>

    </div>
  );
}
