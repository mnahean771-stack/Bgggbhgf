import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const GoogleSignInModal: React.FC = () => {
  const { isGoogleAuthOpen, closeGoogleAuth, loginWithGoogle, allUsers } = useApp();

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signingAccount, setSigningAccount] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isGoogleAuthOpen) return null;

  // Preset fast Google accounts to choose from
  const defaultAccounts = [
    {
      name: 'Md Nahean',
      email: 'mnahean771@gmail.com',
      avatar: '/main-logo.jpg',
      badge: 'Current Account'
    },
    {
      name: 'Rakibul Hasan',
      email: 'rakib.ff@gmail.com',
      avatar: '/main-logo.jpg',
      badge: 'Verified Gamer'
    }
  ];

  // Merge with any other registered users that have a gmail address
  const additionalUsers = allUsers
    .filter(
      (u) =>
        u.email.toLowerCase().endsWith('@gmail.com') &&
        !defaultAccounts.some((d) => d.email.toLowerCase() === u.email.toLowerCase())
    )
    .slice(0, 2)
    .map((u) => ({
      name: u.name,
      email: u.email,
      avatar: u.avatar || '/main-logo.jpg',
      badge: 'Google User'
    }));

  const accounts = [...defaultAccounts, ...additionalUsers];

  const handleSelectAccount = (account: { name: string; email: string; avatar: string }) => {
    setSigningAccount(account.email);
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      loginWithGoogle(account.email, account.name, account.avatar);
      setIsLoading(false);
      setSigningAccount(null);
    }, 700);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = customEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your Gmail address');
      return;
    }
    if (!cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setSigningAccount(cleanEmail);
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const derivedName = customName.trim() || cleanEmail.split('@')[0];
      loginWithGoogle(cleanEmail, derivedName);
      setIsLoading(false);
      setSigningAccount(null);
      setIsCustomMode(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1637]/55 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-[420px] bg-white border border-[#e2e8f0] rounded-[24px] p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Google Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {/* Google official 4-color SVG */}
            <svg width="22" height="22" viewBox="0 0 48 48" className="shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
              <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            <span className="text-[15px] font-bold text-slate-800 tracking-tight">
              Sign in with Google
            </span>
          </div>

          <button
            type="button"
            onClick={closeGoogleAuth}
            disabled={isLoading}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 grid place-items-center cursor-pointer transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Loading overlay if authenticating */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="relative w-12 h-12 mb-3">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#4285F4] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                  <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
                  <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                </svg>
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-800">Signing in...</h4>
            <p className="text-xs text-slate-400 mt-1 font-mono">{signingAccount}</p>
          </div>
        ) : isCustomMode ? (
          /* Custom Gmail Input Form */
          <form onSubmit={handleCustomSubmit} className="pt-4 space-y-3.5">
            <div>
              <h3 className="text-[17px] font-extrabold text-slate-900 leading-tight">
                Use your Google Account
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                to continue to <b>New TopUp</b>
              </p>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gmail or Google Email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                autoFocus
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Your Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="text-xs font-bold text-[#4285F4] hover:underline cursor-pointer"
              >
                Back to accounts
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#4285F4] hover:bg-[#3367d6] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue</span>
                <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        ) : (
          /* Account Chooser List */
          <div className="pt-3">
            <div className="mb-3">
              <h3 className="text-[17px] font-extrabold text-slate-900 leading-tight">
                Choose an account
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                to continue to <b className="text-slate-800">New TopUp</b>
              </p>
            </div>

            {/* List of Accounts */}
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white mb-3">
              {accounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/main-logo.jpg';
                      }}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs">
                      <svg width="10" height="10" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                        <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
                        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <b className="text-[14px] font-bold text-slate-900 group-hover:text-[#4285F4] transition-colors truncate">
                        {acc.name}
                      </b>
                      {acc.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-sky-50 text-[#0284c7]">
                          {acc.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-normal block truncate">
                      {acc.email}
                    </span>
                  </div>

                  <svg className="w-4 h-4 text-slate-300 group-hover:text-[#4285F4] transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}

              {/* Use another account option */}
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group text-slate-700"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#4285F4]/10 group-hover:text-[#4285F4] transition-colors">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[13.5px] font-bold text-slate-800 group-hover:text-[#4285F4] transition-colors block">
                    Use another Google account
                  </span>
                  <span className="text-xs text-slate-400">
                    Sign in with any other Gmail address
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Security and privacy footer matching Google Identity flow */}
        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed text-center">
          To continue, Google will share your name, email address, language preference, and profile
          picture with New TopUp.
        </div>
      </div>
    </div>
  );
};
