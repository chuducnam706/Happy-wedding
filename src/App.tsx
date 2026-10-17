/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_WEDDING_DATA,
  INITIAL_WISHES,
  WeddingConfig,
  WishItem,
  RSVPItem,
} from './data/weddingData';
import { OpeningEnvelope } from './components/OpeningEnvelope';
import { FloatingMusicButton } from './components/FloatingMusicButton';
import { FallingPetals } from './components/FallingPetals';
import { HeroSection } from './components/HeroSection';
import { InvitationLetter } from './components/InvitationLetter';
import { CountdownSection } from './components/CountdownSection';
import { EventsSection } from './components/EventsSection';
import { GallerySection } from './components/GallerySection';
import { LoveStorySection } from './components/LoveStorySection';
import { RsvpSection } from './components/RsvpSection';
import { WishesSection } from './components/WishesSection';
import { BankingGiftSection } from './components/BankingGiftSection';
import { FooterSection } from './components/FooterSection';
import { AdminEditorModal } from './components/AdminEditorModal';
import { Settings, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { compressImage } from './utils/imageCompressor';
import { weddingAudio } from './utils/audioPlayer';

const STORAGE_KEY_DATA = 'wedding_invitation_config_v2';
const STORAGE_KEY_WISHES = 'wedding_invitation_wishes_v2';
const STORAGE_KEY_RSVP = 'wedding_invitation_rsvps_v2';
const STORAGE_KEY_ENVELOPE = 'wedding_envelope_opened_v2';
const STORAGE_KEY_GUEST_VIEW = 'wedding_guest_view_mode_v2';

export default function App() {
  const [data, setData] = useState<WeddingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_WEDDING_DATA;
  });

  const [wishes, setWishes] = useState<WishItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WISHES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_WISHES;
  });

  const [rsvps, setRsvps] = useState<RSVPItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RSVP);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState<'info' | 'images' | 'events' | 'music' | 'bank' | 'rsvps'>('info');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGuestViewMode, setIsGuestViewMode] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mode') === 'view' || urlParams.get('view') === 'guest') {
        return true;
      }
      return localStorage.getItem(STORAGE_KEY_GUEST_VIEW) === 'true';
    } catch {
      return false;
    }
  });
  const [envelopeDismissed, setEnvelopeDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ENVELOPE) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (data.musicTrack) {
      weddingAudio.setTrack(data.musicTrack, false);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Load & Sync config from server
  useEffect(() => {
    const fetchServerConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const json = await res.json();
          if (json.config && Object.keys(json.config).length > 0) {
            setData(json.config);
            localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(json.config));
          }
        }
      } catch (e) {
        console.warn('Could not load config from server:', e);
      }
    };
    fetchServerConfig();
  }, []);

  // 2. Realtime sync for Wishes (poll every 4 seconds)
  useEffect(() => {
    let isMounted = true;
    const fetchWishes = async () => {
      try {
        const res = await fetch('/api/wishes');
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.wishes) && json.wishes.length > 0 && isMounted) {
            setWishes(json.wishes);
            localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(json.wishes));
          }
        }
      } catch (e) {
        // Fallback silently to local
      }
    };

    fetchWishes();
    const interval = setInterval(fetchWishes, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 3. Realtime sync for RSVPs (poll every 6 seconds)
  useEffect(() => {
    let isMounted = true;
    const fetchRsvps = async () => {
      try {
        const res = await fetch('/api/rsvps');
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.rsvps) && isMounted) {
            setRsvps(json.rsvps);
            localStorage.setItem(STORAGE_KEY_RSVP, JSON.stringify(json.rsvps));
          }
        }
      } catch (e) {
        // Fallback silently
      }
    };

    fetchRsvps();
    const interval = setInterval(fetchRsvps, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(wishes));
    } catch {
      // ignore
    }
  }, [wishes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RSVP, JSON.stringify(rsvps));
    } catch {
      // ignore
    }
  }, [rsvps]);

  const handleSaveData = async (newData: WeddingConfig) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(newData));
    } catch (e) {
      console.warn('Quota exceeded on direct save:', e);
    }
    showToast('Đã lưu và cập nhật thay đổi thành công!');

    // Persist to server for cross-device sync
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
    } catch (err) {
      console.warn('Lỗi đồng bộ cấu hình tới máy chủ:', err);
    }
  };

  const handlePreviewData = (previewData: WeddingConfig) => {
    setData(previewData);
    showToast('Đang xem trước thay đổi trực tiếp trên web!');
  };

  const handleToggleViewMode = () => {
    const nextMode = !isGuestViewMode;
    setIsGuestViewMode(nextMode);
    try {
      localStorage.setItem(STORAGE_KEY_GUEST_VIEW, String(nextMode));
    } catch {
      // ignore
    }
    if (nextMode) {
      showToast('Đã chuyển sang Chế độ xem: Ẩn các công cụ chỉnh sửa để khách xem thuần túy!');
    } else {
      showToast('Đã mở Chế độ quản trị & chỉnh sửa!');
    }
  };

  const handleOpenMusicTab = () => {
    setEditorInitialTab('music');
    setIsEditorOpen(true);
  };

  const handleOpenGeneralEditor = () => {
    setEditorInitialTab('info');
    setIsEditorOpen(true);
  };

  const handleAddWish = async (newWish: Omit<WishItem, 'id' | 'createdAt'>) => {
    const tempItem: WishItem = {
      ...newWish,
      id: `w-${Date.now()}`,
      createdAt: 'Vừa xong',
    };
    // Optimistic UI update
    setWishes((prev) => [tempItem, ...prev]);
    showToast('Đã gửi lời chúc mừng!');

    // Send to server in realtime
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWish),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.wishes) {
          setWishes(json.wishes);
        }
      }
    } catch (err) {
      console.warn('Lỗi gửi lời chúc tới máy chủ:', err);
    }
  };

  const handleAddRsvp = async (newRsvp: Omit<RSVPItem, 'id' | 'createdAt'>) => {
    const tempItem: RSVPItem = {
      ...newRsvp,
      id: `r-${Date.now()}`,
      createdAt: new Date().toLocaleString('vi-VN'),
    };
    // Optimistic UI update
    setRsvps((prev) => [tempItem, ...prev]);
    showToast('Đã ghi nhận xác nhận tham dự!');

    // Send to server in realtime
    try {
      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRsvp),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.rsvps) {
          setRsvps(json.rsvps);
        }
      }
    } catch (err) {
      console.warn('Lỗi gửi RSVP tới máy chủ:', err);
    }
  };

  const handleUploadCustomPhoto = async (file: File) => {
    try {
      const compressedUrl = await compressImage(file, 1200, 1200, 0.82);
      const newPhoto = {
        id: `photo-${Date.now()}`,
        url: compressedUrl,
        title: 'Ảnh cưới tải lên',
        description: 'Khoảnh khắc đáng nhớ',
        tag: 'Kỷ niệm',
      };
      setData((prev) => ({
        ...prev,
        gallery: [newPhoto, ...prev.gallery],
      }));
      showToast('Đã thêm ảnh mới vào album cưới!');
    } catch (err) {
      console.error('Lỗi tải ảnh:', err);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Bạn có chắc muốn khôi phục toàn bộ thông tin thiệp về mặc định?')) {
      setData(INITIAL_WEDDING_DATA);
      try {
        localStorage.removeItem(STORAGE_KEY_DATA);
        await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(INITIAL_WEDDING_DATA),
        });
      } catch {
        // ignore
      }
      showToast('Đã khôi phục thông tin mặc định!');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans-body text-[#3D3A37] relative selection:bg-[#963535] selection:text-white">
      {/* Interactive Opening Envelope curtain (shows on first visit) */}
      {!envelopeDismissed && (
        <OpeningEnvelope
          groomName={data.groom.shortName}
          brideName={data.bride.shortName}
          weddingDate={data.weddingDateFormatted}
          onOpen={() => {
            setEnvelopeDismissed(true);
            try {
              sessionStorage.setItem(STORAGE_KEY_ENVELOPE, 'true');
            } catch {
              // ignore
            }
          }}
        />
      )}

      {/* Floating Music player button with song title and direct selector */}
      <FloatingMusicButton onOpenMusicSelector={handleOpenMusicTab} />

      {/* Subtle falling flower petals */}
      <FallingPetals />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#2C2723] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-medium border border-amber-300/40 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Mode Switcher & Edit Control on Top Right */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {/* View Mode Toggle Button */}
        <button
          onClick={handleToggleViewMode}
          title={
            isGuestViewMode
              ? 'Đang ở Chế độ xem khách mời (Bấm để bật lại Chế độ Quản trị & Sửa)'
              : 'Bấm để chuyển sang Chế độ xem (Ẩn toàn bộ nút sửa để xem sạch sẽ)'
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-md text-xs font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer ${
            isGuestViewMode
              ? 'bg-[#2C2723]/90 text-amber-200 border-amber-300/40 hover:bg-[#2C2723]'
              : 'bg-white/95 text-[#6A5E54] hover:text-[#963535] border-[#D5C2AB]'
          }`}
        >
          {isGuestViewMode ? (
            <>
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Chế độ xem</span>
              <span className="text-[10px] text-amber-200/70 hidden sm:inline">(Mở sửa)</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-[#963535]" />
              <span className="hidden sm:inline">Chế độ xem</span>
            </>
          )}
        </button>

        {/* Quick floating Edit button (Hidden in Guest View Mode) */}
        {!isGuestViewMode && (
          <button
            onClick={handleOpenGeneralEditor}
            title="Chỉnh sửa thông tin thiệp & Thay ảnh"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#6A5E54] hover:text-[#963535] border border-[#D5C2AB] shadow-md text-xs font-medium backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#963535]" />
            <span className="hidden sm:inline">Chỉnh sửa thiệp</span>
          </button>
        )}
      </div>

      {/* Hero Section */}
      <HeroSection
        data={data}
        onNavigateRsvp={() => scrollToSection('rsvp-section')}
        onNavigateWishes={() => scrollToSection('wishes-section')}
      />

      {/* Invitation Letter & Families */}
      <InvitationLetter data={data} />

      {/* Countdown Timer */}
      <CountdownSection targetDate={data.weddingDate} />

      {/* Events Schedule & Google Maps */}
      <EventsSection events={data.events} />

      {/* Photo Gallery & Lightbox */}
      <GallerySection
        photos={data.gallery}
        onUploadCustomPhoto={handleUploadCustomPhoto}
        isGuestViewMode={isGuestViewMode}
      />

      {/* Love Story Timeline */}
      <LoveStorySection stories={data.loveStory} />

      {/* RSVP Confirmation */}
      <RsvpSection onAddRsvp={handleAddRsvp} />

      {/* Wishing Book / Guestbook */}
      <WishesSection wishes={wishes} onAddWish={handleAddWish} />

      {/* Banking QR Gifts */}
      <BankingGiftSection data={data} />

      {/* Footer */}
      <FooterSection
        groomShortName={data.groom.shortName}
        brideShortName={data.bride.shortName}
        weddingDate={data.weddingDateFormatted}
        onOpenEditor={handleOpenGeneralEditor}
        isGuestViewMode={isGuestViewMode}
      />

      {/* Admin / Content Editor Modal */}
      {isEditorOpen && (
        <AdminEditorModal
          data={data}
          rsvps={rsvps}
          initialTab={editorInitialTab}
          onSave={handleSaveData}
          onPreview={handlePreviewData}
          onReset={handleResetData}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}
