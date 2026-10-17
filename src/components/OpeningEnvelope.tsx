import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Music, ArrowRight } from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

interface OpeningEnvelopeProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  onOpen: () => void;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({
  groomName,
  brideName,
  weddingDate,
  onOpen,
}) => {
  // Animation stages: 'closed' -> 'unsealing' -> 'sliding' -> 'dissolving' -> 'done'
  const [stage, setStage] = useState<'closed' | 'unsealing' | 'sliding' | 'dissolving' | 'done'>('closed');

  const handleOpenEnvelope = () => {
    if (stage !== 'closed') return;

    // Start background music
    weddingAudio.play();

    // Trigger golden and crimson celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#963535', '#F5E6C8', '#C5A072', '#B33939'],
        ticks: 250,
      });
    } catch {
      // ignore
    }

    // Step 1: Break seal and flip flap open
    setStage('unsealing');

    // Step 2: Slide the wedding letter card out from the envelope
    setTimeout(() => {
      setStage('sliding');
    }, 550);

    // Step 3: Dissolve the envelope to reveal the full website
    setTimeout(() => {
      setStage('dissolving');
    }, 2000);

    // Step 4: Complete transition and hand over to main web
    setTimeout(() => {
      setStage('done');
      onOpen();
    }, 2600);
  };

  const handleSkip = () => {
    weddingAudio.play();
    setStage('done');
    onOpen();
  };

  if (stage === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-700 ${
        stage === 'dissolving' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-black/60 pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md mx-auto text-center perspective-1000 flex flex-col items-center">
        {/* Envelope 3D Wrapper */}
        <div
          onClick={stage === 'closed' ? handleOpenEnvelope : undefined}
          className={`relative w-[340px] sm:w-[410px] h-[260px] sm:h-[280px] select-none cursor-pointer group transition-transform duration-500 ${
            stage === 'closed' ? 'hover:scale-[1.02] active:scale-[0.99]' : ''
          }`}
        >
          {/* 1. Envelope Back Pocket (Inside) */}
          <div className="absolute inset-0 rounded-2xl bg-[#5C1B1B] shadow-2xl border-2 border-[#D4AF37]/50 overflow-hidden" />

          {/* 2. Inner Letter Card that slides out */}
          <div
            className={`absolute left-3 right-3 sm:left-4 sm:right-4 h-[240px] sm:h-[255px] bg-[#FAF7F2] rounded-xl border border-[#D5C2AB] shadow-lg p-5 flex flex-col justify-between transition-all duration-1000 ease-out z-10 ${
              stage === 'sliding' || stage === 'dissolving'
                ? '-translate-y-[120px] sm:-translate-y-[135px] scale-[1.04] shadow-2xl'
                : 'top-2 translate-y-0 scale-95'
            }`}
          >
            {/* Gold corner ornaments */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-[#C5A072]" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#C5A072]" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#C5A072]" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[#C5A072]" />

            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="h-[0.5px] w-8 bg-[#C5A072]" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6D58] font-medium font-serif-title">
                  Thư Mời Hôn Lễ
                </span>
                <div className="h-[0.5px] w-8 bg-[#C5A072]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-serif-title text-[#2C2723] font-semibold mt-1">
                LỄ THÀNH HÔN
              </h2>
            </div>

            {/* Couple names & Auspicious date */}
            <div className="my-1">
              <p className="text-3xl sm:text-4xl font-script text-[#963535] leading-snug">
                {groomName} &amp; {brideName}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Heart className="w-3 h-3 text-[#C5A072] fill-[#C5A072]" />
                <span className="text-xs font-sans-body text-[#6A5E54] font-medium tracking-wider">
                  {weddingDate}
                </span>
                <Heart className="w-3 h-3 text-[#C5A072] fill-[#C5A072]" />
              </div>
            </div>

            <p className="text-[11px] text-[#736357] italic leading-relaxed">
              Trân trọng kính mời quý khách cùng sẻ chia niềm hạnh phúc ngập tràn trong ngày vui của chúng tôi!
            </p>
          </div>

          {/* 3. Envelope Front Flaps (V-Fold Triangular Pocket) */}
          <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden">
            {/* Left and Right triangular side folds */}
            <div
              className="absolute inset-0 bg-[#7B2222]"
              style={{
                clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
              }}
            />
            <div
              className="absolute inset-0 bg-[#832626]"
              style={{
                clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
              }}
            />
            {/* Bottom triangular pocket fold */}
            <div
              className="absolute inset-0 bg-[#8F2B2B] shadow-inner"
              style={{
                clipPath: 'polygon(0 100%, 50% 48%, 100% 100%)',
              }}
            />

            {/* Gold foil decorative line on pocket */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200/80 font-serif-title">
                Wedding Invitation
              </span>
            </div>
          </div>

          {/* 4. Top Triangular Flap (Folds open upwards in 3D) */}
          <div
            className={`absolute top-0 left-0 right-0 h-[140px] sm:h-[150px] preserve-3d transform-origin-top transition-transform duration-700 ease-in-out z-30 ${
              stage !== 'closed' ? 'rotate-x-180 pointer-events-none' : ''
            }`}
          >
            {/* Outside Flap Face (Triangular flap pointing down) */}
            <div
              className="w-full h-full bg-[#9E3030] shadow-md flex items-end justify-center pb-2 backface-hidden"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            >
              {/* Subtle gold line on flap edge */}
              <div className="w-12 h-0.5 bg-amber-300/40 mb-1" />
            </div>

            {/* Inside Flap Face (when folded open) */}
            <div
              className="absolute inset-0 w-full h-full bg-[#691E1E] backface-hidden rotate-x-180"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />
          </div>

          {/* 5. Ornate Wax Seal Button (Song Hỷ 囍) */}
          <div
            className={`absolute top-[125px] sm:top-[132px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${
              stage !== 'closed' ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100 scale-100'
            }`}
          >
            <div className="relative group/seal">
              {/* Glowing Aura Ring */}
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 opacity-60 blur-xs animate-pulse-subtle pointer-events-none" />

              {/* 3D Wax Seal Badge */}
              <button
                type="button"
                onClick={handleOpenEnvelope}
                className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#963535] via-[#802222] to-[#591414] border-2 border-amber-300/80 shadow-2xl flex items-center justify-center transform group-hover/seal:scale-110 active:scale-95 transition-all duration-300 cursor-pointer animate-gold-glow"
              >
                {/* Traditional Double Happiness Character 囍 */}
                <span className="text-amber-100 font-serif-title font-bold text-2xl sm:text-3xl tracking-widest drop-shadow-md select-none">
                  囍
                </span>

                {/* Subtle wax rim highlight */}
                <span className="absolute inset-1 rounded-full border border-amber-300/30 pointer-events-none" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls & Instruction */}
        <div className="mt-8 sm:mt-10 space-y-3 z-30">
          {stage === 'closed' ? (
            <>
              <button
                onClick={handleOpenEnvelope}
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#963535] to-[#B33939] hover:from-[#802222] hover:to-[#963535] text-white font-medium rounded-full shadow-xl shadow-[#963535]/40 hover:shadow-[#963535]/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-amber-300/40 text-sm tracking-wide"
              >
                <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                <span className="font-serif-title font-semibold">Chạm Mở Thiệp Cưới</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-amber-200/90 font-medium pt-1">
                <Music className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>Mở thiệp kèm phát nhạc nền lãng mạn</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs text-stone-400 hover:text-amber-200 underline decoration-stone-500/50 hover:decoration-amber-300 transition-colors cursor-pointer"
                >
                  Bỏ qua hoạt họa &amp; Vào thẳng trang &rarr;
                </button>
              </div>
            </>
          ) : (
            <div className="py-2 animate-in fade-in">
              <span className="inline-flex items-center gap-2 text-sm text-amber-200 font-serif-title font-medium tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                <span>Đang mở cánh thiệp hạnh phúc...</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
