import React, { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Upload, Plus } from 'lucide-react';
import { GalleryPhoto } from '../data/weddingData';

interface GallerySectionProps {
  photos: GalleryPhoto[];
  onUploadCustomPhoto: (file: File) => void;
  isGuestViewMode?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  onUploadCustomPhoto,
  isGuestViewMode = false,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('Tất cả');

  const tags = ['Tất cả', ...Array.from(new Set(photos.map((p) => p.tag).filter(Boolean)))];

  const filteredPhotos =
    selectedTag === 'Tất cả'
      ? photos
      : photos.filter((p) => p.tag === selectedTag);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) =>
        prev === 0 ? filteredPhotos.length - 1 : (prev ?? 0) - 1
      );
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) =>
        prev === filteredPhotos.length - 1 ? 0 : (prev ?? 0) + 1
      );
    }
  };

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (activePhotoIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev === 0 ? filteredPhotos.length - 1 : (prev ?? 0) - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) =>
          prev === filteredPhotos.length - 1 ? 0 : (prev ?? 0) + 1
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, filteredPhotos.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadCustomPhoto(e.target.files[0]);
    }
  };

  return (
    <section className="py-16 px-4 bg-[#F5EFE6] border-t border-[#E2D5C4] relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C6D58] font-medium font-serif-title">
            Khoảnh Khắc Đẹp
          </span>
          <div className="h-0.5 w-8 bg-[#963535] mx-auto mt-1" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif-title text-[#2C2723] font-semibold mb-3">
          ALBUM ẢNH CƯỚI
        </h2>
        <p className="text-xs sm:text-sm text-[#736357] max-w-lg mx-auto mb-6 font-sans-body">
          Những khung hình lưu giữ nụ cười và khoảnh khắc hạnh phúc nhất của Huy &amp; Lan
        </p>

        {/* Filter tags & Upload button */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag as string)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-[#963535] text-white shadow-sm'
                  : 'bg-white text-[#6A5E54] border border-[#D5C2AB] hover:bg-[#FAF7F2]'
              }`}
            >
              {tag}
            </button>
          ))}

          {/* Upload Custom Photo Button (hidden in guest view mode) */}
          {!isGuestViewMode && (
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-[#8C6D58] border border-amber-200 text-xs font-medium cursor-pointer transition-all hover:scale-105 shadow-sm">
              <Upload className="w-3.5 h-3.5 text-[#963535]" />
              <span>Thêm ảnh từ máy</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(index)}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-1.5 sm:p-2 border border-[#D5C2AB] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="overflow-hidden rounded-lg aspect-[3/4] relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white text-left">
                  <span className="text-[10px] text-amber-200 uppercase tracking-wider">
                    {photo.tag}
                  </span>
                  <p className="text-xs sm:text-sm font-medium font-serif-title truncate">
                    {photo.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && filteredPhotos[activePhotoIndex] && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Current photo */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={filteredPhotos[activePhotoIndex].url}
              alt={filteredPhotos[activePhotoIndex].title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/20"
            />
            <div className="mt-4 text-center text-white">
              <h4 className="text-lg font-serif-title">
                {filteredPhotos[activePhotoIndex].title}
              </h4>
              <p className="text-xs text-white/70 mt-1">
                {filteredPhotos[activePhotoIndex].description}
              </p>
              <span className="text-[11px] text-white/50 mt-1 block">
                {activePhotoIndex + 1} / {filteredPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
