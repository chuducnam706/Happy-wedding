import React from 'react';
import { Heart, Settings, Share2, ArrowUp } from 'lucide-react';

interface FooterSectionProps {
  groomShortName: string;
  brideShortName: string;
  weddingDate: string;
  onOpenEditor: () => void;
  isGuestViewMode?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  groomShortName,
  brideShortName,
  weddingDate,
  onOpenEditor,
  isGuestViewMode = false,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Thiệp Cưới Online - ${groomShortName} & ${brideShortName}`,
        text: `Trân trọng kính mời quý khách tham dự lễ cưới của ${groomShortName} và ${brideShortName}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết thiệp cưới để bạn chia sẻ cho bạn bè!');
    }
  };

  return (
    <footer className="py-14 px-4 bg-[#2C2723] text-[#FAF7F2] text-center relative">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Seal */}
        <div className="w-12 h-12 rounded-full bg-[#963535] text-amber-200 mx-auto flex items-center justify-center font-serif-title text-xl border border-amber-300/40 shadow-md">
          囍
        </div>

        <div>
          <h3 className="text-3xl sm:text-4xl font-script text-amber-100">
            {groomShortName} &amp; {brideShortName}
          </h3>
          <p className="text-xs text-amber-200/70 font-sans-body tracking-widest uppercase mt-1">
            {weddingDate}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 italic max-w-md mx-auto leading-relaxed">
          &ldquo;Cảm ơn tất cả người thân, thầy cô, bạn bè và đồng nghiệp đã luôn đồng hành, yêu thương và chúc phúc cho hành trình của chúng tôi!&rdquo;
        </p>

        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia sẻ thiệp</span>
          </button>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Lên đầu trang</span>
          </button>
        </div>

        {/* Quick edit button (hidden in guest view mode) */}
        {!isGuestViewMode && (
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={onOpenEditor}
              className="inline-flex items-center gap-1.5 text-xs text-amber-200/80 hover:text-amber-100 underline decoration-amber-200/40 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Tùy chỉnh nội dung &amp; Thay đổi ảnh thiệp cưới</span>
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};
