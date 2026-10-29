import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';

export const AccountDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, user, navigateTo, openAuth, logoutUser, config, setDashboardTab } = useApp();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-[#0a1637]/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer */}
      <aside className="relative w-[85%] max-w-[340px] h-full bg-white shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-right duration-300 pb-24">
        {/* Top Profile Header */}
        <div className="relative flex flex-col items-center p-4 bg-white border-b border-[#e1e8f5]">
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close Drawer"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#f1f5fd] text-[#0284c7] grid place-items-center cursor-pointer active:scale-95"
          >
            ✕
          </button>

          <div className="flex items-center gap-2.5 w-full mt-2">
            <UserAvatar className="w-[52px] h-[52px] rounded-xl shadow-xs ring-2 ring-sky-100" />

            <div className="min-w-0 flex-1">
              <b className="block text-[15px] font-extrabold text-[#0f172a] truncate">
                {user.loggedIn ? user.name : 'Hi, Guest'}
              </b>
              <span className="block mt-0.5 text-[12px] text-[#666b85] truncate">
                {user.loggedIn ? user.email || user.phone : 'লগইন করে অর্ডার করুন'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (user.loggedIn) {
                logoutUser();
              } else {
                openAuth('login');
              }
            }}
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-linear-to-r from-[#0284c7] to-[#0369a1] text-white text-[13px] font-bold cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              {user.loggedIn ? (
                <>
                  <path d="M12 3v8" />
                  <path d="M6.5 6.5a8 8 0 1 0 11 0" />
                </>
              ) : (
                <>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5M15 12H3" />
                </>
              )}
            </svg>
            <span>{user.loggedIn ? 'Logout' : 'Login'}</span>
          </button>
        </div>

        {/* Links */}
        <nav className="bg-white border-b border-[#e1e8f5]">
          <button
            type="button"
            onClick={() => {
              setDashboardTab('profile');
              navigateTo('dashboard', undefined, 'profile');
            }}
            className="flex items-center gap-3 w-full p-3.5 text-[14px] font-bold text-[#0f172a] text-left hover:bg-[#eff5ff] border-b border-slate-100 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284c7] grid place-items-center shrink-0">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="4" />
                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
              </svg>
            </span>
            <span>My Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDashboardTab('orders');
              navigateTo('dashboard', undefined, 'orders');
            }}
            className="flex items-center gap-3 w-full p-3.5 text-[14px] font-bold text-[#0f172a] text-left hover:bg-[#eff5ff] border-b border-slate-100 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284c7] grid place-items-center shrink-0">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="4" y="8" width="16" height="13" rx="2" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" />
              </svg>
            </span>
            <span>My Orders</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('my-codes')}
            className="flex items-center gap-3 w-full p-3.5 text-[14px] font-bold text-[#0f172a] text-left hover:bg-[#eff5ff] border-b border-slate-100 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284c7] grid place-items-center shrink-0">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="4" y="3" width="16" height="18" rx="3" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
            </span>
            <span>My Codes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDashboardTab('wallet');
              navigateTo('dashboard', undefined, 'wallet');
            }}
            className="flex items-center gap-3 w-full p-3.5 text-[14px] font-bold text-[#0f172a] text-left hover:bg-[#eff5ff] border-b border-slate-100 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284c7] grid place-items-center shrink-0">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <path d="M16 12.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0" />
                <path d="M3 10h18" />
              </svg>
            </span>
            <span>Wallet (৳{user.balance.toFixed(0)})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDashboardTab('referrals');
              navigateTo('dashboard', undefined, 'referrals');
            }}
            className="flex items-center gap-3 w-full p-3.5 text-[14px] font-bold text-[#0f172a] text-left hover:bg-[#eff5ff] border-b border-slate-100 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284c7] grid place-items-center shrink-0">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </span>
            <span>Referrals &amp; Rewards</span>
          </button>

          <a
            href={config.telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3.5 text-[14px] font-bold text-[#0f172a] text-left hover:bg-[#eff5ff] border-b border-slate-100 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284c7] grid place-items-center shrink-0">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v6M12 7.5v.01" />
              </svg>
            </span>
            <span>Telegram Channel</span>
          </a>

          {/* Admin Control Panel */}
          <button
            type="button"
            onClick={() => {
              closeDrawer();
              navigateTo('admin');
            }}
            className="flex items-center gap-3 w-full p-3.5 text-[14px] font-extrabold text-amber-700 bg-amber-50/80 text-left hover:bg-amber-100/80 border-b border-amber-200/60 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 text-white grid place-items-center shrink-0 text-sm shadow-2xs">
              👑
            </span>
            <div className="flex-1">
              <span className="block leading-tight font-black">Admin Panel</span>
              <span className="text-[11px] font-medium text-amber-700">A-Z ওয়েবসাইট কন্ট্রোল</span>
            </div>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <a
            href={config.telegramGroup || 'https://t.me/FF_Gamecoin'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-linear-to-r from-[#0284c7] to-[#0369a1] text-white text-[14px] font-bold shadow-xs hover:brightness-105 active:scale-98 transition-all"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M21.5 3.2 2.7 10.6c-1 .4-1 1.2-.2 1.4l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.8c.3-1.2-.5-1.8-1.2-1.5z" />
            </svg>
            <span>Live Support Group</span>
          </a>
        </div>
      </aside>
    </div>
  );
};
