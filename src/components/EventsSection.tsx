import React from 'react';
import { Calendar, Clock, MapPin, Navigation, Sparkles } from 'lucide-react';
import { WeddingEvent } from '../data/weddingData';

interface EventsSectionProps {
  events: WeddingEvent[];
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const getEventMapUrl = (event: WeddingEvent) => {
    if (event.mapUrl && event.mapUrl.trim()) {
      const trimmed = event.mapUrl.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
      }
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
    }
    const fullAddress = [event.locationName, event.address].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  };

  return (
    <section className="py-16 px-4 bg-paper relative">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C6D58] font-medium font-serif-title">
            Sự Kiện Cưới
          </span>
          <div className="h-0.5 w-8 bg-[#963535] mx-auto mt-1" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif-title text-[#2C2723] font-semibold mb-3">
          LỊCH TRÌNH HÔN LỄ
        </h2>
        <p className="text-xs sm:text-sm text-[#736357] max-w-lg mx-auto mb-10 font-sans-body">
          Trân trọng thông báo thời gian và địa điểm tổ chức các nghi lễ trong ngày trọng đại
        </p>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {events.map((event, index) => {
            const mapLink = getEventMapUrl(event);

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-6 border border-[#D5C2AB] shadow-sm hover:shadow-md hover:border-[#963535]/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Accent Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    event.type === 'tiec-cuoi' ? 'bg-[#963535]' : 'bg-[#C5A072]'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D5C2AB] text-[#8C6D58]">
                      Sự kiện 0{index + 1}
                    </span>
                    {event.type === 'tiec-cuoi' && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-[#963535] bg-[#963535]/10 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Tiệc chính
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-serif-title text-[#963535] font-semibold mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-[#736357] italic mb-4">
                    {event.subtitle}
                  </p>

                  {/* Time & Date */}
                  <div className="space-y-2 py-3 border-y border-[#F0EBE1] my-3 text-xs sm:text-sm text-[#4A4036]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#963535] shrink-0" />
                      <span>
                        Giờ tổ chức: <strong className="text-[#2C2723]">{event.time}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#963535] shrink-0" />
                      <span>
                        {event.date} <span className="text-[#8C6D58]">({event.lunarDate})</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-2 pt-1">
                      <MapPin className="w-4 h-4 text-[#963535] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#2C2723]">{event.locationName}</p>
                        <p className="text-xs text-[#736357] mt-0.5 leading-relaxed">{event.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single clean Map Button that links directly to Google Maps */}
                <div className="pt-3">
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#963535] text-[#963535] hover:text-white border border-[#D5C2AB] hover:border-[#963535] text-xs sm:text-sm font-semibold transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 shrink-0" />
                    <span>Chỉ đường trên Google Maps</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
