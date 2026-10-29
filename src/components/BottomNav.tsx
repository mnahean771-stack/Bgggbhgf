import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { view, dashboardTab, navigateTo, setDashboardTab } = useApp();

  const isHomeActive = view === 'home' || view === 'product';
  const isOrdersActive = view === 'my-orders' || (view === 'dashboard' && dashboardTab === 'orders');
  const isWalletActive = view === 'add-money' || (view === 'dashboard' && dashboardTab === 'wallet');
  const isReferralsActive = view === 'dashboard' && dashboardTab === 'referrals';
  const isProfileActive = view === 'account' || (view === 'dashboard' && dashboardTab === 'profile');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-[560px] mx-auto h-[62px] px-2 grid grid-cols-5 items-center">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] cursor-pointer transition-colors ${
            isHomeActive ? 'text-[#0284c7] font-semibold' : 'text-gray-400 hover:text-gray-600 font-normal'
          }`}
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M3 11l9-8 9 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 21v-6h6v6" />
          </svg>
          <span>Home</span>
        </button>

        {/* 2. Orders (3D Box / Package icon matching screenshot) */}
        <button
          type="button"
          onClick={() => {
            setDashboardTab('orders');
            navigateTo('dashboard', undefined, 'orders');
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] cursor-pointer transition-colors ${
            isOrdersActive ? 'text-[#0284c7] font-semibold' : 'text-gray-400 hover:text-gray-600 font-normal'
          }`}
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <polyline points="21 8 21 21 3 21 3 8" />
            <line x1="1" y1="3" x2="23" y2="3" />
            <path d="M10 12h4" />
          </svg>
          <span>Orders</span>
        </button>

        {/* 3. Add Money (Center Elevated Button matching screenshot) */}
        <button
          type="button"
          onClick={() => {
            setDashboardTab('wallet');
            navigateTo('dashboard', undefined, 'wallet');
          }}
          className={`flex flex-col items-center justify-end pb-1 text-[11px] relative cursor-pointer ${
            isWalletActive ? 'text-[#0284c7] font-semibold' : 'text-gray-500 font-normal'
          }`}
        >
          <div className="w-[50px] h-[50px] -mt-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center border-[3.5px] border-white shadow-[0_6px_16px_rgba(2,132,199,0.4)] active:scale-95 transition-transform hover:bg-[#0369a1]">
            <svg className="w-6 h-6 fill-none stroke-current stroke-[2.6]" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="mt-0.5">Add Money</span>
        </button>

        {/* 4. Referrals (Gift Box matching screenshot) */}
        <button
          type="button"
          onClick={() => {
            setDashboardTab('referrals');
            navigateTo('dashboard', undefined, 'referrals');
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] cursor-pointer transition-colors ${
            isReferralsActive ? 'text-[#0284c7] font-semibold' : 'text-gray-400 hover:text-gray-600 font-normal'
          }`}
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          <span>Referrals</span>
        </button>

        {/* 5. Profile (User outline matching screenshot) */}
        <button
          type="button"
          onClick={() => {
            setDashboardTab('profile');
            navigateTo('dashboard', undefined, 'profile');
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] cursor-pointer transition-colors ${
            isProfileActive ? 'text-[#0284c7] font-semibold' : 'text-gray-400 hover:text-gray-600 font-normal'
          }`}
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
          </svg>
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
};
