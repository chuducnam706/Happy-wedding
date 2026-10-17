import React, { useState } from 'react';
import { Gift, Copy, Check, QrCode, Heart } from 'lucide-react';
import { WeddingConfig } from '../data/weddingData';

interface BankingGiftSectionProps {
  data: WeddingConfig;
}

export const BankingGiftSection: React.FC<BankingGiftSectionProps> = ({ data }) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopy = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(accountNumber);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const getQrUrl = (bankCode: string, accNum: string, accName: string) => {
    return `https://img.vietqr.io/image/${bankCode}-${accNum}-compact2.jpg?amount=&addInfo=Mung+cuoi+Huy+Lan&accountName=${encodeURIComponent(
      accName
    )}`;
  };

  return (
    <section className="py-16 px-4 bg-[#F5EFE6] border-t border-[#E2D5C4] relative">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C6D58] font-medium font-serif-title">
            Mừng Cưới Online
          </span>
          <div className="h-0.5 w-8 bg-[#963535] mx-auto mt-1" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif-title text-[#2C2723] font-semibold mb-3">
          HỘP MỪNG CƯỚI TỪ XA
        </h2>
        <p className="text-xs sm:text-sm text-[#736357] max-w-lg mx-auto mb-10 font-sans-body leading-relaxed">
          Sự hiện diện của quý khách là món quà quý giá nhất. Với những người thân yêu ở xa không thể tham dự, xin gửi lời chúc phúc và tình cảm qua đây:
        </p>

        {/* Bank Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          {/* Chú Rể */}
          <div className="bg-white rounded-2xl p-6 border border-[#D5C2AB] shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-[#963535] text-amber-100 text-[10px] font-semibold px-3 py-1 rounded-bl-lg tracking-wider uppercase">
              MỪNG CHÚ RỂ
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#963535]/10 text-[#963535] flex items-center justify-center font-bold text-sm">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif-title text-[#2C2723] font-semibold">
                    {data.groom.fullName}
                  </h3>
                  <p className="text-xs text-[#8C6D58]">
                    {data.groom.bank.bankName}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#D5C2AB] text-center my-3">
                <img
                  src={
                    data.groom.bank.qrUrl ||
                    getQrUrl(
                      data.groom.bank.bankCode,
                      data.groom.bank.accountNumber,
                      data.groom.bank.accountName
                    )
                  }
                  alt={`QR chuyển khoản mừng cưới ${data.groom.fullName}`}
                  className="w-48 h-auto mx-auto rounded-lg shadow-xs"
                />
                <span className="text-[11px] text-[#8C6D58] mt-2 block">
                  Quét mã VietQR bằng app ngân hàng
                </span>
              </div>

              {/* Account details */}
              <div className="space-y-1 text-xs text-[#594E44] bg-gray-50 p-3 rounded-xl border border-gray-100 my-2">
                <p>
                  <strong>Ngân hàng:</strong> {data.groom.bank.bankName}
                </p>
                <p>
                  <strong>Chủ tài khoản:</strong> {data.groom.bank.accountName}
                </p>
                <p>
                  <strong>Số tài khoản:</strong> {data.groom.bank.accountNumber}
                </p>
              </div>
            </div>

            {/* Copy button */}
            <button
              onClick={() => handleCopy(data.groom.bank.accountNumber)}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#963535] text-[#963535] hover:text-white border border-[#D5C2AB] hover:border-[#963535] text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300"
            >
              {copiedAccount === data.groom.bank.accountNumber ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Đã sao chép số tài khoản!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép số tài khoản</span>
                </>
              )}
            </button>
          </div>

          {/* Cô Dâu */}
          <div className="bg-white rounded-2xl p-6 border border-[#D5C2AB] shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-[#963535] text-amber-100 text-[10px] font-semibold px-3 py-1 rounded-bl-lg tracking-wider uppercase">
              MỪNG CÔ DÂU
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#963535]/10 text-[#963535] flex items-center justify-center font-bold text-sm">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif-title text-[#2C2723] font-semibold">
                    {data.bride.fullName}
                  </h3>
                  <p className="text-xs text-[#8C6D58]">
                    {data.bride.bank.bankName}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#D5C2AB] text-center my-3">
                <img
                  src={
                    data.bride.bank.qrUrl ||
                    getQrUrl(
                      data.bride.bank.bankCode,
                      data.bride.bank.accountNumber,
                      data.bride.bank.accountName
                    )
                  }
                  alt={`QR chuyển khoản mừng cưới ${data.bride.fullName}`}
                  className="w-48 h-auto mx-auto rounded-lg shadow-xs"
                />
                <span className="text-[11px] text-[#8C6D58] mt-2 block">
                  Quét mã VietQR bằng app ngân hàng
                </span>
              </div>

              {/* Account details */}
              <div className="space-y-1 text-xs text-[#594E44] bg-gray-50 p-3 rounded-xl border border-gray-100 my-2">
                <p>
                  <strong>Ngân hàng:</strong> {data.bride.bank.bankName}
                </p>
                <p>
                  <strong>Chủ tài khoản:</strong> {data.bride.bank.accountName}
                </p>
                <p>
                  <strong>Số tài khoản:</strong> {data.bride.bank.accountNumber}
                </p>
              </div>
            </div>

            {/* Copy button */}
            <button
              onClick={() => handleCopy(data.bride.bank.accountNumber)}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#963535] text-[#963535] hover:text-white border border-[#D5C2AB] hover:border-[#963535] text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300"
            >
              {copiedAccount === data.bride.bank.accountNumber ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Đã sao chép số tài khoản!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép số tài khoản</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
