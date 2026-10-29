import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProductGrid: React.FC = () => {
  const { navigateTo, products } = useApp();
  const [filter, setFilter] = useState<'all' | 'freefire' | 'special' | 'other'>('all');

  const activeProducts = products.filter((p) => p.active !== false);

  const displayedProducts =
    filter === 'all'
      ? activeProducts
      : activeProducts.filter((p) => (filter === 'freefire' ? p.tag === 'freefire' : p.tag === filter));

  return (
    <section className="mt-7">
      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-bold shrink-0 cursor-pointer transition-all ${
            filter === 'all'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          সবগুলো ({activeProducts.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('freefire')}
          className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-bold shrink-0 cursor-pointer transition-all ${
            filter === 'freefire'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Free Fire Topup
        </button>
        <button
          type="button"
          onClick={() => setFilter('special')}
          className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-bold shrink-0 cursor-pointer transition-all ${
            filter === 'special'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          স্পেশাল অফার 🔥
        </button>
        <button
          type="button"
          onClick={() => setFilter('other')}
          className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-bold shrink-0 cursor-pointer transition-all ${
            filter === 'other'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          অন্যান্য গেম
        </button>
      </div>

      {/* Main Free Fire Topup Section - exact match to Screenshot 2 */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="w-1.5 h-6 rounded-full bg-[#0284c7]" />
        <h2 className="text-[18px] font-extrabold text-[#0f172a] uppercase tracking-wide">
          FREE FIRE TOPUP
        </h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3.5">
        {displayedProducts.map((prod) => (
          <button
            key={prod.id}
            type="button"
            onClick={() => navigateTo('product', prod.id)}
            className="group relative rounded-2xl overflow-hidden bg-white border border-[#0f172a] shadow-[0_3px_0_#0f172a,0_8px_16px_-4px_rgba(15,23,42,0.18)] hover:-translate-y-1 hover:shadow-[0_5px_0_#0f172a,0_12px_22px_-4px_rgba(15,23,42,0.25)] active:translate-y-0.5 active:shadow-[0_1px_0_#0f172a] transition-all duration-150 text-left flex flex-col cursor-pointer"
          >
            {/* Image Container with high contrast border */}
            <div className="aspect-square w-full relative bg-[#e0f2fe] overflow-hidden border-b border-[#0f172a]">
              <img
                src={prod.image}
                alt={prod.name}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('Main')) {
                    target.src = '/main-logo.jpg';
                  }
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Discount/Badge indicator */}
              {prod.tag === 'special' && (
                <span className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-md shadow-xs uppercase">
                  Hot
                </span>
              )}
            </div>

            {/* Title Bar - White background with black text */}
            <div className="flex items-center justify-center min-h-[46px] p-1.5 text-[11px] sm:text-[12px] font-extrabold text-[#0f172a] text-center uppercase tracking-wide leading-tight bg-white">
              <span className="line-clamp-2">{prod.name}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
