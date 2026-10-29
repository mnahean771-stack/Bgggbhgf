import React from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';

export const Header: React.FC = () => {
  const { user, config, view, navigateTo, setDashboardTab, openDrawer, openAuth } = useApp();

  const handleBack = () => {
    if (view !== 'home') {
      navigateTo('home');
    }
  };

  const handleWalletClick = () => {
    setDashboardTab('wallet');
    navigateTo('dashboard', undefined, 'wallet');
  };

  const handleAvatarClick = () => {
    if (!user.loggedIn) {
      openAuth('login');
      return;
    }
    setDashboardTab('profile');
    navigateTo('dashboard', undefined, 'profile');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e2e8f0] shadow-xs">
      <div className="max-w-[1000px] mx-auto px-4 h-[58px] flex items-center justify-between">
        {/* Left Side: Back button + Brand Logo */}
        <div className="flex items-center gap-2">
          {view !== 'home' ? (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Back to home"
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={openDrawer}
              aria-label="Open menu drawer"
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer md:hidden"
            >
              <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}

          {/* Brand Logo with NT icon + text matching screenshots */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div className="w-[30px] h-[30px] shrink-0">
              <img
                src="/nt_logo.svg"
                alt="New TopUp Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/main-logo.jpg';
                }}
              />
            </div>
            <span className="font-extrabold text-[17px] text-[#0f172a] tracking-tight">
              {config.websiteName || 'New TopUp'}
            </span>
          </button>
        </div>

        {/* Right Side: Wallet pill badge + Profile Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Wallet pill button */}
          <button
            type="button"
            onClick={handleWalletClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#bae6fd] bg-[#f0f9ff] text-[#0284c7] font-bold text-[13px] hover:bg-[#e0f2fe] active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Wallet Balance"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="M16 12.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0" />
              <path d="M3 10h18" />
            </svg>
            <span>৳{user.balance.toFixed(0)}</span>
          </button>

          {/* User profile avatar circle */}
          <button
            type="button"
            onClick={handleAvatarClick}
            aria-label="Profile"
            className="cursor-pointer active:scale-95 transition-transform shrink-0"
          >
            <UserAvatar className="w-[34px] h-[34px] ring-2 ring-sky-100" />
          </button>
        </div>
      </div>
    </header>
  );
};
