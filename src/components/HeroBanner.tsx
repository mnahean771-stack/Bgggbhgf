import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const BANNERS = ['/banner-1.jpg', '/banner-2.jpg', '/banner-3.jpg'];

export const HeroBanner: React.FC = () => {
  const { config } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const telegramLink = config.telegramGroup || 'https://t.me/FF_Gamecoin';

  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.clientX);
    setCurrentTranslate(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 8) {
      setHasMoved(true);
    }
    setCurrentTranslate(delta);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (currentTranslate < -45) {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    } else if (currentTranslate > 45) {
      setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
    }
    setCurrentTranslate(0);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative mt-4 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-[0_4px_0_#0f172a,0_16px_36px_-12px_rgba(15,23,42,0.28)] bg-[#050d24] select-none touch-pan-y"
    >
      <div
        className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}px))`,
          transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {BANNERS.map((banner, idx) => (
          <a
            key={idx}
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            title="গিভওয়ে ও সকল অফার সম্পর্কে জানতে টেলিগ্রাম চ্যানেলে জয়েন করুন"
            className="w-full shrink-0 aspect-2/1 min-h-[140px] sm:min-h-[170px] relative bg-[#050d24] cursor-pointer block"
            onClick={(e) => {
              if (hasMoved) {
                e.preventDefault();
              }
            }}
          >
            <img
              src={banner}
              alt={`Banner ${idx + 1}`}
              draggable={false}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('Banner%20')) {
                  target.src = `/Banner ${idx + 1}.jpg`;
                }
              }}
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </a>
        ))}
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute left-0 right-0 bottom-3 flex justify-center gap-1.5 z-10 pointer-events-none">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-xs ${
              idx === currentIndex
                ? 'w-7 bg-white shadow-[0_2px_8px_rgba(2,132,199,0.8)]'
                : 'w-2 bg-white/45 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
