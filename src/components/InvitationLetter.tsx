import React from 'react';
import { Phone, HeartHandshake, MapPin } from 'lucide-react';
import { WeddingConfig } from '../data/weddingData';

interface InvitationLetterProps {
  data: WeddingConfig;
}

export const InvitationLetter: React.FC<InvitationLetterProps> = ({ data }) => {
  return (
    <section className="py-16 px-4 bg-[#F5EFE6] border-y border-[#E2D5C4] relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute right-[-40px] top-10 text-[180px] font-serif-title text-[#963535]/5 select-none pointer-events-none">
        囍
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C6D58] font-medium font-serif-title">
            Thư Ngỏ
          </span>
          <div className="h-0.5 w-8 bg-[#963535] mx-auto mt-1" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif-title text-[#2C2723] font-semibold mb-6">
          LỜI NGỎ TỪ CÔ DÂU &amp; CHÚ RỂ
        </h2>

        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-[#D5C2AB] shadow-sm mb-12">
          <p className="text-sm sm:text-base font-sans-body text-[#594E44] leading-relaxed italic mb-4">
            &ldquo;{data.welcomeMessage}&rdquo;
          </p>
          <div className="h-[1px] w-16 bg-[#B33939]/30 mx-auto my-4" />
          <p className="text-xs sm:text-sm text-[#736357] leading-relaxed">
            {data.invitationMessage} Sự hiện diện và lời chúc phúc của quý khách là niềm vinh hạnh lớn nhất cho hai bên gia đình và đôi bạn trẻ chúng tôi!
          </p>
        </div>

        {/* Two Families Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
          {/* Nhà Trai */}
          <div className="bg-white rounded-2xl p-6 border border-[#D5C2AB] shadow-sm relative overflow-hidden group hover:border-[#963535]/40 transition-colors">
            <div className="absolute top-0 right-0 bg-[#963535] text-amber-100 text-[11px] font-medium px-3 py-1 rounded-bl-lg tracking-wider uppercase">
              NHÀ TRAI
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={data.groom.avatar}
                alt={data.groom.fullName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#C5A072] shadow-sm"
              />
              <div>
                <span className="text-xs text-[#8C6D58] uppercase tracking-wider font-medium">
                  Chú Rể (Trưởng Nam)
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-title text-[#963535] font-semibold">
                  {data.groom.fullName}
                </h3>
                <a
                  href={`tel:${data.groom.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#6A5E54] hover:text-[#963535] mt-1 font-medium transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#963535]" />
                  <span>{data.groom.phone}</span>
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-xs sm:text-sm text-[#594E44] space-y-1">
              <p>
                <strong className="text-[#2C2723]">Thân phụ:</strong> {data.groom.fatherName}
              </p>
              <p>
                <strong className="text-[#2C2723]">Thân mẫu:</strong> {data.groom.motherName}
              </p>
              <p className="flex items-start gap-1 text-xs text-[#736357] mt-2">
                <MapPin className="w-3.5 h-3.5 text-[#963535] shrink-0 mt-0.5" />
                <span>{data.groom.address}</span>
              </p>
            </div>
          </div>

          {/* Nhà Gái */}
          <div className="bg-white rounded-2xl p-6 border border-[#D5C2AB] shadow-sm relative overflow-hidden group hover:border-[#963535]/40 transition-colors">
            <div className="absolute top-0 right-0 bg-[#963535] text-amber-100 text-[11px] font-medium px-3 py-1 rounded-bl-lg tracking-wider uppercase">
              NHÀ GÁI
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={data.bride.avatar}
                alt={data.bride.fullName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#C5A072] shadow-sm"
              />
              <div>
                <span className="text-xs text-[#8C6D58] uppercase tracking-wider font-medium">
                  Cô Dâu (Ái Nữ)
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-title text-[#963535] font-semibold">
                  {data.bride.fullName}
                </h3>
                <a
                  href={`tel:${data.bride.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#6A5E54] hover:text-[#963535] mt-1 font-medium transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#963535]" />
                  <span>{data.bride.phone}</span>
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-xs sm:text-sm text-[#594E44] space-y-1">
              <p>
                <strong className="text-[#2C2723]">Thân phụ:</strong> {data.bride.fatherName}
              </p>
              <p>
                <strong className="text-[#2C2723]">Thân mẫu:</strong> {data.bride.motherName}
              </p>
              <p className="flex items-start gap-1 text-xs text-[#736357] mt-2">
                <MapPin className="w-3.5 h-3.5 text-[#963535] shrink-0 mt-0.5" />
                <span>{data.bride.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
