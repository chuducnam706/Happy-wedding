import React from 'react';
import { Heart } from 'lucide-react';
import { LoveStoryItem } from '../data/weddingData';

interface LoveStorySectionProps {
  stories: LoveStoryItem[];
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ stories }) => {
  return (
    <section className="py-16 px-4 bg-paper relative overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section Header */}
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C6D58] font-medium font-serif-title">
            Hành Trình Yêu Thương
          </span>
          <div className="h-0.5 w-8 bg-[#963535] mx-auto mt-1" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif-title text-[#2C2723] font-semibold mb-3">
          CÂU CHUYỆN TÌNH YÊU
        </h2>
        <p className="text-xs sm:text-sm text-[#736357] max-w-lg mx-auto mb-12 font-sans-body">
          &ldquo;Gặp gỡ là duyên, bên nhau là sự lựa chọn, và nắm tay nhau đi hết cuộc đời là lời hứa.&rdquo;
        </p>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Center Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-[#D5C2AB] hidden sm:block" />

          <div className="space-y-10 sm:space-y-12">
            {stories.map((story, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={story.id}
                  className={`flex flex-col sm:flex-row items-center gap-6 ${
                    isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Photo side */}
                  <div className="w-full sm:w-1/2 flex justify-center">
                    <div className="w-full max-w-xs bg-white p-2.5 rounded-2xl border border-[#D5C2AB] shadow-sm group overflow-hidden">
                      <div className="overflow-hidden rounded-xl aspect-[4/3]">
                        <img
                          src={story.image}
                          alt={story.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Center Node (Heart badge) */}
                  <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-[#963535] text-amber-100 border-4 border-[#FAF7F2] shadow-md flex items-center justify-center -my-3 sm:my-0">
                    <Heart className="w-4 h-4 fill-amber-100" />
                  </div>

                  {/* Story Description Card */}
                  <div className="w-full sm:w-1/2 text-center sm:text-left">
                    <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-[#D5C2AB] shadow-sm">
                      <span className="inline-block px-3 py-0.5 rounded-full bg-[#963535]/10 text-[#963535] text-xs font-semibold tracking-wider mb-2">
                        {story.year}
                      </span>
                      <h3 className="text-lg font-serif-title text-[#2C2723] font-semibold mb-2">
                        {story.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#594E44] leading-relaxed">
                        {story.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
