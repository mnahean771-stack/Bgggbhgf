import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { config, showToast, navigateTo } = useApp();

  return (
    <footer className="mt-[34px] pt-[30px] pb-[150px] md:pb-[50px] border-t border-[#e1e8f5]">
      <div className="max-w-[1000px] mx-auto px-4">
        {/* Value Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#e1e8f5] text-[13px] font-semibold text-[#0f172a]">
            <svg className="w-4 h-4 text-[#2563eb] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
            </svg>
            দ্রুত
          </span>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#e1e8f5] text-[13px] font-semibold text-[#0f172a]">
            <svg className="w-4 h-4 text-[#2563eb] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            নিরাপদ
          </span>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#e1e8f5] text-[13px] font-semibold text-[#0f172a]">
            <svg className="w-4 h-4 text-[#2563eb] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12l3 3 5-6" />
            </svg>
            নির্ভরযোগ্য
          </span>
        </div>

        {/* Notes */}
        <div className="grid gap-2.5 mt-5">
          <div className="flex gap-3 p-3.5 rounded-[18px] bg-white border border-[#e1e8f5]">
            <span className="w-9 h-9 rounded-[12px] grid place-items-center text-[19px] bg-[#e8f0ff] text-[#2563eb] shrink-0">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v6M12 7.5v.01" />
              </svg>
            </span>
            <div className="text-[13.5px] leading-relaxed text-[#666b85]">
              <b className="text-[#0f172a] block text-[14px]">নোটিশ:</b>
              যেকোনো অর্ডার-সংক্রান্ত সমস্যার জন্য{' '}
              <a href={config.telegramChannel} target="_blank" rel="noopener noreferrer" className="text-[#2563eb] font-bold">
                Telegram
              </a>
              -এ অর্ডারের স্ক্রিনশট এবং পেমেন্টের ট্রানজেকশন আইডি লিখে মেসেজ দিন।
            </div>
          </div>

          <div className="flex gap-3 p-3.5 rounded-[18px] bg-[#fff8eb] border border-[#fde7b8]">
            <span className="w-9 h-9 rounded-[12px] grid place-items-center text-[19px] bg-[#fde9bd] text-[#b45309] shrink-0">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M12 3l10 18H2z" />
                <path d="M12 10v5M12 18v.01" />
              </svg>
            </span>
            <div className="text-[13.5px] leading-relaxed text-[#92400e]">
              <b className="text-[#92400e] block text-[14px]">বিশেষ সতর্কতা:</b>
              ১৮ বছরের নিচে অভিভাবকের অনুমতি ছাড়া অর্ডার করা সম্পূর্ণ নিষিদ্ধ।
            </div>
          </div>
        </div>

        {/* Contact Us */}
        <h2 className="mt-7 mb-3 text-[22px] font-extrabold tracking-tight text-[#0f172a]">Contact Us</h2>
        <a
          href={config.telegramChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 p-4.5 rounded-[20px] bg-white border border-[#e1e8f5] shadow-xs hover:border-blue-300 transition-all"
        >
          <span className="w-11 h-11 rounded-full bg-[#0a8fd6] text-white grid place-items-center text-[22px] shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M21.5 3.2 2.7 10.6c-1 .4-1 1.2-.2 1.4l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.8c.3-1.2-.5-1.8-1.2-1.5zM8.4 13l9.2-5.8c.4-.3.8-.1.5.2l-7.6 6.9-.3 3.2z" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <b className="flex items-center gap-1.5 text-[16px] font-bold text-[#0f172a]">
              Telegram HelpLine
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path
                  fill="#0088cc"
                  d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
                />
                <polygon fill="#ffffff" points="9.65 16.4 5.8 12.55 7.2 11.15 9.65 13.6 16.8 6.45 18.2 7.85" />
              </svg>
            </b>
            <p className="text-[13.5px] text-[#666b85] flex items-center gap-1.5 mt-0.5">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2 inline" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              সকাল ৮টা থেকে রাত ১২টা
            </p>
          </div>
          <span className="w-8 h-8 rounded-full bg-[#e8f0ff] text-[#2563eb] grid place-items-center shrink-0">
            <svg className="w-4 h-4 stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>

        {/* Download App Box */}
        <section className="relative overflow-hidden mt-6 p-[30px_20px_32px] rounded-[28px] text-center bg-linear-to-br from-[#3b82f6] via-[#1d4ed8] to-[#1e3a8a] text-white shadow-[0_22px_44px_-22px_rgba(29,78,216,0.8)]">
          <div className="w-12 h-12 rounded-[15px] bg-white/16 grid place-items-center mx-auto mb-3 text-[24px]">
            <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="7" y="2" width="10" height="20" rx="2.5" />
              <path d="M11 18h2" />
            </svg>
          </div>
          <h3 className="text-[17px] font-extrabold tracking-wide mb-4 text-white">DOWNLOAD OUR MOBILE APP</h3>
          <button
            type="button"
            onClick={() => showToast('FF Gamecoin অ্যান্ড্রয়েড অ্যাপ খুব শীঘ্রই গুগল প্লে স্টোরে প্রকাশ করা হবে!')}
            className="inline-flex items-center gap-3 p-[10px_22px_10px_16px] rounded-[14px] bg-black border-[1.5px] border-[#8d8d95] text-left hover:-translate-y-0.5 hover:shadow-2xl transition-all cursor-pointer active:scale-95"
          >
            <svg className="w-[30px] h-[34px]" viewBox="0 0 108 120">
              <path fill="#00c3ff" d="M0 8L64 60 0 112z" />
              <path fill="#00e676" d="M6 2L92 50 64 60z" />
              <path fill="#ffc400" d="M92 50L108 60 92 70 64 60z" />
              <path fill="#ff3d54" d="M6 118L92 70 64 60z" />
            </svg>
            <div>
              <small className="block text-white text-[10px] font-medium tracking-wide">GET IT ON</small>
              <b className="block text-white text-[20px] font-bold tracking-tight leading-none">Google Play</b>
            </div>
          </button>
        </section>

        <div className="mt-7 text-center text-[#666b85] text-[12px] flex flex-wrap items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} {config.websiteName}. All rights reserved.</span>
          <span>·</span>
          <button
            type="button"
            onClick={() => navigateTo('admin')}
            className="text-slate-400 hover:text-amber-600 font-bold cursor-pointer transition-colors"
          >
            👑 Admin Panel
          </button>
        </div>
      </div>
    </footer>
  );
};
