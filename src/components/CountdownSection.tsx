import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart } from 'lucide-react';

interface CountdownSectionProps {
  targetDate: string; // ISO string e.g. '2026-10-25T11:00:00'
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPassed: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleAddToCalendar = () => {
    const title = encodeURIComponent('Đám cưới Quốc Huy & Ngọc Lan');
    const details = encodeURIComponent('Trân trọng kính mời quý khách tham dự Lễ thành hôn & Tiệc mừng!');
    const location = encodeURIComponent('Trung Tâm Tiệc Cưới Trống Đồng Palace, 65 Quán Sứ, Hoàn Kiếm, Hà Nội');
    const dates = '20261025T040000Z/20261025T080000Z'; // UTC time
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-14 px-4 bg-[#963535] text-white text-center relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />

      <div className="max-w-xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 text-amber-200 text-xs font-serif-title uppercase tracking-widest mb-2">
          <Clock className="w-4 h-4" />
          <span>Thời gian chỉ còn</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif-title text-amber-50 font-semibold mb-2">
          ĐẾM NGƯỢC NGÀY CHUNG ĐÔI
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 mb-8 font-sans-body">
          Cùng đếm ngược đến khoảnh khắc trọng đại của Huy &amp; Lan
        </p>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 mb-8">
          {[
            { label: 'Ngày', value: timeLeft.days },
            { label: 'Giờ', value: timeLeft.hours },
            { label: 'Phút', value: timeLeft.minutes },
            { label: 'Giây', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-black/25 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-300/20 shadow-inner flex flex-col items-center justify-center"
            >
              <span className="text-2xl sm:text-4xl font-serif-title font-bold text-amber-100 tracking-tight">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs text-amber-200/70 uppercase tracking-wider mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="inline-flex items-center gap-3">
          <button
            onClick={handleAddToCalendar}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 hover:bg-white text-[#963535] text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-105"
          >
            <Calendar className="w-4 h-4" />
            <span>Thêm vào Google Calendar</span>
          </button>
        </div>
      </div>
    </section>
  );
};
