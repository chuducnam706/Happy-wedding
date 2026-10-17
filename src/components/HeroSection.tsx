import React from 'react';
import { Calendar, Heart, ChevronDown, CheckCircle2, MessageCircleHeart } from 'lucide-react';
import { WeddingConfig } from '../data/weddingData';

interface HeroSectionProps {
  data: WeddingConfig;
  onNavigateRsvp: () => void;
  onNavigateWishes: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  onNavigateRsvp,
  onNavigateWishes,
}) => {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-between px-4 pt-10 pb-8 text-center bg-paper overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-[#963535]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Save The Date */}
      <div className="relative z-10 w-full max-w-xl mx-auto mt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#963535]/10 border border-[#963535]/20 text-[#963535] text-xs font-medium tracking-widest uppercase mb-3">
          <span>囍</span>
          <span>Save The Date</span>
          <span>囍</span>
        </div>

        <h2 className="text-sm sm:text-base tracking-[0.3em] uppercase text-[#736357] font-serif-title font-semibold">
          LỄ THÀNH HÔN &amp; ĂN HỎI
        </h2>

        {/* Couple Names in signature script calligraphy */}
        <div className="my-3 sm:my-5">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-script text-[#963535] leading-none drop-shadow-sm py-2">
            {data.groom.shortName} <span className="text-3xl sm:text-5xl text-[#C5A072] font-serif-title">&amp;</span> {data.bride.shortName}
          </h1>
        </div>

        <div className="flex items-center justify-center gap-3 my-2">
          <div className="h-[1px] w-12 sm:w-16 bg-[#B33939]/30" />
          <div className="w-2 h-2 rounded-full bg-[#B33939]" />
          <div className="h-[1px] w-12 sm:w-16 bg-[#B33939]/30" />
        </div>

        {/* Date line */}
        <p className="text-base sm:text-lg font-serif-title text-[#2C2723] font-medium tracking-widest uppercase mt-2">
          {data.weddingDateFormatted}
        </p>
        <p className="text-xs sm:text-sm text-[#8C6D58] font-sans-body italic mt-1">
          (Tức {data.lunarDateFormatted})
        </p>
      </div>

      {/* Main Vintage Framed Photo Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md my-6 group">
        {/* Ornate Frame Border */}
        <div className="relative p-2.5 sm:p-3.5 bg-white rounded-2xl shadow-xl border border-[#D5C2AB]">
          {/* Inner decorative double border */}
          <div className="relative overflow-hidden rounded-xl border border-[#963535]/30">
            {/* Corner floral motifs */}
            <div className="absolute top-2 left-2 z-20 text-[#B33939]/70 text-xs pointer-events-none">
              ❧
            </div>
            <div className="absolute top-2 right-2 z-20 text-[#B33939]/70 text-xs pointer-events-none rotate-90">
              ❧
            </div>
            <div className="absolute bottom-2 left-2 z-20 text-[#B33939]/70 text-xs pointer-events-none -rotate-90">
              ❧
            </div>
            <div className="absolute bottom-2 right-2 z-20 text-[#B33939]/70 text-xs pointer-events-none rotate-180">
              ❧
            </div>

            <img
              src={data.coverImage}
              alt="Ảnh cưới Quốc Huy và Ngọc Lan"
              referrerPolicy="no-referrer"
              className="w-full h-auto aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Bottom photo overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[11px] uppercase tracking-widest text-amber-200 font-medium">
                Kỷ niệm ngày chung đôi
              </span>
              <p className="text-xl font-serif-title font-medium">
                Huy &amp; Lan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="relative z-10 w-full max-w-md flex flex-wrap items-center justify-center gap-3 mt-1 mb-4">
        <button
          onClick={onNavigateRsvp}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#963535] hover:bg-[#7D2929] text-white text-sm font-medium shadow-md shadow-[#963535]/30 transition-all hover:-translate-y-0.5"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-200" />
          <span>Xác nhận tham dự</span>
        </button>

        <button
          onClick={onNavigateWishes}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#963535] border border-[#963535]/40 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5"
        >
          <MessageCircleHeart className="w-4 h-4 text-[#963535]" />
          <span>Gửi lời chúc</span>
        </button>
      </div>

      {/* Scroll Down Hint */}
      <div className="relative z-10 flex flex-col items-center text-[#8C6D58] animate-bounce text-xs mt-2">
        <span className="text-[11px] font-medium tracking-wider uppercase mb-1">Vuốt xuống</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
};
