import React from 'react';
import { useApp } from '../context/AppContext';

export const MyOrdersView: React.FC = () => {
  const { orders, openDrawer, navigateTo } = useApp();

  return (
    <div className="max-w-[1000px] mx-auto px-2.5 pb-[130px]">
      <div className="flex items-center gap-4 mt-4">
        <button
          type="button"
          onClick={openDrawer}
          aria-label="Menu"
          className="w-[46px] h-[46px] rounded-[15px] border border-[#e1e8f5] bg-white text-[#0f172a] grid place-items-center text-[24px] cursor-pointer shadow-[0_4px_12px_-6px_rgba(20,40,90,0.2)] active:scale-95 transition-all"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M9 6h12M9 12h12M9 18h12" />
            <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeWidth="2.6" />
          </svg>
        </button>
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#0f172a]">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center text-center mt-4 p-[46px_20px] rounded-[22px] bg-white border border-dashed border-[#b7cdfb]">
          <span className="w-[68px] h-[68px] rounded-full bg-[#e8f0ff] text-[#2563eb] grid place-items-center text-[32px]">
            <svg className="w-8 h-8 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M8 7V4h8v3M3 12h18" />
            </svg>
          </span>
          <h3 className="mt-3.5 text-[17px] font-extrabold text-[#0f172a]">কোনো অর্ডার নেই</h3>
          <p className="mt-1 text-[13px] text-[#666b85]">আপনার করা অর্ডারগুলো এখানে দেখা যাবে।</p>
          <button
            onClick={() => navigateTo('home')}
            className="mt-4 px-5 py-2.5 rounded-full bg-linear-to-r from-blue-500 to-blue-700 text-white font-bold text-[14px] cursor-pointer active:scale-95 transition-all shadow-md"
          >
            টপআপ করুন
          </button>
        </div>
      ) : (
        <div className="grid gap-3.5 mt-4">
          {orders.map((order) => {
            const isPending = order.status.toLowerCase().includes('pend') || order.status.toLowerCase().includes('process');
            const isCancelled = order.status.toLowerCase().includes('cancel') || order.status.toLowerCase().includes('reject');
            const dateParts = order.date.split(' ');
            const updateParts = (order.updated || order.date).split(' ');

            return (
              <article
                key={order.id}
                className="rounded-[22px] bg-white border border-[#e1e8f5] shadow-[0_8px_22px_-14px_rgba(20,40,90,0.3)] p-[16px_16px_14px]"
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <span className="w-[42px] h-[42px] rounded-[14px] bg-[#e8f0ff] text-[#2563eb] grid place-items-center text-[21px] shrink-0">
                    <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <rect x="3" y="7" width="18" height="14" rx="2" />
                      <path d="M8 7V4h8v3M3 12h18" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0 text-[17px] font-extrabold tracking-tight truncate text-[#0f172a]">
                    Order #{order.id}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold shrink-0 ${
                      isPending
                        ? 'bg-[#fff4dc] text-[#b45309]'
                        : isCancelled
                        ? 'bg-[#fee4e2] text-[#b42318]'
                        : 'bg-[#e3f9ec] text-[#067647]'
                    }`}
                  >
                    {!isPending && !isCancelled && (
                      <svg className="w-4 h-4 fill-none stroke-current stroke-[2.4]" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M8 12l3 3 5-6" />
                      </svg>
                    )}
                    {order.status}
                  </span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 mt-3.5 pt-2 border-t border-[#f1f5f9]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-[38px] h-[38px] rounded-[12px] border border-[#e1e8f5] bg-white text-[#2563eb] grid place-items-center shrink-0">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </span>
                    <div className="leading-tight">
                      <small className="block text-[11px] font-bold text-[#666b85]">Order Date</small>
                      <b className="block text-[12px] font-extrabold text-[#0f172a]">{dateParts[0]}</b>
                      <span className="block text-[11px] text-[#666b85]">{dateParts.slice(1).join(' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 min-w-0 pl-3 border-l border-[#e1e8f5]">
                    <span className="w-[38px] h-[38px] rounded-[12px] border border-[#e1e8f5] bg-white text-[#2563eb] grid place-items-center shrink-0">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <path d="M20 12a8 8 0 1 1-2.500-5.800" />
                        <path d="M20 4v5h-5" />
                      </svg>
                    </span>
                    <div className="leading-tight">
                      <small className="block text-[11px] font-bold text-[#666b85]">Updated</small>
                      <b className="block text-[12px] font-extrabold text-[#0f172a]">{updateParts[0]}</b>
                      <span className="block text-[11px] text-[#666b85]">{updateParts.slice(1).join(' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3.5 pt-3 border-t border-[#e1e8f5] grid gap-2.5">
                  <div className="flex items-center gap-2.5 text-[14px]">
                    <svg className="w-4 h-4 text-slate-500 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
                      <rect x="3" y="7" width="18" height="14" rx="2" />
                      <path d="M8 7V4h8v3M3 12h18" />
                    </svg>
                    <span className="text-[#666b85] font-medium">Package</span>
                    <b className="ml-auto text-right font-extrabold text-[#0f172a]">{order.package}</b>
                  </div>

                  <div className="flex items-center gap-2.5 text-[14px]">
                    <svg className="w-4 h-4 text-slate-500 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="3" />
                      <path d="M7 10h6M7 14h3" />
                    </svg>
                    <span className="text-[#666b85] font-medium">Total Price</span>
                    <b className="ml-auto text-right font-extrabold text-[#2563eb]">৳{order.price.toFixed(2)}</b>
                  </div>

                  <div className="flex items-center gap-2.5 text-[14px]">
                    <svg className="w-4 h-4 text-slate-500 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                    </svg>
                    <span className="text-[#666b85] font-medium">Player ID</span>
                    <b className="ml-auto text-right font-extrabold text-[#0f172a]">{order.playerId}</b>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
