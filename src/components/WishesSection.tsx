import React, { useState } from 'react';
import { MessageCircleHeart, Send, Heart, Sparkles, User } from 'lucide-react';
import { WishItem } from '../data/weddingData';

interface WishesSectionProps {
  wishes: WishItem[];
  onAddWish: (wish: Omit<WishItem, 'id' | 'createdAt'>) => void;
}

export const WishesSection: React.FC<WishesSectionProps> = ({ wishes, onAddWish }) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Bạn bè');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    onAddWish({
      senderName: name.trim(),
      relationship,
      message: message.trim(),
    });

    setName('');
    setMessage('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <section id="wishes-section" className="py-16 px-4 bg-paper relative">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C6D58] font-medium font-serif-title">
            Sổ Lưu Bút
          </span>
          <div className="h-0.5 w-8 bg-[#963535] mx-auto mt-1" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif-title text-[#2C2723] font-semibold mb-3">
          GỬI LỜI CHÚC MỪNG
        </h2>
        <p className="text-xs sm:text-sm text-[#736357] max-w-md mx-auto mb-10 font-sans-body">
          Những dòng nhắn gửi yêu thương của bạn sẽ là kỷ niệm vô giá dành cho cô dâu &amp; chú rể
        </p>

        {/* Wish Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D5C2AB] shadow-sm mb-10 text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C2723] uppercase tracking-wider mb-1.5">
                  Tên của bạn <span className="text-[#963535]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Long, Chị Thảo..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AB] focus:border-[#963535] outline-none text-sm bg-[#FAF7F2]/50 text-[#2C2723]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2723] uppercase tracking-wider mb-1.5">
                  Mối quan hệ
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AB] focus:border-[#963535] outline-none text-sm bg-[#FAF7F2]/50 text-[#2C2723]"
                >
                  <option value="Bạn của Chú Rể">Bạn của Chú Rể</option>
                  <option value="Bạn của Cô Dâu">Bạn của Cô Dâu</option>
                  <option value="Họ hàng Nhà Trai">Họ hàng Nhà Trai</option>
                  <option value="Họ hàng Nhà Gái">Họ hàng Nhà Gái</option>
                  <option value="Đồng nghiệp">Đồng nghiệp</option>
                  <option value="Người thân quý mến">Người thân quý mến</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C2723] uppercase tracking-wider mb-1.5">
                Lời chúc phúc <span className="text-[#963535]">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Viết lời chúc phúc chân thành gửi tới Huy &amp; Lan..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AB] focus:border-[#963535] outline-none text-sm bg-[#FAF7F2]/50 text-[#2C2723] resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSuccess ? (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Cảm ơn lời chúc ngọt ngào của bạn!
                </span>
              ) : (
                <span className="text-[11px] text-[#8C6D58] italic">
                  Lời chúc sẽ hiển thị ngay bên dưới
                </span>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#963535] hover:bg-[#7D2929] text-white text-xs sm:text-sm font-medium shadow-md shadow-[#963535]/30 transition-all hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi lời chúc</span>
              </button>
            </div>
          </form>
        </div>

        {/* Wishes List (Wall of Wishes) */}
        <div className="text-left space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
          {wishes.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-[#D5C2AB] shadow-xs hover:border-[#963535]/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#963535]/10 text-[#963535] flex items-center justify-center font-bold text-xs">
                    {item.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-serif-title font-semibold text-[#2C2723]">
                      {item.senderName}
                    </h4>
                    <span className="text-[11px] text-[#8C6D58]">
                      {item.relationship}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-[#A08E80]">
                  {item.createdAt}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#594E44] leading-relaxed pl-10 italic">
                &ldquo;{item.message}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
