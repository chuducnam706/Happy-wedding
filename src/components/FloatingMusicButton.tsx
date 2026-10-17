import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc3, ListMusic } from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';
import { MusicTrack } from '../data/weddingData';

interface FloatingMusicButtonProps {
  onOpenMusicSelector?: () => void;
}

export const FloatingMusicButton: React.FC<FloatingMusicButtonProps> = ({
  onOpenMusicSelector,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(weddingAudio.getCurrentTrack());

  useEffect(() => {
    const unsubscribe = weddingAudio.subscribe((playing, track) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    weddingAudio.toggle();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
      {/* Track title badge & Change song button */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D5C2AB] rounded-full text-xs text-[#6A5E54] shadow-lg max-w-[210px] sm:max-w-xs transition-all">
        <div className="flex items-center gap-1.5 truncate">
          <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-[#963535] animate-pulse' : 'text-gray-400'}`} />
          <span className="truncate font-medium text-[11px] sm:text-xs text-[#2C2723]">
            {currentTrack.title}
          </span>
        </div>

        {onOpenMusicSelector && (
          <button
            onClick={onOpenMusicSelector}
            title="Chọn bài hát khác"
            className="p-1 rounded-full hover:bg-amber-100 text-[#963535] transition-colors shrink-0 ml-1 cursor-pointer"
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Disc Button */}
      <button
        onClick={handleToggle}
        aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-xl transition-all duration-300 border-2 shrink-0 cursor-pointer ${
          isPlaying
            ? 'bg-[#963535] text-white border-amber-300/70 shadow-[#963535]/40 hover:scale-105'
            : 'bg-white/95 text-[#6A5E54] border-[#D5C2AB] shadow-md hover:scale-105'
        }`}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            {/* Spinning disc */}
            <div className="animate-spin-slow flex items-center justify-center">
              <Disc3 className="w-6 h-6 text-amber-200" />
            </div>
            <span className="absolute -inset-1 rounded-full border border-amber-300/50 animate-ping opacity-25 pointer-events-none" />
          </div>
        ) : (
          <VolumeX className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  );
};
