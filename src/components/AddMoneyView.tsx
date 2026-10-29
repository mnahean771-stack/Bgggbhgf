import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_STEPS } from '../config/siteConfig';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_STEPS } from '../config/siteConfig';
import { sendTelegramMessage } from '../services/telegramService';

type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket';

const METHOD_DETAILS: Record<
  PaymentMethod,
  { color: string; logo: string }
> = {
  bKash: { color: '#d1175f', logo: '/bkash.png' },
  Nagad: { color: '#e8312a', logo: '/nagad.png' },
  Rocket: { color: '#8b2a8e', logo: '/rocket.png' },
};

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export const AddMoneyView: React.FC = () => {
  const { navigateTo, user, showToast, addMoneyRequest, config } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [amountInput, setAmountInput] = useState<string>('100');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bKash');
  const [trxId, setTrxId] = useState<string>('');

  const numAmount = parseFloat(amountInput) || 0;

  const handleNextStep = () => {
    if (!numAmount || numAmount < 10 || numAmount > 50000) {
      showToast('১০ থেকে ৫০,০০০ টাকার মধ্যে দিন');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getMethodNumber = (m: PaymentMethod) => {
    return config.phoneNumbers[m] || '01983003336';
  };

  const handleCopyNumber = () => {
    const num = getMethodNumber(selectedMethod);
    navigator.clipboard.writeText(num);
    showToast(`নম্বর কপি হয়েছে: ${num}`);
  };

  const handleVerify = async () => {
    const cleanTrx = trxId.trim();
    if (cleanTrx.length < 5) {
      showToast('সঠিক ট্রানজেকশন আইডি (TrxID) দিন');
      return;
    }

    addMoneyRequest(numAmount, selectedMethod, cleanTrx);

    try {
      await sendTelegramMessage(
        `নতুন পেমেন্ট রিকোয়েস্ট!\nপদ্ধতি: ${selectedMethod}\nটাকা: ${numAmount} BDT\nট্রানজেকশন আইডি: ${cleanTrx}`
      );
      showToast('পেমেন্ট রিকোয়েস্ট সফল এবং টেলিগ্রামে পাঠানো হয়েছে');
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
  };

  const activeColor = METHOD_DETAILS[selectedMethod].color;

  return (
    <div className="max-w-[480px] mx-auto px-3.5 pb-[130px] pt-4">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-3.5">
        <button
          type="button"
          onClick={() => {
            if (step === 2) setStep(1);
            else navigateTo('dashboard', undefined, 'wallet');
          }}
          aria-label="Back"
          className="w-10 h-10 rounded-xl bg-[#eaf1ff] text-[#0284c7] grid place-items-center cursor-pointer"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2 rotate-180" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-[20px] font-extrabold text-[#0f172a] m-0">
          {step === 1 ? 'Add Money: টাকা যোগ করুন' : 'পেমেন্ট ভেরিফাই করুন'}
        </h2>
      </div>

      {step === 1 ? (
        <div className="step-1">
          {/* Step 1 Content goes here */}
        </div>
      ) : (
        <div className="step-2">
          {/* Step 2 Content goes here */}
        </div>
      )}
    </div>
  );
};

type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket';

const METHOD_DETAILS: Record<
  PaymentMethod,
  { color: string; logo: string }
> = {
  bKash: { color: '#d1175f', logo: '/bkash.png' },
  Nagad: { color: '#e8312a', logo: '/nagad.png' },
  Rocket: { color: '#8b2a8e', logo: '/rocket.png' }
};

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export const AddMoneyView: React.FC = () => {
  const { navigateTo, user, showToast, addMoneyRequest, config } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [amountInput, setAmountInput] = useState<string>('100');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bKash');
  const [trxId, setTrxId] = useState<string>('');

  const numAmount = parseFloat(amountInput) || 0;

  const handleNextStep = () => {
    if (!numAmount || numAmount < 10 || numAmount > 50000) {
      showToast('১০ থেকে ৫০,০০০ টাকার মধ্যে দিন');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getMethodNumber = (m: PaymentMethod) => {
    return config.phoneNumbers[m] || '01983003336';
  };

  const handleCopyNumber = () => {
    const num = getMethodNumber(selectedMethod);
    navigator.clipboard.writeText(num);
    showToast(`নম্বর কপি হয়েছে: ${num}`);
  };

  const handleVerify = () => {
    const cleanTrx = trxId.trim();
    if (cleanTrx.length < 5) {
      showToast('সঠিক ট্রানজ্যাকশন আইডি (TrxID) দিন');
      return;
    }

    addMoneyRequest(numAmount, selectedMethod, cleanTrx);
  };

  const activeColor = METHOD_DETAILS[selectedMethod].color;

  return (
    <div className="max-w-[480px] mx-auto px-3.5 pb-[130px] pt-4">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-3.5">
        <button
          type="button"
          onClick={() => {
            if (step === 2) setStep(1);
            else navigateTo('dashboard', undefined, 'wallet');
          }}
          aria-label="Back"
          className="w-10 h-10 rounded-xl bg-[#eaf1ff] text-[#0284c7] text-[20px] grid place-items-center cursor-pointer shrink-0 active:scale-95 transition-all shadow-2xs"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2 rotate-180" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <h2 className="text-[20px] font-extrabold text-[#0f172a] m-0">
          {step === 1 ? 'Add Money' : 'ওয়ালেটে টাকা যোগ করুন'}
        </h2>
      </div>

      {step === 1 ? (
        <div>
          {/* Amount Card */}
          <div className="bg-white border-[1.5px] border-[#e2e8f0] rounded-2xl overflow-hidden mb-3.5 shadow-xs">
            <div className="p-4 text-[17px] font-extrabold border-b border-[#e2e8f0] text-[#0f172a]">
              Enter Deposit Amount
            </div>
            <div className="p-4">
              <label htmlFor="amountInp" className="block font-bold text-[13.5px] mb-2 text-[#334]">
                টাকার পরিমাণ লিখুন (BDT ৳)
              </label>
              <div className="relative">
                <input
                  id="amountInp"
                  type="number"
                  inputMode="numeric"
                  min="10"
                  max="50000"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="Amount"
                  className="w-full h-[50px] border-[1.5px] border-[#cbd5e1] rounded-xl px-4 text-[18px] font-extrabold mb-3 outline-none focus:border-[#0284c7] focus:ring-3 focus:ring-sky-500/15 text-[#0f172a] bg-white"
                />
                <span className="absolute right-4 top-3.5 text-gray-400 font-bold">BDT ৳</span>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountInput(String(amt))}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      amountInput === String(amt)
                        ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>

              <p className="text-[12px] text-gray-500 mb-4">সর্বনিম্ন ১০ টাকা, সর্বোচ্চ ৫০,০০০ টাকা পর্যন্ত যোগ করা যাবে।</p>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full h-[48px] rounded-xl bg-linear-to-r from-[#0284c7] to-[#0369a1] hover:brightness-105 text-white text-[15.5px] font-extrabold cursor-pointer active:scale-98 transition-all shadow-xs"
              >
                পেমেন্ট করতে এগিয়ে যান &rarr;
              </button>
            </div>
          </div>

          {/* How to add money instruction */}
          <div className="bg-white border-[1.5px] border-[#e2e8f0] rounded-2xl overflow-hidden mb-3.5 shadow-xs">
            <div className="p-4 text-[16px] font-extrabold border-b border-[#e2e8f0] text-[#0f172a]">
              টাকা অ্যাড করার নিয়ম
            </div>
            <div className="p-4">
              <div className="relative w-full aspect-2/1 bg-linear-to-br from-[#0b1330] to-[#1e293b] rounded-xl overflow-hidden flex items-center justify-center p-4 text-center">
                <div className="text-white">
                  <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-[#0284c7] flex items-center justify-center shadow-xs">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <b className="block text-[14px]">সহজ ৩টি ধাপে ব্যালেন্স যোগ করুন</b>
                  <span className="block text-[11.5px] text-slate-300 mt-1 max-w-[280px] mx-auto">
                    বিকাশ, নগদ বা রকেট থেকে Send Money করে TrxID দিন — সাথে সাথে ব্যালেন্স যোগ হবে!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Step 2: Payment Provider Tabs */
        <div className="max-w-[420px] mx-auto">
          <div className="text-left mb-3">
            <b className="block text-[17px] text-[#0f172a]">পেমেন্ট মেথড নির্বাচন করুন</b>
            <span className="text-[12.5px] text-slate-500">নম্বরে টাকা পাঠিয়ে TrxID দিয়ে ভেরিফাই চাপুন</span>
          </div>

          <div
            className="rounded-2xl overflow-hidden shadow-lg transition-colors duration-200 border border-slate-200/50"
            style={{ backgroundColor: activeColor }}
          >
            {/* Tabs */}
            <div className="flex bg-white">
              {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map((m) => {
                const isCurrent = selectedMethod === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMethod(m)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-1 border-b-[3px] font-bold text-[12.5px] cursor-pointer transition-all ${
                      isCurrent ? 'border-b-[#0284c7] text-[#0284c7] bg-[#f0f9ff]' : 'border-b-transparent text-slate-600 bg-white'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-lg overflow-hidden bg-white grid place-items-center border border-slate-100 shadow-2xs">
                      <img src={METHOD_DETAILS[m].logo} alt={m} className="w-full h-full object-contain p-0.5" />
                    </span>
                    <span>{m}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 text-white">
              {/* Operator info header */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5 font-extrabold text-[17px]">
                  <i className="w-9 h-9 rounded-xl bg-white overflow-hidden grid place-items-center not-italic p-1 shadow-xs">
                    <img src={METHOD_DETAILS[selectedMethod].logo} alt="" className="w-full h-full object-contain" />
                  </i>
                  <span>{selectedMethod} Personal</span>
                </div>
                <div className="font-extrabold text-[18px] text-right">
                  ৳{numAmount.toFixed(2)}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="block text-[11px] font-semibold underline cursor-pointer opacity-95 text-right w-full"
                  >
                    পরিবর্তন
                  </button>
                </div>
              </div>

              <div className="text-[12.5px] font-bold mb-1.5 opacity-90">এই নম্বরে Send Money করুন:</div>
              <div className="flex items-center justify-between bg-black/25 rounded-xl p-3 font-extrabold text-[17px] tracking-wide">
                <div>
                  <small className="block text-[10px] font-bold opacity-80 tracking-wider mb-0.5">
                    {selectedMethod.toUpperCase()} PERSONAL NO
                  </small>
                  <span className="font-mono tracking-wider">{getMethodNumber(selectedMethod)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="rounded-lg bg-white/25 hover:bg-white/35 text-white px-3 py-1.5 font-bold text-[12px] cursor-pointer active:scale-95 transition-all shadow-xs"
                >
                  কপি করুন
                </button>
              </div>

              <div className="text-[12.5px] font-bold mt-3 mb-1.5 opacity-90">Transaction ID (TrxID) লিখুন:</div>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                placeholder="যেমন: BKL491X8Z0"
                autoComplete="off"
                className="w-full h-[46px] rounded-xl px-3.5 text-[15px] outline-none bg-white text-[#0f172a] uppercase font-mono font-bold tracking-wider shadow-inner"
              />

              {/* Instructions */}
              <ol className="bg-black/25 rounded-xl p-3 my-3.5 text-[12.5px] leading-relaxed list-none space-y-1">
                {PAYMENT_STEPS[selectedMethod].map((stepText, idx) => (
                  <li key={idx} className="py-0.5 flex gap-1.5 border-b border-white/10 last:border-b-0">
                    <b className="whitespace-nowrap">{idx + 1}.</b>
                    <span>{stepText.replace('{amt}', `৳${numAmount.toFixed(2)}`)}</span>
                  </li>
                ))}
              </ol>

              <button
                type="button"
                onClick={handleVerify}
                className="w-full h-[48px] rounded-xl bg-white font-black text-[15px] cursor-pointer shadow-md active:scale-98 transition-all hover:bg-slate-50"
                style={{ color: activeColor }}
              >
                পেমেন্ট ভেরিফাই করুন &rarr;
              </button>
            </div>
          </div>

          <p className="text-center text-[12px] text-gray-500 mt-3.5">
            {user.loggedIn ? `অ্যাকাউন্ট: ${user.name} (${user.email || user.phone})` : 'লগইন থাকলে ব্যালেন্স সংরক্ষিত থাকবে'}
          </p>
        </div>
      )}
    </div>
  );
};
