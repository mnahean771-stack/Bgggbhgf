import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, ProductCategory, ProductPackage, RedeemCode, User } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    config,
    updateConfig,
    products,
    updateProducts,
    updatePackagePrice,
    addPackageToProduct,
    deletePackageFromProduct,
    togglePackageStock,
    toggleProductActive,
    orders,
    updateOrderStatus,
    deleteOrder,
    addManualOrder,
    transactions,
    approveDeposit,
    rejectDeposit,
    allUsers,
    adjustUserBalance,
    updateUserRole,
    codes,
    addRedeemCode,
    deleteRedeemCode,
    liveRecentOrders,
    addLiveOrder,
    clearLiveOrders,
    navigateTo,
    showToast,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'deposits' | 'products' | 'settings' | 'users' | 'codes' | 'live'
  >('overview');

  // Filter & Search states
  const [orderFilter, setOrderFilter] = useState<'all' | 'Pending' | 'Completed' | 'Cancelled'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [depositFilter, setDepositFilter] = useState<'all' | 'Pending' | 'Completed' | 'Cancelled'>('all');

  // Manual Order Modal State
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
  const [manualPlayerId, setManualPlayerId] = useState('');
  const [manualProdId, setManualProdId] = useState(products[0]?.id || 'uid-topup');
  const [manualPkgName, setManualPkgName] = useState('115 Diamond');
  const [manualPrice, setManualPrice] = useState(79);
  const [manualMethod, setManualMethod] = useState('bKash');
  const [manualTrxId, setManualTrxId] = useState('');
  const [manualCustomer, setManualCustomer] = useState('Manual Customer');

  // Manual Balance Adjustment State
  const [selectedUserId, setSelectedUserId] = useState(user.id);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceAction, setBalanceAction] = useState<'add' | 'deduct'>('add');
  const [balanceReason, setBalanceReason] = useState('Admin Deposit');

  // New Package State
  const [selectedProductForPkg, setSelectedProductForPkg] = useState(products[0]?.id || 'uid-topup');
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgSubtitle, setNewPkgSubtitle] = useState('');

  // New Redeem Code State
  const [newCodeStr, setNewCodeStr] = useState('');
  const [newCodeValue, setNewCodeValue] = useState('');
  const [newCodeTitle, setNewCodeTitle] = useState('Special Bonus');

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    websiteName: config.websiteName,
    bKash: config.phoneNumbers.bKash,
    Nagad: config.phoneNumbers.Nagad,
    Rocket: config.phoneNumbers.Rocket,
    whatsappChannel: config.whatsappChannel || '',
    telegramChannel: config.telegramChannel || '',
    telegramGroup: config.telegramGroup || '',
    youtubeChannel: config.youtubeChannel || '',
    notificationText: config.notificationText || '',
    noticeActive: config.noticeActive !== false,
    liveOrdersActive: config.liveOrdersActive !== false
  });

  // New Live Order Broadcast State
  const [liveCustName, setLiveCustName] = useState('');
  const [liveItemName, setLiveItemName] = useState('115 Diamond 💎');

  // Calculations
  const totalRevenue = orders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + (o.price || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Completed').length;
  const pendingDeposits = transactions.filter(
    (t) => t.type === 'deposit' && t.status === 'Pending'
  );

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.playerId.toLowerCase().includes(q) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(q)) ||
      o.package.toLowerCase().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const filteredDeposits = transactions.filter((t) => {
    if (t.type !== 'deposit') return false;
    if (depositFilter === 'all') return true;
    return t.status === depositFilter;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      websiteName: settingsForm.websiteName,
      phoneNumbers: {
        bKash: settingsForm.bKash,
        Nagad: settingsForm.Nagad,
        Rocket: settingsForm.Rocket
      },
      whatsappChannel: settingsForm.whatsappChannel,
      telegramChannel: settingsForm.telegramChannel,
      telegramGroup: settingsForm.telegramGroup,
      youtubeChannel: settingsForm.youtubeChannel,
      notificationText: settingsForm.notificationText,
      noticeActive: settingsForm.noticeActive,
      liveOrdersActive: settingsForm.liveOrdersActive
    });
  };

  const handleApplyBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(balanceAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      showToast('সঠিক টাকার পরিমাণ লিখুন');
      return;
    }
    const finalDelta = balanceAction === 'add' ? amt : -amt;
    adjustUserBalance(selectedUserId, finalDelta, balanceReason);
    setBalanceAmount('');
  };

  const handleAddNewPackage = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPkgPrice);
    if (!newPkgName.trim() || isNaN(priceNum) || priceNum <= 0) {
      showToast('প্যাকেজের নাম এবং সঠিক দাম লিখুন');
      return;
    }
    const newPkg: ProductPackage = {
      id: `pkg_${Date.now()}`,
      name: newPkgName.trim(),
      price: priceNum,
      subtitle: newPkgSubtitle.trim() || undefined,
      inStock: true
    };
    addPackageToProduct(selectedProductForPkg, newPkg);
    setNewPkgName('');
    setNewPkgPrice('');
    setNewPkgSubtitle('');
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPlayerId.trim()) {
      showToast('প্লেয়ার আইডি দিন');
      return;
    }
    const prod = products.find((p) => p.id === manualProdId);
    const orderId = `NT-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US');

    const newOrder: Order = {
      id: orderId,
      status: 'Completed',
      date: dateStr,
      updated: dateStr,
      package: manualPkgName,
      price: manualPrice,
      playerId: manualPlayerId.trim(),
      paymentMethod: manualMethod,
      productName: prod?.name || 'UID Topup',
      transactionId: manualTrxId.trim() || undefined,
      customerName: manualCustomer.trim() || 'Customer'
    };

    addManualOrder(newOrder);
    setIsManualOrderOpen(false);
    setManualPlayerId('');
    setManualTrxId('');
  };

  const handleCreateRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCodeStr.trim().toUpperCase();
    const val = parseFloat(newCodeValue) || 25;
    if (!code) {
      showToast('কোড নাম লিখুন');
      return;
    }
    const newCode: RedeemCode = {
      id: `cd_${Date.now()}`,
      title: newCodeTitle.trim() || 'Admin Promo Code',
      code,
      value: val,
      date: new Date().toLocaleDateString('en-GB'),
      claimedBy: [],
      maxUses: 100
    };
    addRedeemCode(newCode);
    setNewCodeStr('');
    setNewCodeValue('');
  };

  const handleBroadcastLiveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveCustName.trim()) {
      showToast('কাস্টমারের নাম লিখুন');
      return;
    }
    addLiveOrder({
      id: `live_${Date.now()}`,
      customerName: liveCustName.trim(),
      avatarLetter: liveCustName.trim()[0].toUpperCase(),
      avatarBg: 'bg-[#0284c7]',
      itemName: liveItemName,
      status: 'Done',
      timeAgo: 'এখনই'
    });
    setLiveCustName('');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-24 font-sans">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#1e293b] border-b border-slate-700/80 px-4 py-3 shadow-md">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>ওয়েবসাইটে ফিরুন</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="font-extrabold text-[16px] sm:text-[18px] text-white tracking-tight flex items-center gap-1.5">
                <span>{config.websiteName || 'New TopUp'}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  A-Z Admin Control
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="hidden sm:inline bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              Admin: <strong className="text-white">{user.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => navigateTo('dashboard', undefined, 'profile')}
              className="px-3 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 cursor-pointer transition-colors"
            >
              প্রোফাইল
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Container */}
      <main className="max-w-[1200px] mx-auto px-4 pt-5">
        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-6 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
          {[
            { id: 'overview', label: '📊 ওভারভিউ', badge: null },
            { id: 'orders', label: '📦 অর্ডার নিয়ন্ত্রণ', badge: pendingOrdersCount ? `${pendingOrdersCount}` : null },
            { id: 'deposits', label: '💳 টাকা লোড/ডিপোজিট', badge: pendingDeposits.length ? `${pendingDeposits.length}` : null },
            { id: 'products', label: '💎 ডায়মন্ড রেট ও প্যাকেজ', badge: null },
            { id: 'settings', label: '⚙️ পেমেন্ট নম্বর ও সাইট', badge: null },
            { id: 'users', label: '👥 ইউজার ও ব্যালেন্স', badge: `${allUsers.length}` },
            { id: 'codes', label: '🎟️ রিডিম কোড', badge: `${codes.length}` },
            { id: 'live', label: '⚡ লাইভ অর্ডার ফিড', badge: null }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold shrink-0 cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#0284c7] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ========================================================
            TAB 1: OVERVIEW & DASHBOARD KPIS
            ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm">
                <span className="text-xs font-semibold text-slate-400">মোট সফল বিক্রি (Revenue)</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">৳{totalRevenue.toLocaleString()}</div>
                <span className="text-[11px] text-slate-500 mt-1 block">{completedOrdersCount} টি সফল অর্ডার থেকে</span>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm">
                <span className="text-xs font-semibold text-slate-400">পেন্ডিং অর্ডার (ডেলিভারি বাকি)</span>
                <div className="text-2xl font-black text-amber-400 mt-1">{pendingOrdersCount}</div>
                <span className="text-[11px] text-slate-500 mt-1 block">দ্রুত ডেলিভারি করুন</span>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm">
                <span className="text-xs font-semibold text-slate-400">পেন্ডিং ডিপোজিট (টাকা লোড)</span>
                <div className="text-2xl font-black text-sky-400 mt-1">{pendingDeposits.length}</div>
                <span className="text-[11px] text-slate-500 mt-1 block">bKash/Nagad TrxID যাচাই করুন</span>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm">
                <span className="text-xs font-semibold text-slate-400">নিবন্ধিত ইউজার</span>
                <div className="text-2xl font-black text-indigo-400 mt-1">{allUsers.length}</div>
                <span className="text-[11px] text-slate-500 mt-1 block">অ্যাকাউন্ট পরিচালিত হচ্ছে</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-white mb-3">কুইক অ্যাকশন (Quick Actions)</h3>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsManualOrderOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>ম্যানুয়াল অর্ডার তৈরি করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-sky-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>ডায়মন্ড রেট পরিবর্তন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-amber-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>পেমেন্ট নম্বর পরিবর্তন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('deposits')}
                  className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-emerald-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span>ডিপোজিট অ্যাপ্রুভ করুন ({pendingDeposits.length})</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-white">সর্বশেষ অর্ডারসমূহ (Recent Orders)</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-sky-400 hover:underline cursor-pointer"
                >
                  সবগুলো দেখুন ({orders.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/60 text-slate-400 text-[11px] uppercase">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Player ID</th>
                      <th className="p-3">প্যাকেজ</th>
                      <th className="p-3">মূল্য</th>
                      <th className="p-3">পেমেন্ট</th>
                      <th className="p-3">স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-700/30">
                        <td className="p-3 font-mono font-bold text-white">{ord.id}</td>
                        <td className="p-3 font-mono text-sky-300">{ord.playerId}</td>
                        <td className="p-3 font-semibold text-white">{ord.package}</td>
                        <td className="p-3 font-bold text-emerald-400">৳{ord.price}</td>
                        <td className="p-3">{ord.paymentMethod}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              ord.status === 'Completed'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : ord.status === 'Pending'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {ord.status === 'Pending' ? (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(ord.id, 'Completed')}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              ডেলিভার করুন
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[11px]">সম্পন্ন</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ORDERS MANAGER (A-Z ORDER CONTROL)
            ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {(['all', 'Pending', 'Completed', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      orderFilter === st
                        ? 'bg-[#0284c7] text-white'
                        : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st === 'all' ? 'সব অর্ডার' : st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Player ID, TrxID বা Order ID খুঁজুন..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-64"
                />
                <button
                  type="button"
                  onClick={() => setIsManualOrderOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  + নতুন অর্ডার
                </button>
              </div>
            </div>

            {/* Orders List Table */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-3">Order Details</th>
                      <th className="p-3">Player ID</th>
                      <th className="p-3">প্যাকেজ ও রেট</th>
                      <th className="p-3">পেমেন্ট ও TrxID</th>
                      <th className="p-3">স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন (A-Z কন্ট্রোল)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                          কোনো অর্ডার পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-700/30">
                          <td className="p-3">
                            <div className="font-mono font-bold text-white">{ord.id}</div>
                            <div className="text-[11px] text-slate-400">{ord.date}</div>
                            <div className="text-[10.5px] text-slate-500">{ord.productName}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                                {ord.playerId}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(ord.playerId);
                                  showToast(`Player ID "${ord.playerId}" কপি হয়েছে!`);
                                }}
                                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                                title="Copy Player ID"
                              >
                                <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                                  <rect x="9" y="9" width="13" height="13" rx="2" />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                              </button>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">{ord.customerName}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white">{ord.package}</div>
                            <div className="font-black text-emerald-400">৳{ord.price}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-white">{ord.paymentMethod}</div>
                            {ord.transactionId && (
                              <div className="font-mono text-[11px] text-amber-300">
                                Trx: {ord.transactionId}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                ord.status === 'Completed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : ord.status === 'Pending'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {ord.status !== 'Completed' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, 'Completed')}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                                  title="Mark Completed"
                                >
                                  ✅ সম্পন্ন
                                </button>
                              )}
                              {ord.status !== 'Pending' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, 'Pending')}
                                  className="px-2 py-1 rounded bg-amber-600/80 hover:bg-amber-500 text-white font-bold text-[11px] cursor-pointer"
                                  title="Mark Pending"
                                >
                                  ⏳ পেন্ডিং
                                </button>
                              )}
                              {ord.status !== 'Cancelled' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, 'Cancelled', true)}
                                  className="px-2 py-1 rounded bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                                  title="Cancel & Refund to wallet"
                                >
                                  ❌ বাতিল ও রিফান্ড
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteOrder(ord.id)}
                                className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-rose-400 cursor-pointer"
                                title="Delete Order"
                              >
                                <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: WALLET & DEPOSITS (ADD MONEY VERIFICATION)
            ======================================================== */}
        {activeTab === 'deposits' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Deposit Requests List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">টাকা জমা / ডিপোজিট রিকোয়েস্টসমূহ</h3>
                <div className="flex gap-2">
                  {(['all', 'Pending', 'Completed', 'Cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setDepositFilter(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        depositFilter === st
                          ? 'bg-[#0284c7] text-white'
                          : 'bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      {st === 'all' ? 'সব' : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase border-b border-slate-700">
                      <tr>
                        <th className="p-3">মেথড ও তারিখ</th>
                        <th className="p-3">TrxID ও পরিমাণ</th>
                        <th className="p-3">কাস্টমার</th>
                        <th className="p-3">স্ট্যাটাস</th>
                        <th className="p-3 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredDeposits.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            কোনো ডিপোজিট রিকোয়েস্ট নেই
                          </td>
                        </tr>
                      ) : (
                        filteredDeposits.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-700/30">
                            <td className="p-3">
                              <span className="font-bold text-white block">{tx.method}</span>
                              <span className="text-[11px] text-slate-400">{tx.date}</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono font-bold text-sky-400">
                                {tx.transactionId || tx.id}
                              </div>
                              <div className="font-black text-emerald-400 text-sm mt-0.5">
                                ৳{tx.amount}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-slate-300">{tx.userEmail || user.email}</span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  tx.status === 'Completed'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : tx.status === 'Pending'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-rose-500/20 text-rose-300'
                                }`}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {tx.status === 'Pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => approveDeposit(tx.id)}
                                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                                  >
                                    অ্যাপ্রুভ (টাকা যোগ)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => rejectDeposit(tx.id)}
                                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                                  >
                                    বাতিল
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-500 text-[11px]">সম্পন্ন</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Col: Direct User Balance Adjustment */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>💰 সরাসরি ব্যালেন্স যোগ / কর্তন</span>
              </h3>
              <p className="text-xs text-slate-400">
                যেকোনো ইউজারের ওয়ালেটে সরাসরি টাকা জমা দিন অথবা কেটে নিন।
              </p>

              <form onSubmit={handleApplyBalance} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    ইউজার নির্বাচন করুন
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email}) - ব্যালেন্স: ৳{u.balance}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBalanceAction('add')}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      balanceAction === 'add'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}
                  >
                    (+) টাকা যোগ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setBalanceAction('deduct')}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      balanceAction === 'deduct'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}
                  >
                    (-) টাকা কেটে নিন
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    টাকার পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 500"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">কারণ / নোট</label>
                  <input
                    type="text"
                    placeholder="যেমন: Manual Cash Deposit, Admin Reward"
                    value={balanceReason}
                    onChange={(e) => setBalanceReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                >
                  ব্যালেন্স পরিবর্তন প্রয়োগ করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: PRODUCTS & DIAMOND PRICING CONTROL
            ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-white">ডায়মন্ড ও প্যাকেজ রেট নিয়ন্ত্রণ</h3>
                <p className="text-xs text-slate-400">
                  যেকোনো প্যাকেজের দাম তাৎক্ষণিক পরিবর্তন করুন বা নতুন প্যাকেজ যুক্ত করুন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">প্রোডাক্ট ক্যাটাগরি:</span>
                <select
                  value={selectedProductForPkg}
                  onChange={(e) => setSelectedProductForPkg(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Product Packages Table */}
            {products
              .filter((p) => p.id === selectedProductForPkg)
              .map((prod) => (
                <div key={prod.id} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{prod.name}</h4>
                        <span className="text-xs text-slate-400">মোট প্যাকেজ: {prod.packages.length} টি</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleProductActive(prod.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        prod.active !== false
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {prod.active !== false ? '● লাইভ সচল আছে' : '○ বন্ধ রাখা হয়েছে'}
                    </button>
                  </div>

                  {/* Packages Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {prod.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 space-y-2.5 relative"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-white text-xs block">{pkg.name}</span>
                            {pkg.subtitle && (
                              <span className="text-[10.5px] text-slate-400">{pkg.subtitle}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => deletePackageFromProduct(prod.id, pkg.id)}
                            className="text-slate-500 hover:text-rose-400 cursor-pointer p-0.5"
                            title="Delete Package"
                          >
                            <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            </svg>
                          </button>
                        </div>

                        {/* Inline Price Editor */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-semibold">৳</span>
                          <input
                            type="number"
                            defaultValue={pkg.price}
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (val && !isNaN(val) && val !== pkg.price) {
                                updatePackagePrice(prod.id, pkg.id, val);
                              }
                            }}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1 text-xs text-emerald-300 font-black focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                          <button
                            type="button"
                            onClick={() => togglePackageStock(prod.id, pkg.id)}
                            className={`font-semibold cursor-pointer ${
                              pkg.inStock !== false ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {pkg.inStock !== false ? '✓ In Stock' : '✗ Out of Stock'}
                          </button>
                          <span className="text-slate-500 text-[10px]">Blur to save</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Package Form */}
                  <div className="mt-5 pt-4 border-t border-slate-700">
                    <h5 className="font-bold text-xs text-sky-400 mb-2.5">
                      + এই ক্যাটাগরিতে নতুন প্যাকেজ যোগ করুন
                    </h5>
                    <form onSubmit={handleAddNewPackage} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        placeholder="প্যাকেজের নাম (যেমন: 500 Diamond)"
                        value={newPkgName}
                        onChange={(e) => setNewPkgName(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="number"
                        placeholder="দাম (যেমন: 350)"
                        value={newPkgPrice}
                        onChange={(e) => setNewPkgPrice(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="text"
                        placeholder="সাবটাইটেল (ঐচ্ছিক)"
                        value={newPkgSubtitle}
                        onChange={(e) => setNewPkgSubtitle(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="submit"
                        className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
                      >
                        যুক্ত করুন
                      </button>
                    </form>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ========================================================
            TAB 5: PAYMENT NUMBERS & SITE SETTINGS
            ======================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 max-w-[800px] mx-auto space-y-6">
            <div>
              <h3 className="font-bold text-base text-white">পেমেন্ট নম্বর ও ওয়েবসাইট সেটিংস</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                এখানে দেওয়া নম্বর ও লিংক সরাসরি পুরো ওয়েবসাইটে লাইভ কাজ করবে।
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Payment Numbers */}
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-xs text-sky-400 uppercase tracking-wider">
                  পেমেন্ট গ্রহণ নম্বর (Payment Numbers)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      বিকাশ নম্বর (bKash)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.bKash}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bKash: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      নগদ নম্বর (Nagad)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.Nagad}
                      onChange={(e) => setSettingsForm({ ...settingsForm, Nagad: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      রকেট নম্বর (Rocket)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.Rocket}
                      onChange={(e) => setSettingsForm({ ...settingsForm, Rocket: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Support & Community Links */}
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-xs text-sky-400 uppercase tracking-wider">
                  সাপোর্ট ও সোশ্যাল চ্যানেল লিঙ্ক
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      WhatsApp চ্যানেল / সাপোর্ট
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappChannel}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, whatsappChannel: e.target.value })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Telegram চ্যানেল
                    </label>
                    <input
                      type="text"
                      value={settingsForm.telegramChannel}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, telegramChannel: e.target.value })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Telegram হেল্প গ্রুপ
                    </label>
                    <input
                      type="text"
                      value={settingsForm.telegramGroup}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, telegramGroup: e.target.value })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      YouTube চ্যানেল লিঙ্ক
                    </label>
                    <input
                      type="text"
                      value={settingsForm.youtubeChannel}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, youtubeChannel: e.target.value })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Website Name & Notice */}
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-xs text-sky-400 uppercase tracking-wider">
                  ওয়েবসাইট নাম ও নোটিশ ব্যানার
                </h4>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    ওয়েবসাইটের নাম (Website Title)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.websiteName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, websiteName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    শীর্ষ নোটিশ টেক্সট (Marquee Announcement)
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.notificationText}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, notificationText: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={settingsForm.noticeActive}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, noticeActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-sky-600"
                    />
                    <span>নোটিশ ব্যানার চালু রাখুন</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={settingsForm.liveOrdersActive}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, liveOrdersActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-sky-600"
                    />
                    <span>হোমপেজ লাইভ অর্ডার স্ট্রিম চালু রাখুন</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm cursor-pointer shadow-md transition-all"
              >
                💾 সব সেটিংস সংরক্ষণ করুন (Save Settings)
              </button>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 6: USER MANAGEMENT
            ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">ব্যবহারকারী নিয়ন্ত্রণ (User Accounts)</h3>
                <span className="text-xs text-slate-400">
                  মোট ইউজার: {allUsers.length} জন (ব্যালেন্স ও রোল পরিবর্তন করুন)
                </span>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-3">ইউজার প্রোফাইল</th>
                      <th className="p-3">যোগাযোগ</th>
                      <th className="p-3">ব্যালেন্স</th>
                      <th className="p-3">সাপোর্ট পিন / রেফারেল</th>
                      <th className="p-3">রোল</th>
                      <th className="p-3 text-right">ব্যালেন্স অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {allUsers.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-700/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white uppercase text-xs">
                              {usr.name[0]}
                            </div>
                            <div>
                              <div className="font-bold text-white">{usr.name}</div>
                              <div className="text-[11px] text-slate-400">{usr.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-300">{usr.phone || '01983003336'}</div>
                          <div className="text-[10.5px] text-slate-500">
                            Joined: {usr.createdAt || '2026-01-15'}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-black text-emerald-400 text-sm">৳{usr.balance}</div>
                          {usr.referralEarnings ? (
                            <div className="text-[10.5px] text-amber-300">
                              Ref: ৳{usr.referralEarnings}
                            </div>
                          ) : null}
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                            {usr.supportPin}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateUserRole(usr.id, usr.role === 'Admin' ? 'User' : 'Admin')
                            }
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                              usr.role === 'Admin'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {usr.role || 'User'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUserId(usr.id);
                                setActiveTab('deposits');
                              }}
                              className="px-2.5 py-1 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-[11px] cursor-pointer"
                            >
                              টাকা যোগ/কর্তন
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: REDEEM CODES
            ======================================================== */}
        {activeTab === 'codes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4">
                <h3 className="font-bold text-sm text-white">সক্রিয় রিডিম কোডসমূহ ({codes.length})</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {codes.map((cd) => (
                  <div
                    key={cd.id}
                    className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-black text-amber-400 text-base tracking-wider block">
                          {cd.code}
                        </span>
                        <span className="text-xs text-slate-300 font-medium">{cd.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteRedeemCode(cd.id)}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                        title="Delete Code"
                      >
                        <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                      <span className="text-emerald-400 font-bold">বোনাস: ৳{cd.value || 0}</span>
                      <span className="text-slate-400 text-[11px]">তারিখ: {cd.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Code Form */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white">নতুন রিডিম কোড তৈরি করুন</h3>
              <form onSubmit={handleCreateRedeemCode} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">কোড নাম</label>
                  <input
                    type="text"
                    placeholder="যেমন: FREE50 বা EID2026"
                    value={newCodeStr}
                    onChange={(e) => setNewCodeStr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    বোনাস মান (৳ বা ডায়মন্ড)
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 50"
                    value={newCodeValue}
                    onChange={(e) => setNewCodeValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">শিরোনাম</label>
                  <input
                    type="text"
                    placeholder="যেমন: Eid Special Bonus"
                    value={newCodeTitle}
                    onChange={(e) => setNewCodeTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                >
                  কোড তৈরি করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: LIVE ORDER FEED STREAM
            ======================================================== */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">হোমপেজ লাইভ ফিড আইটেমসমূহ</h3>
                  <span className="text-xs text-slate-400">
                    এখানে যে অর্ডারগুলো আছে তা ভিজিটরদের ট্রাস্ট ও কনভার্সন বাড়ায়।
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearLiveOrders}
                  className="px-3 py-1 rounded bg-rose-600/30 text-rose-300 text-xs font-bold hover:bg-rose-600/40 cursor-pointer"
                >
                  ফিড ক্লিয়ার করুন
                </button>
              </div>

              <div className="space-y-2">
                {liveRecentOrders.map((itm) => (
                  <div
                    key={itm.id}
                    className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          itm.avatarBg || 'bg-[#0284c7]'
                        }`}
                      >
                        {itm.avatarLetter || itm.customerName[0]}
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">{itm.customerName}</span>
                        <span className="text-[11px] text-slate-400">{itm.itemName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        Done
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{itm.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Broadcast Live Order Form */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white">লাইভ ফিডে সম্প্রচার করুন</h3>
              <form onSubmit={handleBroadcastLiveOrder} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    কাস্টমারের নাম
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: Sabbir Hossain"
                    value={liveCustName}
                    onChange={(e) => setLiveCustName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">প্যাকেজ নাম</label>
                  <select
                    value={liveItemName}
                    onChange={(e) => setLiveItemName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="115 Diamond 💎">115 Diamond 💎</option>
                    <option value="240 Diamond 💎">240 Diamond 💎</option>
                    <option value="Weekly 1x 💳">Weekly 1x 💳</option>
                    <option value="Monthly 💳">Monthly 💳</option>
                    <option value="Level Up Pass 🏆">Level Up Pass 🏆</option>
                    <option value="1000 FF Likes ❤️">1000 FF Likes ❤️</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                >
                  লাইভ ফিডে পোস্ট করুন
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Manual Order Modal */}
      {isManualOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white">নতুন ম্যানুয়াল অর্ডার এন্ট্রি</h4>
              <button
                type="button"
                onClick={() => setIsManualOrderOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Player ID *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: 2847291048"
                  value={manualPlayerId}
                  onChange={(e) => setManualPlayerId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">প্যাকেজ নাম</label>
                  <input
                    type="text"
                    value={manualPkgName}
                    onChange={(e) => setManualPkgName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">মূল্য (৳)</label>
                  <input
                    type="number"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">পেমেন্ট মেথড</label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Wallet Pay">Wallet Pay</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">TrxID</label>
                  <input
                    type="text"
                    placeholder="ঐচ্ছিক"
                    value={manualTrxId}
                    onChange={(e) => setManualTrxId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">কাস্টমার নাম</label>
                <input
                  type="text"
                  value={manualCustomer}
                  onChange={(e) => setManualCustomer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualOrderOpen(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  অর্ডার সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
