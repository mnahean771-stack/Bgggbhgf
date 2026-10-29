import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const MyCodesView: React.FC = () => {
  const { codes, navigateTo, showToast, redeemCode } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const GARENA_REDEEM_URL = 'https://reward.ff.garena.com/';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`কোড "${text}" কপি হয়েছে`);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      showToast('একটি রিডিম কোড লিখুন');
      return;
    }
    const success = redeemCode(inputCode.trim());
    if (success) {
      setInputCode('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-[700px] mx-auto px-4 pb-[130px]">
      <div className="flex items-center gap-3.5 mt-4">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          aria-label="Back to home"
          className="w-10 h-10 rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] grid place-items-center text-[20px] cursor-pointer shadow-xs active:scale-95 transition-all"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2 rotate-180" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <h1 className="text-[24px] font-extrabold tracking-tight text-[#0f172a] flex-1 min-w-0">
          My Codes
        </h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#0284c7] to-[#0369a1] text-white font-bold text-[13.5px] cursor-pointer shadow-xs hover:brightness-105 active:scale-95 transition-all shrink-0"
        >
          <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Redeem Code</span>
        </button>
      </div>

      {codes.length === 0 ? (
        <div className="flex flex-col items-center text-center mt-4 p-10 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-[#0284c7] flex items-center justify-center mb-2">
            <svg className="w-8 h-8 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="4" y="3" width="16" height="18" rx="3" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          </div>
          <h3 className="text-[19px] font-extrabold text-[#0f172a]">No code data found !</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
            আপনি কোনো রিডিম কোড ক্রয় করলে বা রিডিম করলে তা এখানে সংরক্ষিত থাকবে।
          </p>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="inline-flex items-center justify-center mt-5 px-8 py-3 rounded-xl bg-linear-to-r from-[#0284c7] to-[#0369a1] text-white text-[14.5px] font-extrabold tracking-wide shadow-xs cursor-pointer active:scale-97 transition-all"
          >
            ORDER NOW
          </button>
        </div>
      ) : (
        <div className="grid gap-3 mt-4">
          {codes.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-between"
            >
              <div>
                <b className="block text-[14.5px] font-extrabold text-[#0f172a]">{item.title}</b>
                <code className="block mt-1 text-[14px] font-mono font-bold tracking-wider text-[#0284c7]">
                  {item.code}
                </code>
                <small className="block mt-1 text-[11px] text-[#666b85]">{item.date}</small>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(item.code)}
                className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284c7] grid place-items-center cursor-pointer active:scale-95 transition-all"
                title="Copy Code"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Official Garena Reward banner */}
      <div className="mt-4 p-4 rounded-xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-amber-950">Garena Official Rewards Redemption</h4>
          <p className="text-xs text-amber-800/80 mt-0.5">গ্যারেনা অফিসিয়াল রিওয়ার্ড সাইটে কোড রিডিম করুন</p>
        </div>
        <a
          href={GARENA_REDEEM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-bold shrink-0 transition-colors"
        >
          গ্যারেনা সাইট &rarr;
        </a>
      </div>

      {/* Code Input Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
          <div className="w-full max-w-[380px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-[16px] text-slate-900">Redeem / Add Code</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRedeem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">রিডিম কোড প্রবেশ করান:</label>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="যেমন: FF-DIAMOND-2026"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 font-mono font-bold uppercase text-sm outline-none focus:border-[#0284c7]"
                />
              </div>

              <div className="text-[11.5px] text-slate-500 bg-slate-50 p-2.5 rounded-lg">
                টিপস: <b>FF</b> বা <b>DIAMOND</b> সম্বলিত কোডে ২৫৳ ফ্রি বোনাস ব্যালেন্স যোগ হবে!
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-xs"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
