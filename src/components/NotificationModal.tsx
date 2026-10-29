import React from 'react';
import { useApp } from '../context/AppContext';

export const NotificationModal: React.FC = () => {
  const { isNotificationOpen, closeNotification, config } = useApp();

  if (!isNotificationOpen) return null;

  const telegramLink = config.telegramGroup || 'https://t.me/FF_Gamecoin';
  const lines = config.notificationText.split(/\r?\n/);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 pb-12 bg-[#0a1637]/55 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-full max-w-[460px] bg-white rounded-[26px] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.55)] animate-in fade-in zoom-in-95 duration-300">
        {/* Clickable Banner Image */}
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          title="টেলিগ্রাম চ্যানেলে জয়েন করুন"
          className="block w-full aspect-[1.85/1] rounded-t-[26px] overflow-hidden bg-[#e6eeff] group cursor-pointer"
        >
          <img
            src="/Notification.jpg"
            alt="Notification"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        </a>

        <div className="p-[18px_14px_46px] text-center">
          <p className="text-[14.5px] leading-relaxed font-semibold text-[#0f172a] whitespace-pre-line">
            {lines.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>

          {/* Telegram Channel Button */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-[14px] bg-linear-to-r from-blue-500 to-blue-700 text-white font-bold text-[14px] shadow-[0_10px_22px_-10px_rgba(37,99,235,0.9)] hover:brightness-105 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M21.5 3.2 2.7 10.6c-1 .4-1 1.2-.2 1.4l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.8c.3-1.2-.5-1.8-1.2-1.5zM8.4 13l9.2-5.8c.4-.3.8-.1.5.2l-7.6 6.9-.3 3.2z" />
            </svg>
            <span>টেলিগ্রাম চ্যানেলে জয়েন করুন</span>
          </a>
        </div>

        {/* Floating Close Button */}
        <button
          type="button"
          onClick={closeNotification}
          className="absolute left-1/2 -bottom-[24px] -translate-x-1/2 flex items-center gap-2 px-8 py-3.5 border-none rounded-full bg-linear-to-r from-blue-500 to-blue-700 text-white font-extrabold text-[15px] leading-none tracking-wider cursor-pointer shadow-[0_0_0_5px_rgba(255,255,255,0.9),0_14px_26px_-8px_rgba(37,99,235,0.9)] hover:scale-105 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4 stroke-current fill-none stroke-[2.6]" viewBox="0 0 24 24">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
          CLOSE
        </button>
      </div>
    </div>
  );
};
