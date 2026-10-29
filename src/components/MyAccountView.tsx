import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const MyAccountView: React.FC = () => {
  const { user, orders, codes, navigateTo, openAuth, logoutUser, showToast, config } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      showToast(`ব্যালেন্স আপডেট হয়েছে: ${user.balance.toFixed(2)}৳`);
    }, 600);
  };

  const handleCopyPin = () => {
    if (user.supportPin) {
      navigator.clipboard.writeText(user.supportPin);
      showToast(`Support PIN ${user.supportPin} কপি হয়েছে`);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-2.5 pb-[130px]">
      {/* Hero Card */}
      <section className="relative mt-4 rounded-[30px] overflow-hidden bg-white border border-[#e1e8f5] shadow-[0_18px_40px_-24px_rgba(20,40,90,0.45)]">
        <div className="relative h-[112px] bg-linear-to-r from-[#60a5fa] via-[#2563eb] to-[#1e3a8a] overflow-hidden" />
        <div className="p-[0_16px_20px] text-center">
          <div className="relative w-[104px] h-[104px] -mt-[54px] mx-auto rounded-full p-1 bg-white shadow-[0_12px_26px_-10px_rgba(15,23,42,0.5)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-linear-to-br from-[#dbeafe] to-[#eff6ff] grid place-items-center text-[#2563eb] text-[46px]">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-12 h-12 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                </svg>
              )}
            </div>
            <span className="absolute right-1 bottom-1.5 w-5 h-5 rounded-full bg-[#22c55e] border-3 border-white" />
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2 mt-3.5">
            <h1 className="text-[23px] font-extrabold tracking-tight text-[#0b1330]">{user.name || 'Guest'}</h1>
            {user.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e6f7ed] border border-[#bfe8cf] text-[#15803d] text-[12px] font-bold">
                <svg className="w-3.5 h-3.5 stroke-current stroke-[2.4]" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12l3 3 5-6" />
                </svg>
                Verified
              </span>
            )}
          </div>

          <p className="mt-1 text-[13px] text-[#666b85]">
            {user.loggedIn ? user.email || user.phone || 'অ্যাকাউন্ট ভেরিফাইড' : 'লগইন করে অর্ডার করুন'}
          </p>

          {user.loggedIn && user.supportPin && (
            <div className="inline-flex items-center gap-2 mt-3.5 p-[8px_8px_8px_14px] rounded-full bg-[#f1f5fd] border border-[#e1e8f5] text-[13px] font-semibold text-[#475569]">
              <svg className="w-4 h-4 text-[#2563eb] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Support PIN</span>
              <b className="text-[#0b1330] font-extrabold tracking-wide">{user.supportPin}</b>
              <button
                type="button"
                onClick={handleCopyPin}
                aria-label="Copy PIN"
                className="w-7 h-7 rounded-full bg-white text-[#2563eb] grid place-items-center text-[15px] cursor-pointer shadow-xs active:scale-90 transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="4" y="3" width="16" height="18" rx="3" />
                  <path d="M8 8h8M8 12h8M8 16h5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Wallet Card */}
      <section className="relative mt-3.5 p-[20px_18px_18px] rounded-[28px] text-white overflow-hidden bg-linear-to-br from-[#1d4ed8] via-[#1e3a8a] to-[#0f1b3d] shadow-[0_20px_38px_-20px_rgba(29,78,216,0.85)]">
        <div className="flex items-center justify-between relative z-1">
          <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-white/85">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M3 7a2 2 0 0 1 2-2h13v3" />
              <path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1V9H5a2 2 0 0 1-2-2z" />
              <circle cx="16" cy="14.5" r="1.3" fill="currentColor" />
            </svg>
            Wallet Balance
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh Balance"
            className={`w-[38px] h-[38px] border border-white/25 rounded-full bg-white/15 text-white grid place-items-center text-[18px] cursor-pointer active:scale-90 transition-all ${
              isSpinning ? 'animate-spin' : ''
            }`}
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M20 12a8 8 0 1 1-2.500-5.800" />
              <path d="M20 4v5h-5" />
            </svg>
          </button>
        </div>

        <div className="flex items-baseline gap-2 mt-4 relative z-1">
          <small className="text-[22px] font-semibold text-white/80">৳</small>
          <b className="text-[42px] font-extrabold tracking-tight leading-none">{user.balance.toFixed(0)}</b>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('add-money')}
          className="flex items-center justify-center gap-2 w-full h-[48px] mt-4.5 rounded-[15px] bg-white text-[#1d4ed8] text-[15.5px] font-extrabold cursor-pointer shadow-[0_10px_20px_-10px_rgba(0,0,0,0.45)] active:scale-98 transition-all relative z-1"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-[2.4]" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Money
        </button>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        <div className="p-[14px_12px] rounded-[20px] bg-white border border-[#e1e8f5] text-center shadow-[0_8px_20px_-16px_rgba(20,40,90,0.4)]">
          <b className="block text-[22px] font-extrabold text-[#0b1330]">{orders.length}</b>
          <span className="block mt-0.5 text-[12.5px] font-semibold text-[#666b85]">Total Orders</span>
        </div>
        <div className="p-[14px_12px] rounded-[20px] bg-white border border-[#e1e8f5] text-center shadow-[0_8px_20px_-16px_rgba(20,40,90,0.4)]">
          <b className="block text-[22px] font-extrabold text-[#0b1330]">{codes.length}</b>
          <span className="block mt-0.5 text-[12.5px] font-semibold text-[#666b85]">Total Codes</span>
        </div>
      </div>

      {/* Menu List */}
      <nav className="mt-3 rounded-[22px] bg-white border border-[#e1e8f5] overflow-hidden shadow-[0_8px_20px_-16px_rgba(20,40,90,0.4)]">
        <button
          type="button"
          onClick={() => navigateTo('my-orders')}
          className="flex items-center gap-3 w-full p-3.5 bg-white text-[14.5px] font-bold text-[#0f172a] text-left cursor-pointer hover:bg-[#eff5ff] active:bg-[#eff5ff] border-b border-[#e1e8f5] transition-colors"
        >
          <span className="w-9 h-9 rounded-[12px] bg-[#e8f0ff] text-[#2563eb] grid place-items-center shrink-0">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M8 7V4h8v3M3 12h18" />
            </svg>
          </span>
          <span>My Orders</span>
          <svg className="w-4 h-4 ml-auto text-slate-400 stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('my-codes')}
          className="flex items-center gap-3 w-full p-3.5 bg-white text-[14.5px] font-bold text-[#0f172a] text-left cursor-pointer hover:bg-[#eff5ff] active:bg-[#eff5ff] border-b border-[#e1e8f5] transition-colors"
        >
          <span className="w-9 h-9 rounded-[12px] bg-[#e8f0ff] text-[#2563eb] grid place-items-center shrink-0">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="4" y="3" width="16" height="18" rx="3" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          </span>
          <span>My Codes</span>
          <svg className="w-4 h-4 ml-auto text-slate-400 stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>

        <a
          href={config.telegramChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full p-3.5 bg-white text-[14.5px] font-bold text-[#0f172a] text-left cursor-pointer hover:bg-[#eff5ff] active:bg-[#eff5ff] border-b border-[#e1e8f5] transition-colors"
        >
          <span className="w-9 h-9 rounded-[12px] bg-[#e8f0ff] text-[#2563eb] grid place-items-center shrink-0">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
              <rect x="3" y="13" width="4" height="6" rx="2" />
              <rect x="17" y="13" width="4" height="6" rx="2" />
              <path d="M19 19c0 2-2 3-5 3h-1.5" />
            </svg>
          </span>
          <span>Support</span>
          <svg className="w-4 h-4 ml-auto text-slate-400 stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>

        {user.loggedIn ? (
          <button
            type="button"
            onClick={logoutUser}
            className="flex items-center gap-3 w-full p-3.5 bg-white text-[14.5px] font-bold text-[#b42318] text-left cursor-pointer hover:bg-red-50 active:bg-red-50 transition-colors"
          >
            <span className="w-9 h-9 rounded-[12px] bg-[#fee4e2] text-[#b42318] grid place-items-center shrink-0">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M12 3v8" />
                <path d="M6.5 6.5a8 8 0 1 0 11 0" />
              </svg>
            </span>
            <span>Logout</span>
            <svg className="w-4 h-4 ml-auto text-slate-400 stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openAuth('login')}
            className="flex items-center gap-3 w-full p-3.5 bg-white text-[14.5px] font-bold text-[#2563eb] text-left cursor-pointer hover:bg-blue-50 active:bg-blue-50 transition-colors"
          >
            <span className="w-9 h-9 rounded-[12px] bg-[#e8f0ff] text-[#2563eb] grid place-items-center shrink-0">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <path d="M10 17l5-5-5-5M15 12H3" />
              </svg>
            </span>
            <span>Login</span>
            <svg className="w-4 h-4 ml-auto text-slate-400 stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </nav>
    </div>
  );
};
