import React from 'react';
import { useApp } from '../context/AppContext';

export const RecentOrdersFeed: React.FC = () => {
  const { liveRecentOrders, config } = useApp();

  return (
    <section className="mt-8">
      {/* Section Header with Green Dot and LIVE badge */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <h2 className="text-[17px] font-extrabold text-[#0f172a] tracking-tight">
            Recent Orders
          </h2>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0] text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">
          <span>CUSTOMER</span>
          <span>STATUS</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {liveRecentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full ${
                    order.avatarBg || 'bg-[#0284c7]'
                  } text-white font-extrabold text-[13.5px] flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  {order.avatarLetter || order.customerName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h4 className="text-[14px] font-bold text-[#0f172a] truncate leading-snug">
                    {order.customerName}
                  </h4>
                  <p className="text-[12.5px] font-medium text-gray-500 flex items-center gap-1 truncate">
                    <span>{order.itemName}</span>
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 pl-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80 text-[11.5px] font-bold">
                  <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2.4]" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Done</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warm Yellow Contact & Support Section (from Screenshot 5 & 6) */}
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
    </section>
  );
};
