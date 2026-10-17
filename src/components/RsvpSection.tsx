import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, UserCheck, Heart, Sparkles } from 'lucide-react';
import { RSVPItem } from '../data/weddingData';

interface RsvpSectionProps {
  onAddRsvp: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ onAddRsvp }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    attending: 'yes' as 'yes' | 'no',
    event: 'Tiệc mừng trọng đại (Trưa 25/10/2026)',
    guestCount: 1,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const triggerFireworks = () => {
    // 1. Initial celebratory burst from center
    try {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#963535', '#F5E6C8', '#FF6B6B', '#E67E22'],
      });
    } catch {
      // ignore
    }

    // 2. Gentle sky fireworks bursts over 2.5 seconds
    const duration = 2400;
    const animationEnd = Date.now() + duration;
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleRatio = Math.max(0.4, timeLeft / duration);

      try {
        // Firework burst on left
        confetti({
          startVelocity: 28,
          spread: 360,
          ticks: 65,
          origin: { x: randomInRange(0.18, 0.42), y: randomInRange(0.25, 0.45) },
          colors: ['#FFD700', '#FF4D4D', '#C5A072', '#FAF7F2', '#FF85A2'],
          particleCount: Math.floor(35 * particleRatio),
          zIndex: 1000,
        });

        // Firework burst on right
        confetti({
          startVelocity: 28,
          spread: 360,
          ticks: 65,
          origin: { x: randomInRange(0.58, 0.82), y: randomInRange(0.25, 0.45) },
          colors: ['#FFD700', '#E74C3C', '#F39C12', '#FAF7F2', '#963535'],
          particleCount: Math.floor(35 * particleRatio),
          zIndex: 1000,
        });
      } catch {
        clearInterval(interval);
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    onAddRsvp({
      name: form.name,
      phone: form.phone,
      attending: form.attending,
      event: form.event,
      guestCount: form.guestCount,
      message: form.message,
    });

    // Launch gentle fireworks celebration
    triggerFireworks();

    setSubmitted(true);
  };

  return (
    <section id="rsvp-section" className="py-16 px-4 bg-[#F5EFE6] border-t border-[#E2D5C4] relative">
      <div className="max-w-xl mx-auto text-center">
        {/* Header */}
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C6D58] font-medium font-serif-title">
            Xác Nhận Tham Dự
          </span>
          <div className="h-0.5 w-8 bg-[#963535] mx-auto mt-1" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif-title text-[#2C2723] font-semibold mb-3">
          SỰ HIỆN DIỆN CỦA BẠN
        </h2>
        <p className="text-xs sm:text-sm text-[#736357] max-w-md mx-auto mb-8 font-sans-body">
          Để chuẩn bị đón tiếp chu đáo nhất, xin vui lòng gửi thông tin xác nhận tham dự trước ngày 20/10/2026
        </p>

        {submitted ? (
          <div className="bg-white rounded-2xl p-8 border border-[#D5C2AB] shadow-md text-center animate-in fade-in space-y-4">
            <div className="relative inline-block mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-[#8C6D58] border border-amber-200 text-xs font-medium mb-2">
                🎉 Xác nhận thành công!
              </span>
              <h3 className="text-2xl font-serif-title text-[#2C2723] font-semibold">
                Cảm ơn {form.name}!
              </h3>
            </div>

            <p className="text-sm text-[#594E44] leading-relaxed max-w-sm mx-auto">
              Lời xác nhận của bạn đã được gửi đến cô dâu &amp; chú rể. Sự có mặt của bạn là niềm hạnh phúc lớn nhất của chúng tôi!
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={triggerFireworks}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-[#963535] border border-amber-200 text-xs font-semibold transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bắn pháo hoa ăn mừng ✨</span>
              </button>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: '',
                    phone: '',
                    attending: 'yes',
                    event: 'Tiệc mừng trọng đại (Trưa 25/10/2026)',
                    guestCount: 1,
                    message: '',
                  });
                }}
                className="text-xs text-gray-500 underline font-medium hover:text-[#963535] cursor-pointer"
              >
                Gửi thêm phản hồi khác
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D5C2AB] shadow-sm text-left space-y-5"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#2C2723] uppercase tracking-wider mb-1.5">
                Họ và Tên quý khách <span className="text-[#963535]">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ví dụ: Anh Nguyễn Văn Nam"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AB] focus:border-[#963535] focus:ring-1 focus:ring-[#963535] outline-none text-sm bg-[#FAF7F2]/50 text-[#2C2723]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#2C2723] uppercase tracking-wider mb-1.5">
                Số điện thoại liên hệ
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Số điện thoại của bạn"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AB] focus:border-[#963535] focus:ring-1 focus:ring-[#963535] outline-none text-sm bg-[#FAF7F2]/50 text-[#2C2723]"
              />
            </div>

            {/* Attendance radio */}
            <div>
              <label className="block text-xs font-semibold text-[#2C2723] uppercase tracking-wider mb-2">
                Bạn có thể tới tham dự chứ? <span className="text-[#963535]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, attending: 'yes' })}
                  className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    form.attending === 'yes'
                      ? 'bg-[#963535] text-white border-[#963535] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#6A5E54] border-[#D5C2AB]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chắc chắn sẽ tới</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, attending: 'no' })}
                  className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    form.attending === 'no'
                      ? 'bg-[#736357] text-white border-[#736357] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#6A5E54] border-[#D5C2AB]'
                  }`}
                >
                  <span>Rất tiếc không thể tới</span>
                </button>
              </div>
            </div>

            {form.attending === 'yes' && (
              <>
                {/* Event selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C2723] uppercase tracking-wider mb-1.5">
                    Bạn tham dự sự kiện nào?
                  </label>
                  <select
                    value={form.event}
                    onChange={(e) => setForm({ ...form, event: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AB] focus:border-[#963535] outline-none text-sm bg-[#FAF7F2]/50 text-[#2C2723]"
                  >
                    <option value="Tiệc mừng trọng đại (Trưa 25/10/2026)">
                      Tiệc mừng trọng đại - Trống Đồng Palace (11:30 Trưa 25/10)
                    </option>
                    <option value="Lễ Thành Hôn - Nhà Trai Đông Anh (10:30 Sáng 25/10)">
                      Lễ Thành Hôn - Nhà Trai Đông Anh (10:30 Sáng 25/10)
                    </option>
                    <option value="Lễ Vu Quy - Nhà Gái Sơn Tây (09:30 Sáng 25/10)">
                      Lễ Vu Quy - Nhà Gái Sơn Tây (09:30 Sáng 25/10)
                    </option>
                    <option value="Tham dự trọn vẹn cả ngày lễ">
                      Tham dự trọn vẹn cả ngày lễ
                    </option>
                  </select>
                </div>

                {/* Guest count */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C2723] uppercase tracking-wider mb-1.5">
                    Số người cùng tham dự
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setForm({ ...form, guestCount: count })}
                        className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          form.guestCount === count
                            ? 'bg-[#963535] text-white border-[#963535]'
                            : 'bg-[#FAF7F2] text-[#6A5E54] border-[#D5C2AB]'
                        }`}
                      >
                        {count === 4 ? '4+ người' : `${count} người`}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-[#2C2723] uppercase tracking-wider mb-1.5">
                Lời nhắn gửi tới cô dâu &amp; chú rể
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Gửi lời chúc mừng hoặc dặn dò đặc biệt..."
                className="w-full px-4 py-2 rounded-xl border border-[#D5C2AB] focus:border-[#963535] outline-none text-sm bg-[#FAF7F2]/50 text-[#2C2723] resize-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#963535] to-[#B33939] hover:from-[#7D2929] hover:to-[#963535] text-white font-medium text-sm shadow-md shadow-[#963535]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Xác Nhận Tham Dự</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
