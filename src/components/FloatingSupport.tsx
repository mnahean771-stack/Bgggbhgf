import React from 'react';
import { useApp } from '../context/AppContext';

export const FloatingSupport: React.FC = () => {
  const { isFabOpen, toggleFab, config, showToast } = useApp();

  return (
    <div className="fixed right-4 bottom-[76px] z-40 flex flex-col items-end gap-2.5 pointer-events-none">
      {/* Expanded Menu */}
      <div
        className={`flex flex-col items-end gap-2.5 transition-all duration-300 origin-bottom-right ${
          isFabOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-3 pointer-events-none scale-90'
        }`}
      >
        {config.whatsappChannel && (
          <a
            href={config.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-[6px_6px_6px_16px] rounded-full bg-white border border-[#e1e8f5] shadow-[0_8px_20px_rgba(20,40,90,0.15)] text-[13px] font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors"
          >
            <span>WhatsApp</span>
            <span className="w-[38px] h-[38px] rounded-full bg-[#0f766e] text-white grid place-items-center text-[19px]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.98.59 3.91 1.7 5.56L2 22l4.69-1.78c1.6 1.05 3.47 1.69 5.35 1.69h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7C17.18 3.03 14.7 2 12.04 2z" />
              </svg>
            </span>
          </a>
        )}

        <a
          href={config.telegramChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 p-[6px_6px_6px_16px] rounded-full bg-white border border-[#e1e8f5] shadow-[0_8px_20px_rgba(20,40,90,0.15)] text-[13px] font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors"
        >
          <span>Telegram</span>
          <span className="w-[38px] h-[38px] rounded-full bg-[#1e88e5] text-white grid place-items-center text-[19px]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M21.5 3.2 2.7 10.6c-1 .4-1 1.2-.2 1.4l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.8c.3-1.2-.5-1.8-1.2-1.5zM8.4 13l9.2-5.8c.4-.3.8-.1.5.2l-7.6 6.9-.3 3.2z" />
            </svg>
          </span>
        </a>

        <a
          href={config.telegramGroup}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 p-[6px_6px_6px_16px] rounded-full bg-white border border-[#e1e8f5] shadow-[0_8px_20px_rgba(20,40,90,0.15)] text-[13px] font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors"
        >
          <span>Join Group</span>
          <span className="w-[38px] h-[38px] rounded-full bg-[#3b82f6] text-white grid place-items-center text-[19px]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.2" />
              <circle cx="5.5" cy="9.5" r="2.3" />
              <circle cx="18.5" cy="9.5" r="2.3" />
              <path d="M12 12.5c-3 0-5.5 1.7-5.5 4V19h11v-2.5c0-2.3-2.5-4-5.5-4zM5.5 12.5C3.5 12.5 2 13.7 2 15.3V17h3.5v-1.5c0-1 .4-1.9 1.1-2.6-.3-.3-.7-.4-1.1-.4zM18.5 12.5c-.4 0-.8.1-1.1.4.7.7 1.1 1.6 1.1 2.6V17H22v-1.7c0-1.6-1.5-2.8-3.5-2.8z" />
            </svg>
          </span>
        </a>

        {config.youtubeChannel ? (
          <a
            href={config.youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-[6px_6px_6px_16px] rounded-full bg-white border border-[#e1e8f5] shadow-[0_8px_20px_rgba(20,40,90,0.15)] text-[13px] font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors"
          >
            <span>YouTube</span>
            <span className="w-[38px] h-[38px] rounded-full bg-[#e53935] text-white grid place-items-center text-[19px]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.200 0-7.800.4a2.500 2.500 0 0 0-1.800 1.800C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z" />
              </svg>
            </span>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => showToast('ইউটিউব চ্যানেল শীঘ্রই আসছে')}
            className="flex items-center gap-2.5 p-[6px_6px_6px_16px] rounded-full bg-white border border-[#e1e8f5] shadow-[0_8px_20px_rgba(20,40,90,0.15)] text-[13px] font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>YouTube</span>
            <span className="w-[38px] h-[38px] rounded-full bg-[#e53935] text-white grid place-items-center text-[19px]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.200 0-7.800.4a2.500 2.500 0 0 0-1.800 1.800C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      {/* Main Trigger Button with "Need Help?" badge from screenshot */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {!isFabOpen && (
          <div className="px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-[12px] font-bold text-slate-800 animate-in fade-in slide-in-from-right-2 duration-300">
            Need Help?
          </div>
        )}

        <button
          type="button"
          onClick={toggleFab}
          aria-label="Help and Support"
          className="relative w-[54px] h-[54px] rounded-full bg-linear-to-r from-[#0284c7] to-[#0369a1] text-white grid place-items-center cursor-pointer shadow-[0_0_0_6px_rgba(2,132,199,0.18),0_0_0_12px_rgba(2,132,199,0.08),0_12px_24px_-6px_rgba(2,132,199,0.7)] active:scale-95 transition-transform"
        >
          {isFabOpen ? (
            <svg className="w-5 h-5 stroke-current fill-none stroke-[2.4]" viewBox="0 0 24 24">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          ) : (
            <svg className="w-5.5 h-5.5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
