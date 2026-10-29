import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, authMode, closeAuth, loginUser, registerUser, openAuth, openGoogleAuth } = useApp();

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPass2, setRegPass2] = useState('');
  const [regError, setRegError] = useState('');

  if (!isAuthOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPass) {
      setLoginError('ইমেইল আর পাসওয়ার্ড দিন');
      return;
    }
    setLoginError('');
    loginUser(loginEmail.trim());
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = regName.trim();
    const phone = regPhone.trim().replace(/[\s-]/g, '');
    const email = regEmail.trim();

    if (!name) {
      setRegError('আপনার নাম দিন');
      return;
    }
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone)) {
      setRegError('সঠিক ফোন নাম্বার দিন (যেমন 01712345678)');
      return;
    }
    if (!email) {
      setRegError('ইমেইল দিন');
      return;
    }
    if (regPass.length < 6) {
      setRegError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের দিন');
      return;
    }
    if (regPass !== regPass2) {
      setRegError('দুইটা পাসওয়ার্ড মিলছে না');
      return;
    }

    setRegError('');
    registerUser(name, phone, email);
  };

  const handleGoogleAuth = () => {
    openGoogleAuth();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1637]/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-[440px] bg-white border-[1.5px] border-[#e1e8f5] rounded-[22px] p-6 shadow-[0_16px_36px_-16px_rgba(37,99,235,0.35)] my-8">
        <button
          type="button"
          onClick={closeAuth}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-[#eff6ff] text-[#2563eb] text-[20px] grid place-items-center cursor-pointer active:scale-95"
        >
          ✕
        </button>

        <img
          src="/main-logo.jpg"
          alt="FF Gamecoin"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/Main logo.jpg';
          }}
          className="h-[46px] mx-auto mb-2 object-contain"
        />

        {authMode === 'login' ? (
          <div>
            <h2 className="text-[26px] font-extrabold text-[#0f172a] my-2">Login</h2>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full h-[50px] border-[1.5px] border-[#e1e8f5] rounded-[14px] bg-white text-[16px] font-semibold flex items-center justify-center gap-2.5 cursor-pointer text-[#0f172a] hover:bg-slate-50 transition-colors shadow-xs"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              <span>Continue with Google / Gmail</span>
            </button>

            <div className="flex items-center gap-2.5 my-4 text-[#666b85] text-[13px]">
              <span className="flex-1 h-[1px] bg-[#e1e8f5]" />
              <span>অথবা ইমেইল দিয়ে লগইন করুন</span>
              <span className="flex-1 h-[1px] bg-[#e1e8f5]" />
            </div>

            <form onSubmit={handleLoginSubmit}>
              <label className="block text-[14px] font-bold mt-3 mb-1.5 text-[#0f172a]">ইমেইল</label>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
                className="w-full h-[48px] border-[1.5px] border-[#e1e8f5] rounded-[14px] px-3.5 text-[15px] outline-none focus:border-[#3b82f6] text-[#0f172a]"
              />

              <label className="block text-[14px] font-bold mt-3 mb-1.5 text-[#0f172a]">পাসওয়ার্ড</label>
              <input
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                autoComplete="current-password"
                className="w-full h-[48px] border-[1.5px] border-[#e1e8f5] rounded-[14px] px-3.5 text-[15px] outline-none focus:border-[#3b82f6] text-[#0f172a]"
              />

              {loginError && (
                <div className="mt-3 p-2.5 rounded-[12px] bg-[#fef2f2] text-[#b91c1c] text-[14px]">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-[50px] mt-4 rounded-[14px] bg-linear-to-r from-blue-500 to-blue-700 text-white text-[16px] font-bold cursor-pointer shadow-md hover:brightness-105 active:scale-98 transition-all"
              >
                Login
              </button>
            </form>

            <div className="text-center mt-4 text-[14px] text-[#666b85]">
              নতুন ইউজার?{' '}
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="text-[#2563eb] font-bold cursor-pointer hover:underline"
              >
                রেজিস্টার করুন
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-[26px] font-extrabold text-[#0f172a] my-2">Register</h2>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full h-[50px] border-[1.5px] border-[#e1e8f5] rounded-[14px] bg-white text-[16px] font-semibold flex items-center justify-center gap-2.5 cursor-pointer text-[#0f172a] hover:bg-slate-50 transition-colors shadow-xs"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              <span>Continue with Google / Gmail</span>
            </button>

            <div className="flex items-center gap-2.5 my-4 text-[#666b85] text-[13px]">
              <span className="flex-1 h-[1px] bg-[#e1e8f5]" />
              <span>অথবা ইমেইল দিয়ে রেজিস্টার করুন</span>
              <span className="flex-1 h-[1px] bg-[#e1e8f5]" />
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <label className="block text-[14px] font-bold mt-2.5 mb-1 text-[#0f172a]">নাম</label>
              <input
                type="text"
                placeholder="Name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full h-[46px] border-[1.5px] border-[#e1e8f5] rounded-[14px] px-3.5 text-[15px] outline-none focus:border-[#3b82f6] text-[#0f172a]"
              />

              <label className="block text-[14px] font-bold mt-2.5 mb-1 text-[#0f172a]">ফোন নাম্বার</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full h-[46px] border-[1.5px] border-[#e1e8f5] rounded-[14px] px-3.5 text-[15px] outline-none focus:border-[#3b82f6] text-[#0f172a]"
              />

              <label className="block text-[14px] font-bold mt-2.5 mb-1 text-[#0f172a]">ইমেইল</label>
              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full h-[46px] border-[1.5px] border-[#e1e8f5] rounded-[14px] px-3.5 text-[15px] outline-none focus:border-[#3b82f6] text-[#0f172a]"
              />

              <label className="block text-[14px] font-bold mt-2.5 mb-1 text-[#0f172a]">পাসওয়ার্ড</label>
              <input
                type="password"
                placeholder="Password (কমপক্ষে ৬ অক্ষর)"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                className="w-full h-[46px] border-[1.5px] border-[#e1e8f5] rounded-[14px] px-3.5 text-[15px] outline-none focus:border-[#3b82f6] text-[#0f172a]"
              />

              <label className="block text-[14px] font-bold mt-2.5 mb-1 text-[#0f172a]">পাসওয়ার্ড আবার দিন</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={regPass2}
                onChange={(e) => setRegPass2(e.target.value)}
                className="w-full h-[46px] border-[1.5px] border-[#e1e8f5] rounded-[14px] px-3.5 text-[15px] outline-none focus:border-[#3b82f6] text-[#0f172a]"
              />

              {regError && (
                <div className="mt-3 p-2.5 rounded-[12px] bg-[#fef2f2] text-[#b91c1c] text-[14px]">
                  {regError}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-[50px] mt-4 rounded-[14px] bg-linear-to-r from-blue-500 to-blue-700 text-white text-[16px] font-bold cursor-pointer shadow-md hover:brightness-105 active:scale-98 transition-all"
              >
                Register
              </button>
            </form>

            <div className="text-center mt-4 text-[14px] text-[#666b85]">
              আগে থেকেই একাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="text-[#2563eb] font-bold cursor-pointer hover:underline"
              >
                Login করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
