import React from 'react';
import { useApp } from '../context/AppContext';

export const QuickLinks: React.FC = () => {
  const { config, showToast } = useApp();

  return (
    <div className="grid grid-cols-3 gap-2 mt-[14px]">
      <a
        href={config.telegramChannel}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 p-[10px_8px] rounded-[16px] bg-white text-[#0f172a] border border-[#e1e8f5] shadow-[0_2px_8px_rgba(20,40,90,0.05)] hover:border-[#93c5fd] hover:shadow-[0_6px_16px_-8px_rgba(37,99,235,0.5)] active:scale-97 transition-all text-center"
      >
        <span className="w-7 h-7 rounded-full bg-linear-to-r from-blue-500 to-blue-700 text-white grid place-items-center shrink-0">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M21.5 3.2 2.7 10.6c-1 .4-1 1.2-.2 1.4l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.8c.3-1.2-.5-1.8-1.2-1.5zM8.4 13l9.2-5.8c.4-.3.8-.1.5.2l-7.6 6.9-.3 3.2z" />
          </svg>
        </span>
        <span className="flex flex-col text-left leading-tight">
          <small className="hidden md:inline text-[11px] text-[#666b85]">Support</small>
          <b className="text-[12.5px] font-semibold whitespace-nowrap">Telegram</b>
        </span>
      </a>

      <a
        href={config.telegramGroup}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 p-[10px_8px] rounded-[16px] bg-white text-[#0f172a] border border-[#e1e8f5] shadow-[0_2px_8px_rgba(20,40,90,0.05)] hover:border-[#93c5fd] hover:shadow-[0_6px_16px_-8px_rgba(37,99,235,0.5)] active:scale-97 transition-all text-center"
      >
        <span className="w-7 h-7 rounded-full bg-linear-to-r from-blue-500 to-blue-700 text-white grid place-items-center shrink-0">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="3.2" />
            <circle cx="5.5" cy="9.5" r="2.3" />
            <circle cx="18.5" cy="9.5" r="2.3" />
            <path d="M12 12.5c-3 0-5.5 1.7-5.5 4V19h11v-2.5c0-2.3-2.5-4-5.5-4zM5.5 12.5C3.5 12.5 2 13.7 2 15.3V17h3.5v-1.5c0-1 .4-1.9 1.1-2.6-.3-.3-.7-.4-1.1-.4zM18.5 12.5c-.4 0-.8.1-1.1.4.7.7 1.1 1.6 1.1 2.6V17H22v-1.7c0-1.6-1.5-2.8-3.5-2.8z" />
          </svg>
        </span>
        <span className="flex flex-col text-left leading-tight">
          <small className="hidden md:inline text-[11px] text-[#666b85]">Group</small>
          <b className="text-[12.5px] font-semibold whitespace-nowrap">Join Group</b>
        </span>
      </a>

      {config.youtubeChannel ? (
        <a
          href={config.youtubeChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-[10px_8px] rounded-[16px] bg-white text-[#0f172a] border border-[#e1e8f5] shadow-[0_2px_8px_rgba(20,40,90,0.05)] hover:border-[#93c5fd] hover:shadow-[0_6px_16px_-8px_rgba(37,99,235,0.5)] active:scale-97 transition-all text-center"
        >
          <span className="w-7 h-7 rounded-full bg-linear-to-r from-blue-500 to-blue-700 text-white grid place-items-center shrink-0">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.200 0-7.800.4a2.500 2.500 0 0 0-1.800 1.800C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z" />
            </svg>
          </span>
          <span className="flex flex-col text-left leading-tight">
            <small className="hidden md:inline text-[11px] text-[#666b85]">Channel</small>
            <b className="text-[12.5px] font-semibold whitespace-nowrap">YouTube</b>
          </span>
        </a>
      ) : (
        <button
          type="button"
          onClick={() => showToast('ইউটিউব চ্যানেল শীঘ্রই আসছে')}
          className="flex items-center justify-center gap-2 p-[10px_8px] rounded-[16px] bg-white text-[#0f172a] border border-[#e1e8f5] shadow-[0_2px_8px_rgba(20,40,90,0.05)] hover:border-[#93c5fd] active:scale-97 transition-all text-center cursor-pointer"
        >
          <span className="w-7 h-7 rounded-full bg-linear-to-r from-blue-500 to-blue-700 text-white grid place-items-center shrink-0">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.200 0-7.800.4a2.500 2.500 0 0 0-1.800 1.800C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z" />
            </svg>
          </span>
          <span className="flex flex-col text-left leading-tight">
            <small className="hidden md:inline text-[11px] text-[#666b85]">Channel</small>
            <b className="text-[12.5px] font-semibold whitespace-nowrap">YouTube</b>
          </span>
        </button>
      )}
    </div>
  );
};
