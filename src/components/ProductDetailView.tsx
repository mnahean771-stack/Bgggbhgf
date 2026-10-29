import React, { useState, useEffect } from 'react';
import { PAYMENT_STEPS } from '../config/siteConfig';
import { useApp } from '../context/AppContext';
import { checkFreeFirePlayer } from '../services/playerChecker';

export const ProductDetailView: React.FC = () => {
  const { selectedProductId, navigateTo, user, placeOrder, showToast, openAuth, config, products } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedPackage, setSelectedPackage] = useState(product.packages[0] || null);
  const [playerId, setPlayerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Wallet Pay' | 'Instant Pay'>('Wallet Pay');
  const [checkingName, setCheckingName] = useState(false);
  const [playerNameStatus, setPlayerNameStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [isRefreshingBal, setIsRefreshingBal] = useState(false);

  // Instant Payment Modal State
  const [isInstantPayOpen, setIsInstantPayOpen] = useState(false);
  const [instantMethod, setInstantMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [instantTrxId, setInstantTrxId] = useState('');

  useEffect(() => {
    setSelectedPackage(product.packages[0] || null);
    setPlayerId('');
    setPlayerNameStatus(null);
  }, [product]);

  const isNumericGame = product.id !== 'roblox' && product.id !== 'clash-of-clans';

  const handleCheckPlayerId = async () => {
    const cleanId = playerId.trim();

    if (product.id === 'roblox') {
      if (cleanId.length < 3) {
        setPlayerNameStatus({ type: 'err', text: 'সঠিক Roblox ইউজারনেম দিন (কমপক্ষে ৩ অক্ষর)' });
        return;
      }
      setPlayerNameStatus({ type: 'ok', text: `Roblox ইউজার: ${cleanId} (যাচাইকৃত)` });
      return;
    }

    if (product.id === 'clash-of-clans') {
      const tag = cleanId.startsWith('#') ? cleanId : '#' + cleanId;
      if (tag.length < 4) {
        setPlayerNameStatus({ type: 'err', text: 'সঠিক প্লেয়ার ট্যাগ দিন (যেমন: #9V8Y2UQQP)' });
        return;
      }
      setPlayerNameStatus({ type: 'ok', text: `COC প্লেয়ার ট্যাগ: ${tag.toUpperCase()} (যাচাইকৃত)` });
      return;
    }

    if (cleanId.length < 6) {
      setPlayerNameStatus({ type: 'err', text: 'সঠিক প্লেয়ার আইডি দিন (কমপক্ষে ৬ সংখ্যা)' });
      return;
    }

    setCheckingName(true);
    setPlayerNameStatus(null);

    const result = await checkFreeFirePlayer(cleanId);
    setCheckingName(false);

    if (result.success && result.name) {
      setPlayerNameStatus({ type: 'ok', text: `আইডি: ${cleanId} (${result.name})` });
    } else {
      setPlayerNameStatus({
        type: 'err',
        text: result.error || 'এই আইডির কোনো প্লেয়ার পাওয়া যায়নি'
      });
    }
  };

  const handleBuy = () => {
    if (!user.loggedIn) {
      openAuth('login');
      return;
    }

    if (!selectedPackage) {
      showToast('আগে একটি রিচার্জ প্যাকেজ সিলেক্ট করুন');
      return;
    }

    const cleanId = playerId.trim();
    const minLength = product.id === 'roblox' ? 3 : product.id === 'clash-of-clans' ? 4 : 6;
    if (cleanId.length < minLength) {
      showToast(product.inputLabel);
      return;
    }

    if (paymentMethod === 'Instant Pay') {
      // Open Instant Payment Modal so user can send money via bKash/Nagad and provide TrxID
      setIsInstantPayOpen(true);
      return;
    }

    // Wallet Pay
    if (user.balance < selectedPackage.price) {
      showToast(`ওয়ালেটে পর্যাপ্ত টাকা নেই! প্রয়োজন ${selectedPackage.price}৳, আছে ${user.balance}৳`);
      return;
    }

    const success = placeOrder(
      product.id,
      selectedPackage.name,
      selectedPackage.price,
      cleanId,
      'Wallet Pay'
    );

    if (success) {
      setTimeout(() => {
        navigateTo('dashboard', undefined, 'orders');
      }, 1000);
    }
  };

  const handleConfirmInstantPay = () => {
    const cleanTrx = instantTrxId.trim();
    if (cleanTrx.length < 5) {
      showToast('সঠিক ট্রানজ্যাকশন আইডি (TrxID) দিন');
      return;
    }

    if (!selectedPackage) return;

    const cleanId = playerId.trim();
    const success = placeOrder(
      product.id,
      selectedPackage.name,
      selectedPackage.price,
      cleanId,
      `Instant Pay (${instantMethod})`,
      cleanTrx
    );

    if (success) {
      setIsInstantPayOpen(false);
      setInstantTrxId('');
      setTimeout(() => {
        navigateTo('dashboard', undefined, 'orders');
      }, 1000);
    }
  };

  const handleCopyPaymentNumber = () => {
    const num = config.phoneNumbers[instantMethod] || '01983003336';
    navigator.clipboard.writeText(num);
    showToast(`${instantMethod} নম্বর কপি হয়েছে: ${num}`);
  };

  const handleRefreshBalance = () => {
    setIsRefreshingBal(true);
    setTimeout(() => {
      setIsRefreshingBal(false);
      showToast(`ওয়ালেট ব্যালেন্স: ৳${user.balance.toFixed(2)}`);
    }, 500);
  };

  const instantNumber = config.phoneNumbers[instantMethod] || '01983003336';
  const instantColor = instantMethod === 'bKash' ? '#d1175f' : instantMethod === 'Nagad' ? '#e8312a' : '#8b2a8e';

  return (
    <div className="max-w-[720px] mx-auto px-3.5 pb-[130px] pt-2">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigateTo('home')}
        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full border border-[#e1e8f5] bg-white text-[12.5px] font-semibold text-[#666b85] hover:text-[#0284c7] cursor-pointer shadow-2xs active:scale-95 transition-all"
      >
        <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2.2] rotate-180" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <span>Back to Home</span>
      </button>

      {/* Hero Header */}
      <section className="relative mt-3 flex items-center gap-3.5 p-3.5 rounded-2xl bg-linear-to-br from-white via-white to-[#f0f9ff] border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="w-[68px] h-[68px] rounded-xl p-1 border border-slate-200 bg-white shrink-0 shadow-2xs">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/main-logo.jpg';
            }}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="relative z-1 min-w-0">
          <h1 className="text-[19px] font-extrabold tracking-tight text-[#0f172a] uppercase">{product.name}</h1>
          <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-[#f0f9ff] border border-[#bae6fd] text-[#0284c7] text-[11.5px] font-bold">
            <svg className="w-3.5 h-3.5 fill-[#f59e0b] stroke-none" viewBox="0 0 24 24">
              <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
            </svg>
            {product.badge}
          </span>
        </div>
      </section>

      {/* Step 1: Select Recharge */}
      <section className="mt-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#e2e8f0]">
          <span className="w-6.5 h-6.5 rounded-full bg-linear-to-br from-[#0284c7] to-[#0369a1] text-white font-extrabold text-[13px] grid place-items-center shrink-0 shadow-xs">
            1
          </span>
          <h2 className="text-[16px] font-extrabold tracking-tight text-[#0f172a]">Select Recharge</h2>
        </div>

        <div className="p-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {product.packages.map((pkg) => {
              const isSelected = selectedPackage?.id === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative flex flex-col items-center justify-center gap-1 min-h-[68px] p-2.5 rounded-xl border-[1.5px] text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#0284c7] bg-linear-to-br from-[#f0f9ff] to-white shadow-[0_0_0_3px_rgba(2,132,199,0.15)] ring-1 ring-[#0284c7]'
                      : 'border-[#e2e8f0] bg-white hover:border-[#7dd3fc] active:scale-98 shadow-2xs'
                  }`}
                >
                  <span className="text-[13.5px] font-bold text-[#0f172a] leading-tight">
                    {pkg.name}
                    {pkg.subtitle && (
                      <small className="block text-[11px] text-gray-500 font-normal mt-0.5">{pkg.subtitle}</small>
                    )}
                  </span>
                  <b className="text-[13.5px] font-extrabold text-[#0284c7]">৳ {pkg.price}</b>
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#0284c7] text-white text-[10px] font-extrabold grid place-items-center border-2 border-white shadow-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <a
            href={config.telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-[13px] font-bold text-[#0284c7] hover:underline"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
              <path d="M15 3h6v6M10 14L21 3" />
            </svg>
            <span>কিভাবে অর্ডার করবেন? ভিডিও টিউটোরিয়াল</span>
          </a>
        </div>
      </section>

      {/* Step 2: Account Info */}
      <section className="mt-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#e2e8f0]">
          <span className="w-6.5 h-6.5 rounded-full bg-linear-to-br from-[#0284c7] to-[#0369a1] text-white font-extrabold text-[13px] grid place-items-center shrink-0 shadow-xs">
            2
          </span>
          <h2 className="text-[16px] font-extrabold tracking-tight text-[#0f172a]">Account Info</h2>
        </div>

        <div className="p-3.5">
          <label className="block text-[13.5px] font-bold text-[#0f172a] mb-1.5">
            {product.inputLabel}
          </label>
          <input
            type="text"
            inputMode={isNumericGame ? 'numeric' : 'text'}
            value={playerId}
            onChange={(e) => {
              const val = isNumericGame ? e.target.value.replace(/\D/g, '') : e.target.value;
              setPlayerId(val);
              setPlayerNameStatus(null);
            }}
            placeholder={product.inputPlaceholder}
            className="w-full h-[46px] px-3.5 rounded-xl border-[1.5px] border-[#cbd5e1] text-[15px] font-semibold text-[#0f172a] outline-none focus:border-[#0284c7] focus:ring-3 focus:ring-sky-500/15 transition-all"
          />

          <button
            type="button"
            disabled={checkingName}
            onClick={handleCheckPlayerId}
            className="w-full h-[42px] mt-2.5 rounded-xl bg-linear-to-r from-[#0284c7] to-[#0369a1] text-white text-[14px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 disabled:opacity-60 transition-all"
          >
            {checkingName ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25 fill-none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                </svg>
                <span>আইডি চেক করা হচ্ছে...</span>
              </span>
            ) : (
              'আপনার গেম আইডির নাম চেক করুন'
            )}
          </button>

          {playerNameStatus && (
            <div
              className={`flex items-center gap-2 mt-2.5 p-3 rounded-xl text-[13px] font-semibold ${
                playerNameStatus.type === 'ok'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <svg className="w-4 h-4 shrink-0 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                {playerNameStatus.type === 'ok' ? (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="9 12 11 14 15 10" />
                  </>
                ) : (
                  <>
                    <path d="M12 3l10 18H2z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </>
                )}
              </svg>
              <span>{playerNameStatus.text}</span>
            </div>
          )}
        </div>
      </section>

      {/* Step 3: Payment Option */}
      <section className="mt-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#e2e8f0]">
          <span className="w-6.5 h-6.5 rounded-full bg-linear-to-br from-[#0284c7] to-[#0369a1] text-white font-extrabold text-[13px] grid place-items-center shrink-0 shadow-xs">
            3
          </span>
          <h2 className="text-[16px] font-extrabold tracking-tight text-[#0f172a]">Select Payment Option</h2>
        </div>

        <div className="p-3.5">
          <div className="grid grid-cols-2 gap-3">
            {/* Wallet Pay */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setPaymentMethod('Wallet Pay')}
              className={`relative flex flex-col rounded-xl border-[1.5px] overflow-hidden cursor-pointer text-left transition-all ${
                paymentMethod === 'Wallet Pay'
                  ? 'border-[#0284c7] ring-2 ring-sky-500/20 shadow-sm'
                  : 'border-[#e2e8f0] bg-white hover:border-slate-300'
              }`}
            >
              {paymentMethod === 'Wallet Pay' && (
                <div className="absolute top-0 left-0 w-0 h-0 border-t-[32px] border-t-[#0284c7] border-r-[32px] border-r-transparent z-10">
                  <span className="absolute -top-[29px] left-[4px] text-white text-[10px] font-bold">✓</span>
                </div>
              )}
              <div className="w-full aspect-[1.8/1] relative bg-slate-50 overflow-hidden flex items-center justify-center p-2">
                <img
                  src="/wallet.jpg"
                  alt="Wallet Pay"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/main-logo.jpg';
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className={`py-2 px-3 text-[13px] font-extrabold text-center transition-colors ${
                  paymentMethod === 'Wallet Pay' ? 'bg-[#e0f2fe] text-[#0284c7]' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Wallet Pay
              </div>
            </div>

            {/* Instant Pay */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setPaymentMethod('Instant Pay')}
              className={`relative flex flex-col rounded-xl border-[1.5px] overflow-hidden cursor-pointer text-left transition-all ${
                paymentMethod === 'Instant Pay'
                  ? 'border-[#0284c7] ring-2 ring-sky-500/20 shadow-sm'
                  : 'border-[#e2e8f0] bg-white hover:border-slate-300'
              }`}
            >
              {paymentMethod === 'Instant Pay' && (
                <div className="absolute top-0 left-0 w-0 h-0 border-t-[32px] border-t-[#0284c7] border-r-[32px] border-r-transparent z-10">
                  <span className="absolute -top-[29px] left-[4px] text-white text-[10px] font-bold">✓</span>
                </div>
              )}
              <div className="w-full aspect-[1.8/1] relative bg-slate-50 overflow-hidden flex items-center justify-center p-2">
                <img
                  src="/andmoney.jpg"
                  alt="Instant Pay"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/main-logo.jpg';
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className={`py-2 px-3 text-[13px] font-extrabold text-center transition-colors ${
                  paymentMethod === 'Instant Pay' ? 'bg-[#e0f2fe] text-[#0284c7]' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Instant Pay (bKash/Nagad)
              </div>
            </div>
          </div>

          {/* User balance display for Wallet Pay */}
          {user.loggedIn && paymentMethod === 'Wallet Pay' && (
            <div className="flex items-center justify-between mt-3 text-[13px] text-slate-700 bg-[#f0f9ff] p-3 rounded-xl border border-[#bae6fd]">
              <div className="flex items-center gap-2">
                <svg className="w-4.5 h-4.5 text-[#0284c7] fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
                  <rect x="3" y="6" width="18" height="13" rx="2" />
                  <path d="M16 12.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0" />
                  <path d="M3 10h18" />
                </svg>
                <span>
                  ওয়ালেট ব্যালেন্স: <b className="text-[#0284c7] font-extrabold">৳ {user.balance.toFixed(2)}</b>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {user.balance < (selectedPackage?.price || 0) && (
                  <button
                    type="button"
                    onClick={() => navigateTo('add-money')}
                    className="px-2.5 py-1 rounded-lg bg-[#0284c7] text-white text-xs font-bold hover:bg-[#0369a1] cursor-pointer"
                  >
                    + টাকা যোগ করুন
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRefreshBalance}
                  aria-label="Refresh Balance"
                  className={`w-7 h-7 rounded-lg border border-[#bae6fd] bg-white text-[#0284c7] grid place-items-center cursor-pointer active:scale-95 transition-all ${
                    isRefreshingBal ? 'animate-spin' : ''
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M20 12a8 8 0 1 1-2.500-5.800" />
                    <path d="M20 4v5h-5" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="flex items-center justify-between mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[13.5px] font-semibold text-slate-600">মোট মূল্য:</span>
            <span className="text-[18px] font-black text-[#0284c7]">
              ৳ {selectedPackage?.price || 0}
            </span>
          </div>

          {!user.loggedIn && (
            <p className="flex items-center gap-2 mt-2.5 text-[#f59e0b] font-bold text-[13.5px]">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v6M12 7.5v.01" />
              </svg>
              <span>অর্ডার সম্পন্ন করতে প্রথমে লগইন করুন</span>
            </p>
          )}

          <button
            type="button"
            onClick={handleBuy}
            className="w-full h-[48px] mt-3 rounded-xl bg-linear-to-r from-[#0284c7] to-[#0369a1] hover:brightness-105 text-white font-extrabold text-[16px] flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition-all"
          >
            {user.loggedIn
              ? paymentMethod === 'Instant Pay'
                ? `Instant Pay করুন (৳${selectedPackage?.price || 0})`
                : `Buy Now (৳${selectedPackage?.price || 0})`
              : 'Login To Continue'}
          </button>
        </div>
      </section>

      {/* Rules & Conditions */}
      <section className="mt-3.5 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#e2e8f0]">
          <svg className="w-4.5 h-4.5 text-[#0284c7] fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
            <rect x="4" y="3" width="16" height="18" rx="3" />
            <path d="M8 8h8M8 12h8M8 16h5" />
          </svg>
          <h2 className="text-[16px] font-extrabold tracking-tight text-[#0f172a]">Rules &amp; Conditions</h2>
        </div>
        <div className="p-4">
          <ul className="space-y-2 list-none">
            {product.rules.map((rule, idx) => (
              <li key={idx} className="relative pl-4 text-[13px] leading-relaxed text-[#666b85]">
                <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Instant Pay Checkout Modal */}
      {isInstantPayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[16px] leading-tight">Instant Payment</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedPackage?.name} · ৳{selectedPackage?.price}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInstantPayOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Provider Tabs */}
            <div className="flex bg-slate-100 border-b border-slate-200">
              {(['bKash', 'Nagad', 'Rocket'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setInstantMethod(m)}
                  className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${
                    instantMethod === m
                      ? 'border-[#0284c7] bg-white text-[#0284c7]'
                      : 'border-transparent text-slate-600'
                  }`}
                >
                  <img
                    src={m === 'bKash' ? '/bkash.png' : m === 'Nagad' ? '/nagad.png' : '/rocket.png'}
                    alt={m}
                    className="w-4 h-4 object-contain"
                  />
                  <span>{m}</span>
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3.5 text-left">
              {/* Send Money Number Card */}
              <div
                className="p-3.5 rounded-xl text-white shadow-xs"
                style={{ backgroundColor: instantColor }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                    Send Money নম্বর ({instantMethod} Personal)
                  </span>
                  <span className="text-[15px] font-black">৳{selectedPackage?.price}</span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="font-mono font-extrabold text-[18px] tracking-wider">
                    {instantNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPaymentNumber}
                    className="px-2.5 py-1 rounded-md bg-white text-slate-900 font-extrabold text-xs shadow-xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-[12px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                <ol className="list-decimal pl-4 space-y-1">
                  <li>আপনার {instantMethod} অ্যাপ থেকে উপরের নম্বরে Send Money করুন।</li>
                  <li>টাকার পরিমাণ: <b>৳{selectedPackage?.price}</b></li>
                  <li>টাকা পাঠানো শেষে প্রাপ্ত <b>TrxID</b> নিচে বসিয়ে ভেরিফাই করুন।</li>
                </ol>
              </div>

              {/* Transaction ID input */}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-1">
                  Transaction ID (TrxID) দিন:
                </label>
                <input
                  type="text"
                  value={instantTrxId}
                  onChange={(e) => setInstantTrxId(e.target.value.toUpperCase())}
                  placeholder="যেমন: BKL491X8Z0"
                  className="w-full h-[46px] px-3.5 rounded-xl border-[1.5px] border-slate-300 font-mono font-bold uppercase text-[15px] text-[#0f172a] outline-none focus:border-[#0284c7] focus:ring-3 focus:ring-sky-500/15"
                />
              </div>

              {/* Player ID review */}
              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100 text-xs text-slate-700 flex items-center justify-between">
                <span>Player ID / Tag:</span>
                <b className="font-mono font-bold text-[#0284c7]">{playerId}</b>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleConfirmInstantPay}
                className="w-full h-[46px] rounded-xl text-white font-extrabold text-[15px] shadow-sm cursor-pointer transition-all active:scale-98"
                style={{ backgroundColor: instantColor }}
              >
                পেমেন্ট নিশ্চিত করুন &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
