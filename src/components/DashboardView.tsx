import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';

export const DashboardView: React.FC = () => {
  const {
    user,
    orders,
    transactions,
    dashboardTab,
    setDashboardTab,
    navigateTo,
    config,
    showToast,
    logoutUser,
    claimReferralBalance,
    updateUserPhoto,
    updateUserName,
    removeUserPhoto
  } = useApp();

  const [referralSubTab, setReferralSubTab] = useState<'people' | 'earnings' | 'activity'>('people');
  const [claimAmount, setClaimAmount] = useState<string>('');
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(user.name || 'Md Nahean');
  const [showBottomInstallBanner, setShowBottomInstallBanner] = useState(true);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const referralCode = user.referralCode || 'X638J';
  const referralLink = `https://newtopup.com/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    showToast('রেফারেল লিঙ্ক কপি করা হয়েছে!');
  };

  const handleCopySupportPin = () => {
    navigator.clipboard.writeText(referralCode);
    showToast(`Support code "${referralCode}" কপি করা হয়েছে!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateUserPhoto(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleClaim = () => {
    const amt = parseFloat(claimAmount);
    if (!amt || isNaN(amt)) {
      showToast('টাকার পরিমাণ লিখুন');
      return;
    }
    const success = claimReferralBalance(amt);
    if (success) {
      setClaimAmount('');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameInput.trim()) {
      showToast('আপনার নাম লিখুন');
      return;
    }
    updateUserName(fullNameInput.trim());
    setIsNameModalOpen(false);
  };

  const handleInstallApp = () => {
    showToast('New TopUp অ্যাপ ইনস্টলেশন শুরু হচ্ছে...');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-[140px]">
      {/* Top Header - Exact match to Screenshots */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#e2e8f0] shadow-xs">
        <div className="max-w-[760px] mx-auto px-3.5 h-[58px] flex items-center justify-between">
          {/* Back button & Brand Logo */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <svg className="w-5 h-5 fill-none stroke-current stroke-[2.4]" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

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

          {/* Right Header items: Wallet pill + Profile Avatar */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setDashboardTab('wallet')}
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

            <button
              type="button"
              onClick={() => setDashboardTab('profile')}
              aria-label="Profile"
              className="cursor-pointer active:scale-95 transition-transform flex items-center gap-1.5"
            >
              <UserAvatar className="w-[34px] h-[34px] ring-2 ring-sky-100" />
              {dashboardTab === 'profile' && (
                <span className="hidden sm:inline text-xs font-bold text-slate-700">Md</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-[760px] mx-auto px-3.5 pt-3">
        {/* Subtle Back Text link matching screenshot 2 & 4 */}
        <div className="mb-2.5">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-[#0284c7] transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2.4]" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* ========================================================
            PROFILE TAB HEADER (Screenshot 2 & 3) vs OTHER TABS (Screenshot 1 & 4)
            ======================================================== */}
        {dashboardTab === 'profile' ? (
          /* Profile Tab Extended Card - EXACT match to Screenshot 2 & 3 */
          <section className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs relative">
            {/* Top row: Avatar + Name + Logout */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <UserAvatar className="w-16 h-16 shadow-xs ring-2 ring-[#e0f2fe]" />
                </div>
                <div>
                  <h2 className="font-extrabold text-[17px] text-gray-900 leading-tight">
                    {user.name || 'Md Nahean'}
                  </h2>
                  <p className="text-[12.5px] text-gray-500 mt-0.5">
                    {user.email || 'mnahean771@gmail.com'}
                  </p>
                  <div className="inline-flex items-center gap-1 mt-1 text-[12px] font-medium text-slate-500">
                    <svg className="w-3.5 h-3.5 text-slate-500 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    <span>Member</span>
                  </div>
                </div>
              </div>

              {/* Top Right: Logout Button + Edit Button with Dropdown (Screenshot 3) */}
              <div className="flex flex-col items-end gap-2 relative">
                <button
                  type="button"
                  onClick={logoutUser}
                  className="flex items-center gap-1 text-[13px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer transition-colors active:scale-95"
                >
                  <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>

                {/* Hidden File Input for Real Photo Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Edit Pencil Button (Screenshot 3) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsEditMenuOpen((prev) => !prev)}
                    aria-label="Edit Profile"
                    className="w-9 h-9 rounded-xl border border-[#bae6fd] bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center hover:bg-[#e0f2fe] cursor-pointer active:scale-90 transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  {/* EDIT PROFILE Dropdown Menu - EXACT match to Screenshot 3 */}
                  {isEditMenuOpen && (
                    <>
                      {/* Click outside backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsEditMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-11 z-50 w-44 rounded-2xl bg-white border border-slate-100 shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                          EDIT PROFILE
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsEditMenuOpen(false);
                            fileInputRef.current?.click();
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <svg className="w-4 h-4 text-[#0284c7] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                          <span>Change photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsEditMenuOpen(false);
                            setIsNameModalOpen(true);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <svg className="w-4 h-4 text-[#0284c7] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>Change name</span>
                        </button>

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setIsEditMenuOpen(false);
                            removeUserPhoto();
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <svg className="w-4 h-4 text-rose-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          <span>Remove photo</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 2 Stats Cards: Wallet Balance & Total Spent matching Screenshot 2 */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Card 1: Wallet Balance */}
              <div className="p-3.5 rounded-xl bg-[#f0f9ff] border border-sky-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <svg className="w-4 h-4 text-[#0284c7] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="3" y="6" width="18" height="13" rx="2" />
                    <path d="M16 12.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0" />
                    <path d="M3 10h18" />
                  </svg>
                  <span>Wallet Balance</span>
                </div>
                <div className="text-[19px] font-extrabold text-[#0284c7] mt-1">
                  ৳{user.balance.toFixed(2)}
                </div>
              </div>

              {/* Card 2: Total Spent */}
              <div className="p-3.5 rounded-xl bg-[#f0f9ff] border border-sky-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <svg className="w-4 h-4 text-slate-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  <span>Total Spent</span>
                </div>
                <div className="text-[19px] font-extrabold text-slate-900 mt-1">
                  ৳0.00
                </div>
              </div>
            </div>

            {/* Support PIN Row matching Screenshot 2 */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[13.5px] text-slate-900 leading-tight">Support PIN</h4>
                <p className="text-[11.5px] text-slate-400 mt-0.5">
                  Share your referral code for invites or support.
                </p>
              </div>

              <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                <span className="px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800">
                  {referralCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopySupportPin}
                  aria-label="Copy support code"
                  className="px-2 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* Standard User Summary Card matching Screenshot 1 & 4 */
          <section className="bg-white rounded-2xl border border-[#e2e8f0] p-4.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <UserAvatar className="w-13 h-13 shadow-xs ring-2 ring-[#e0f2fe] shrink-0" />
              <div className="min-w-0">
                <h2 className="font-bold text-[16px] text-gray-900 leading-tight truncate">
                  {user.name || 'Md Nahean'}
                </h2>
                <p className="text-[12.5px] text-gray-500 mt-0.5 truncate">
                  {user.email || 'mnahean771@gmail.com'}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 pl-3">
              <span className="text-[12px] font-medium text-gray-400 block">Wallet</span>
              <span className="text-[19px] font-extrabold text-[#0284c7] tracking-tight">
                ৳{user.balance.toFixed(2)}
              </span>
            </div>
          </section>
        )}

        {/* Tab Segment Controls - Exact 4 tabs as shown in all screenshots */}
        <nav className="mt-4 bg-[#f1f5f9] p-1 rounded-xl grid grid-cols-4 gap-1 text-[13px] font-medium text-gray-600">
          {/* Orders Tab */}
          <button
            type="button"
            onClick={() => setDashboardTab('orders')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all cursor-pointer ${
              dashboardTab === 'orders'
                ? 'bg-white text-[#0284c7] font-semibold shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
              <rect x="4" y="8" width="16" height="13" rx="2" />
              <path d="M8 8V6a4 4 0 0 1 8 0v2" />
            </svg>
            <span>Orders</span>
          </button>

          {/* Wallet Tab */}
          <button
            type="button"
            onClick={() => setDashboardTab('wallet')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all cursor-pointer ${
              dashboardTab === 'wallet'
                ? 'bg-white text-[#0284c7] font-semibold shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="M16 12.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0" />
              <path d="M3 10h18" />
            </svg>
            <span>Wallet</span>
          </button>

          {/* Referrals Tab */}
          <button
            type="button"
            onClick={() => setDashboardTab('referrals')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all cursor-pointer ${
              dashboardTab === 'referrals'
                ? 'bg-white text-[#0284c7] font-semibold shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" rx="1" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span>Referrals</span>
          </button>

          {/* Profile Tab */}
          <button
            type="button"
            onClick={() => setDashboardTab('profile')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all cursor-pointer ${
              dashboardTab === 'profile'
                ? 'bg-white text-[#0284c7] font-semibold shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
            </svg>
            <span>Profile</span>
          </button>
        </nav>

        {/* ========================================================
            TAB 1: WALLET - Exact match to Screenshot 1
            ======================================================== */}
        {dashboardTab === 'wallet' && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-200">
            {/* AVAILABLE BALANCE CARD */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block">
                    AVAILABLE BALANCE
                  </span>
                  <div className="text-[32px] font-extrabold text-[#0284c7] tracking-tight mt-1">
                    ৳{user.balance.toFixed(2)}
                  </div>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                    <rect x="3" y="6" width="18" height="13" rx="2" />
                    <path d="M16 12.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0" />
                    <path d="M3 10h18" />
                  </svg>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#f1f5f9] my-4" />

              {/* Description */}
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Add balance instantly with bKash, Nagad, or Rocket — verified automatically when possible.
              </p>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => navigateTo('add-money')}
                className="w-full mt-4 py-3.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-[15px] rounded-xl shadow-xs transition-colors cursor-pointer text-center block active:scale-98"
              >
                Add balance
              </button>
            </div>

            {/* PAYMENT HISTORY CARD */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5.5 shadow-xs">
              <h3 className="font-bold text-[16px] text-gray-900">Payment history</h3>

              <div className="py-7 text-left">
                {transactions.length === 0 ? (
                  <p className="text-[13.5px] text-gray-500">
                    No wallet/top-up/direct payment history yet.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{tx.description}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">{tx.date} · {tx.method}</p>
                        </div>
                        <span className={`font-black text-sm ${tx.type === 'deposit' || tx.type === 'referral' ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {tx.type === 'deposit' || tx.type === 'referral' ? '+' : '-'}৳{tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination footer matching screenshot */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Page 1 of 1 · Total {transactions.length}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed text-xs font-medium"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed text-xs font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ORDERS
            ======================================================== */}
        {dashboardTab === 'orders' && (
          <div className="mt-4 animate-in fade-in duration-200">
            {orders.length === 0 ? (
              <div className="bg-transparent py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-gray-300">
                  <svg className="w-12 h-12 fill-none stroke-current stroke-[1.4]" viewBox="0 0 24 24">
                    <rect x="4" y="8" width="16" height="13" rx="2" />
                    <path d="M8 8V6a4 4 0 0 1 8 0v2" />
                  </svg>
                </div>
                <p className="text-[14px] font-medium text-gray-500 mt-2">
                  No orders yet
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Order Now
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-[#e2e8f0] p-4.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-mono font-bold text-gray-400">
                        Order #{ord.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          ord.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : ord.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-baseline justify-between">
                      <div>
                        <h4 className="font-bold text-[15px] text-gray-900">{ord.productName}</h4>
                        <p className="text-xs text-[#0284c7] font-semibold mt-0.5">
                          {ord.package} · Player ID: {ord.playerId}
                        </p>
                      </div>
                      <span className="text-[16px] font-extrabold text-[#0284c7]">
                        ৳{ord.price}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                      <span>{ord.date}</span>
                      <span>
                        {ord.paymentMethod} {ord.transactionId ? `· Trx: ${ord.transactionId}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: REFERRALS - Exact match to Screenshot 4
            ======================================================== */}
        {dashboardTab === 'referrals' && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-200">
            {/* Card 1: Your Referral Link Card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-50 text-[#0284c7] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </span>
                <h3 className="font-bold text-[14px] text-slate-900">Your referral link</h3>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Share this link. You earn 0.3% when someone you refer completes a purchase.
              </p>

              {/* Link input with copy button matching screenshot */}
              <div className="mt-3 flex items-center rounded-xl border border-sky-200 bg-[#f0f9ff] overflow-hidden">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 px-3.5 py-2.5 text-xs font-mono font-semibold text-slate-800 bg-transparent outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Copy referral link"
                  className="px-3.5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card 2: 3 Metrics Cards matching screenshot */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Referred */}
              <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs text-center flex flex-col items-center justify-center">
                <svg className="w-5 h-5 text-sky-500 fill-none stroke-current stroke-2 mb-1" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-[18px] font-black text-slate-900 leading-tight">
                  {user.totalReferrals || 0}
                </span>
                <span className="text-[11px] font-medium text-slate-400 mt-0.5">Referred</span>
              </div>

              {/* Total Earned */}
              <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs text-center flex flex-col items-center justify-center">
                <svg className="w-5 h-5 text-sky-500 fill-none stroke-current stroke-2 mb-1" viewBox="0 0 24 24">
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
                <span className="text-[18px] font-black text-slate-900 leading-tight">
                  ৳{(user.referralEarnings || 0).toFixed(2)}
                </span>
                <span className="text-[11px] font-medium text-slate-400 mt-0.5">Total earned</span>
              </div>

              {/* Available */}
              <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs text-center flex flex-col items-center justify-center">
                <svg className="w-5 h-5 text-sky-500 fill-none stroke-current stroke-2 mb-1" viewBox="0 0 24 24">
                  <rect x="3" y="6" width="18" height="13" rx="2" />
                  <path d="M16 12.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0" />
                  <path d="M3 10h18" />
                </svg>
                <span className="text-[18px] font-black text-slate-900 leading-tight">
                  ৳{(user.referralEarnings || 0).toFixed(2)}
                </span>
                <span className="text-[11px] font-medium text-slate-400 mt-0.5">Available</span>
              </div>
            </div>

            {/* Card 3: Claim Balance Card matching screenshot */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-50 text-[#0284c7] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="3" y="6" width="18" height="13" rx="2" />
                    <path d="M16 12.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0" />
                    <path d="M3 10h18" />
                  </svg>
                </span>
                <h3 className="font-bold text-[14px] text-slate-900">Claim balance</h3>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Available: <b className="text-[#0284c7]">৳{(user.referralEarnings || 0).toFixed(2)}</b> · Min:{' '}
                <b>৳100.00</b>
                <br />
                Earn from referrals to claim or withdraw.
              </p>

              <div className="mt-3.5 space-y-2.5">
                <label className="block text-xs font-semibold text-slate-500">Amount (৳)</label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden px-3">
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 py-2.5 text-sm font-semibold text-slate-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setClaimAmount(String(user.referralEarnings || 0))}
                    className="text-xs font-bold text-slate-400 hover:text-[#0284c7] cursor-pointer"
                  >
                    Max
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClaim}
                  className="w-full py-3 rounded-xl bg-[#38bdf8] hover:bg-[#0284c7] text-white font-extrabold text-[14px] shadow-xs active:scale-98 transition-colors cursor-pointer"
                >
                  Claim to Wallet
                </button>
              </div>
            </div>

            {/* Card 4: People you referred with Subtabs matching screenshot */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-sky-50 text-[#0284c7] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-bold text-[14px] text-slate-900 leading-tight">People you referred</h3>
                    <p className="text-[11px] text-slate-400">Members who joined using your link</p>
                  </div>
                </div>

                {/* Subtabs Pill Switcher matching screenshot */}
                <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setReferralSubTab('people')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      referralSubTab === 'people'
                        ? 'bg-[#0284c7] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    People
                  </button>
                  <button
                    type="button"
                    onClick={() => setReferralSubTab('earnings')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      referralSubTab === 'earnings'
                        ? 'bg-[#0284c7] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Earnings
                  </button>
                  <button
                    type="button"
                    onClick={() => setReferralSubTab('activity')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      referralSubTab === 'activity'
                        ? 'bg-[#0284c7] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Activity
                  </button>
                </div>
              </div>

              {/* Subtab Content: Empty State matching screenshot */}
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-2">
                  <svg className="w-7 h-7 fill-none stroke-current stroke-[1.6]" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <h4 className="font-bold text-[14px] text-slate-700">No referrals yet</h4>
                <p className="text-xs text-slate-400 max-w-[260px] mt-1 leading-relaxed">
                  Share your link above to start earning commission.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: PROFILE DETAILS - Exact match to Screenshot 2
            ======================================================== */}
        {dashboardTab === 'profile' && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-200">
            {/* Full Name & Email Form Card matching Screenshot 2 */}
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-[#0284c7] focus:ring-3 focus:ring-sky-500/15"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={user.email || 'mnahean771@gmail.com'}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              {/* Role: User and Save Changes Button + Admin Panel Button */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-slate-500">
                    Role: <b className="text-slate-700">{user.role || 'User'}</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateTo('admin')}
                    className="ml-2 px-3 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-300 font-extrabold text-[11.5px] hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
                    title="Open Website Admin Panel"
                  >
                    <span>👑</span>
                    <span>Admin Panel</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-[13px] shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Linked Accounts Card matching Screenshot 2 */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs">
              <h3 className="font-bold text-[15px] text-slate-900 mb-3.5">Linked Accounts</h3>

              <div className="space-y-3">
                {/* Email row */}
                <div className="flex items-center justify-between text-xs font-semibold py-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <svg className="w-4 h-4 text-slate-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span>Email</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('ইমেইল ইতিমধ্যে লিঙ্ক করা আছে')}
                    className="text-[#0284c7] hover:underline cursor-pointer"
                  >
                    Link
                  </button>
                </div>

                {/* Google row */}
                <div className="flex items-center justify-between text-xs font-semibold py-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <svg className="w-4 h-4 text-slate-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span>Google</span>
                  </div>
                  <span className="text-emerald-600 font-bold">
                    Linked
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            BOTTOM CONTACT & SUPPORT SECTION (Screenshots 2 & 4)
            ======================================================== */}
        <div className="mt-8 rounded-2xl bg-linear-to-b from-[#ffbb38] to-[#f59e0b] p-6 text-center text-[#1e293b] shadow-xs">
          <h3 className="text-[18px] font-extrabold text-[#0f172a]">Contact &amp; support</h3>
          <p className="text-[13px] text-slate-800 font-medium mt-1">
            Choose a channel — we respond as soon as we can
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-4">
            {config.whatsappChannel && (
              <a
                href={config.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.98.59 3.91 1.7 5.56L2 22l4.69-1.78c1.6 1.05 3.47 1.69 5.35 1.69h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7C17.18 3.03 14.7 2 12.04 2z" />
                </svg>
                <span>WhatsApp channel</span>
              </a>
            )}

            <a
              href={config.telegramGroup || 'https://t.me/FF_Gamecoin'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M21.5 3.2 2.7 10.6c-1 .4-1 1.2-.2 1.4l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.8c.3-1.2-.5-1.8-1.2-1.5z" />
              </svg>
              <span>Telegram</span>
            </a>

            <a
              href={config.telegramChannel || 'https://t.me/ffgamecoin'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0369a1] hover:bg-[#075985] text-white font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M21.5 3.2 2.7 10.6c-1 .4-1 1.2-.2 1.4l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.8c.3-1.2-.5-1.8-1.2-1.5z" />
              </svg>
              <span>Telegram channel</span>
            </a>
          </div>
        </div>

        {/* Install NewTopUp Card matching Screenshot 2 & 4 */}
        <div className="mt-4 p-4 rounded-2xl bg-[#ffedd5]/60 border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-1 border border-amber-100 shadow-2xs shrink-0">
              <img src="/nt_logo.svg" alt="NewTopUp" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-extrabold text-[15px] text-[#0f172a]">Install NewTopUp</h4>
              <p className="text-xs text-slate-600 mt-0.5">One-tap top-ups from your home screen</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInstallApp}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Install</span>
          </button>
        </div>

        {/* Footer info matching Screenshot 2 */}
        <div className="mt-7 text-center text-xs text-slate-500 space-y-1">
          <p>© 2026 {config.websiteName || 'New TopUp'}. All rights reserved.</p>
          <p>
            <button
              type="button"
              onClick={() => showToast('গোপনীয়তা নীতি: আপনার সমস্ত ডাটা সুরক্ষিত')}
              className="text-slate-600 hover:text-[#0284c7] underline cursor-pointer"
            >
              Privacy Policy
            </button>
          </p>
          <p className="text-[11px] text-slate-400">
            Powered by <b className="text-slate-600">UcBot Technologies</b>
          </p>
        </div>
      </main>

      {/* Floating Bottom App Install Banner matching Screenshot 2 & 4 */}
      {showBottomInstallBanner && (
        <div className="fixed bottom-[68px] left-3.5 right-3.5 z-40 max-w-[500px] mx-auto p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-xl flex items-center justify-between gap-2.5 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-50 p-1 border border-slate-200 shrink-0">
              <img src="/nt_logo.svg" alt="NewTopUp" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <b className="block text-xs font-extrabold text-slate-900 truncate">New TopUp</b>
              <p className="text-[11px] text-slate-500 truncate">Install The App For Better Experience!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInstallApp}
              className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-extrabold shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => setShowBottomInstallBanner(false)}
              className="w-6 h-6 rounded-full text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Change Name Modal */}
      {isNameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-[360px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-[16px] text-slate-900 mb-3">নাম পরিবর্তন করুন</h3>
            <input
              type="text"
              value={fullNameInput}
              onChange={(e) => setFullNameInput(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold outline-none focus:border-[#0284c7]"
            />
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsNameModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex-1 py-2 rounded-xl bg-[#0284c7] text-white text-xs font-bold shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
