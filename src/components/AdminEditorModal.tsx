import React, { useState } from 'react';
import {
  X,
  Save,
  Upload,
  RotateCcw,
  Users,
  Settings2,
  Check,
  Music,
  Play,
  Pause,
  Disc3,
  Link as LinkIcon,
  FileAudio,
  Eye,
  Smartphone,
  Monitor,
  ExternalLink,
  MapPin,
  Sparkles
} from 'lucide-react';
import { WeddingConfig, RSVPItem, MusicTrack, extractYouTubeId } from '../data/weddingData';
import { compressImage } from '../utils/imageCompressor';
import { weddingAudio } from '../utils/audioPlayer';
import { HeroSection } from './HeroSection';
import { InvitationLetter } from './InvitationLetter';
import { CountdownSection } from './CountdownSection';
import { EventsSection } from './EventsSection';
import { GallerySection } from './GallerySection';
import { BankingGiftSection } from './BankingGiftSection';

interface AdminEditorModalProps {
  data: WeddingConfig;
  rsvps: RSVPItem[];
  initialTab?: 'info' | 'images' | 'events' | 'music' | 'bank' | 'rsvps' | 'preview';
  onSave: (newData: WeddingConfig) => void;
  onPreview?: (newData: WeddingConfig) => void;
  onReset: () => void;
  onClose: () => void;
}

export const AdminEditorModal: React.FC<AdminEditorModalProps> = ({
  data,
  rsvps,
  initialTab = 'info',
  onSave,
  onPreview,
  onReset,
  onClose,
}) => {
  const [formData, setFormData] = useState<WeddingConfig>(() => JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'events' | 'music' | 'bank' | 'rsvps' | 'preview'>(initialTab);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'full'>('mobile');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'coverImage' | 'groomAvatar' | 'brideAvatar' | 'groomQr' | 'brideQr' | { galleryIndex: number }
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsProcessingImage(true);
      try {
        const compressedBase64 = await compressImage(file, 1200, 1200, 0.82);
        if (target === 'coverImage') {
          setFormData((prev) => ({ ...prev, coverImage: compressedBase64 }));
        } else if (target === 'groomAvatar') {
          setFormData((prev) => ({
            ...prev,
            groom: { ...prev.groom, avatar: compressedBase64 },
          }));
        } else if (target === 'brideAvatar') {
          setFormData((prev) => ({
            ...prev,
            bride: { ...prev.bride, avatar: compressedBase64 },
          }));
        } else if (target === 'groomQr') {
          setFormData((prev) => ({
            ...prev,
            groom: { ...prev.groom, bank: { ...prev.groom.bank, qrUrl: compressedBase64 } },
          }));
        } else if (target === 'brideQr') {
          setFormData((prev) => ({
            ...prev,
            bride: { ...prev.bride, bank: { ...prev.bride.bank, qrUrl: compressedBase64 } },
          }));
        } else if (typeof target === 'object' && 'galleryIndex' in target) {
          setFormData((prev) => {
            const newGallery = [...prev.gallery];
            if (newGallery[target.galleryIndex]) {
              newGallery[target.galleryIndex] = {
                ...newGallery[target.galleryIndex],
                url: compressedBase64,
              };
            }
            return { ...prev, gallery: newGallery };
          });
        }
      } catch (err) {
        console.error('Lỗi nén ảnh:', err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const audioUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const newTrack: MusicTrack = {
        id: `upload-${Date.now()}`,
        title: cleanName,
        artist: 'Nhạc tải từ thiết bị của bạn',
        url: audioUrl,
        type: 'file',
      };
      setFormData((prev) => ({ ...prev, musicTrack: newTrack }));
      weddingAudio.setTrack(newTrack, true);
      setPreviewTrackId(newTrack.id);
    }
  };

  const [youtubeInput, setYoutubeInput] = useState(
    formData.musicTrack?.type === 'youtube' && formData.musicTrack.url
      ? formData.musicTrack.url
      : formData.musicTrack?.youtubeId
      ? `https://www.youtube.com/watch?v=${formData.musicTrack.youtubeId}`
      : 'https://www.youtube.com/watch?v=kYJqRkX57gI'
  );

  const handleApplyYouTubeUrl = () => {
    const url = youtubeInput.trim();
    const vid = extractYouTubeId(url);
    if (!vid) {
      alert('Vui lòng nhập đường link YouTube hợp lệ (ví dụ: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...)');
      return;
    }
    const newTrack: MusicTrack = {
      id: `yt-${vid}`,
      title: 'Nhạc nền cưới (YouTube)',
      artist: 'YouTube Video',
      url: url,
      youtubeId: vid,
      type: 'youtube',
    };
    setFormData((prev) => ({ ...prev, musicTrack: newTrack }));
    weddingAudio.setTrack(newTrack, true);
  };

  const handleSelectDefaultSynth = () => {
    const synthTrack: MusicTrack = {
      id: 'canon-d-synth',
      title: 'Canon in D (Hòa tấu lãng mạn)',
      artist: 'Johann Pachelbel',
      type: 'synth',
    };
    setFormData((prev) => ({ ...prev, musicTrack: synthTrack }));
    weddingAudio.setTrack(synthTrack, true);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    const newTrack: MusicTrack = {
      id: `url-${Date.now()}`,
      title: 'Nhạc tùy chỉnh (Liên kết MP3)',
      artist: 'Người dùng chỉ định',
      url: customUrlInput.trim(),
      type: 'audio-url',
    };
    setFormData((prev) => ({ ...prev, musicTrack: newTrack }));
    weddingAudio.setTrack(newTrack, true);
    setPreviewTrackId(newTrack.id);
  };

  const handleSave = () => {
    if (formData.musicTrack) {
      weddingAudio.setTrack(formData.musicTrack, true);
    }
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`relative w-full ${activeTab === 'preview' ? 'max-w-4xl' : 'max-w-2xl'} bg-white rounded-2xl shadow-2xl border border-[#D5C2AB] overflow-hidden my-6 transition-all duration-300`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF7F2] border-b border-[#D5C2AB]">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-[#963535]" />
            <h3 className="font-serif-title font-semibold text-lg text-[#2C2723]">
              Bảng Chỉnh Sửa Thiệp Cưới
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'preview') {
                  setActiveTab('info');
                } else {
                  setActiveTab('preview');
                  onPreview?.(formData);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-amber-100 text-[#963535] border border-[#963535]'
                  : 'bg-[#963535] text-white hover:bg-[#7D2929] shadow-xs'
              }`}
              title={activeTab === 'preview' ? 'Quay lại bảng chỉnh sửa' : 'Xem trước toàn bộ thay đổi trực tiếp'}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{activeTab === 'preview' ? 'Quay lại sửa' : 'Xem trước'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 text-xs sm:text-sm font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'border-[#963535] text-[#963535] font-semibold'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Cô dâu &amp; Chú rể
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'images'
                ? 'border-[#963535] text-[#963535] font-semibold'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Thay đổi hình ảnh
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'music'
                ? 'border-[#963535] text-[#963535] font-semibold'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Nhạc nền cưới</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'events'
                ? 'border-[#963535] text-[#963535] font-semibold'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Ngày giờ &amp; Bản đồ
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bank'
                ? 'border-[#963535] text-[#963535] font-semibold'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Ngân hàng VietQR
          </button>
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rsvps'
                ? 'border-[#963535] text-[#963535] font-semibold'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Khách RSVP ({rsvps.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('preview');
              onPreview?.(formData);
            }}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'border-[#963535] text-[#963535] font-bold bg-amber-50/60'
                : 'border-transparent text-[#963535] hover:text-[#7D2929]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Xem trước (Preview)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto text-sm space-y-4">
          {/* TAB: MUSIC */}
          {activeTab === 'music' && (
            <div className="space-y-5 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[#8C6D58] flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-[#963535] shrink-0" />
                <span>
                  Bài hát đang chọn:{' '}
                  <strong className="text-[#963535]">
                    {formData.musicTrack?.title || 'Canon in D'}
                  </strong>
                </span>
              </div>

              {/* 1. YouTube Link Input */}
              <div className="p-4 bg-white rounded-xl border border-red-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                    ▶
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2C2723] text-sm">
                      Dán link nhạc từ YouTube (Khuyên dùng)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Hỗ trợ link video hoặc shorts trên YouTube (tự động phát lặp lại trong nền)
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="url"
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=kYJqRkX57gI"
                    className="flex-1 p-2.5 border border-gray-300 rounded-xl bg-gray-50/50 text-xs outline-none focus:border-red-600 focus:bg-white text-[#2C2723]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyYouTubeUrl}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors shrink-0"
                  >
                    Áp dụng &amp; Nghe thử
                  </button>
                </div>

                {/* Quick suggestions */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[11px] text-gray-500 font-medium block mb-1.5">
                    Gợi ý bài hát cưới YouTube phổ biến:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        title: 'Ánh Nắng Của Anh (Piano)',
                        url: 'https://www.youtube.com/watch?v=kYJqRkX57gI',
                      },
                      {
                        title: 'Until I Found You',
                        url: 'https://www.youtube.com/watch?v=GxldQ9GyXwo',
                      },
                      {
                        title: 'Beautiful In White',
                        url: 'https://www.youtube.com/watch?v=XRNyM1W0dTE',
                      },
                      {
                        title: 'A Thousand Years',
                        url: 'https://www.youtube.com/watch?v=rtOvBOTyX00',
                      },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setYoutubeInput(item.url);
                          const vid = extractYouTubeId(item.url);
                          if (vid) {
                            const newTrack: MusicTrack = {
                              id: `yt-${vid}`,
                              title: `${item.title} (YouTube)`,
                              artist: 'YouTube Audio',
                              url: item.url,
                              youtubeId: vid,
                              type: 'youtube',
                            };
                            setFormData((prev) => ({ ...prev, musicTrack: newTrack }));
                            weddingAudio.setTrack(newTrack, true);
                          }
                        }}
                        className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 text-[11px] text-gray-600 transition-colors cursor-pointer"
                      >
                        🎵 {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Upload custom file */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <h4 className="font-semibold text-[#2C2723] text-sm">
                  Tải bài hát từ thiết bị của bạn (.mp3, .wav, .m4a)
                </h4>
                <p className="text-gray-500 text-[11px]">
                  Chọn file bài hát yêu thích đã lưu sẵn trên điện thoại hoặc máy tính:
                </p>
                <div className="pt-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-[#963535] border border-[#D5C2AB] font-semibold text-xs cursor-pointer transition-all shadow-xs">
                    <FileAudio className="w-4 h-4" />
                    <span>Chọn file nhạc từ máy</span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a"
                      className="hidden"
                      onChange={handleAudioFileUpload}
                    />
                  </label>
                </div>
              </div>

              {/* 3. Direct MP3 URL or Default Synth */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#2C2723] text-sm">
                    Tùy chọn khác
                  </h4>
                  <button
                    type="button"
                    onClick={handleSelectDefaultSynth}
                    className="text-xs text-[#963535] hover:underline font-medium cursor-pointer"
                  >
                    Dùng bản hòa tấu Canon in D mộc
                  </button>
                </div>

                <div>
                  <label className="block text-gray-600 text-[11px] mb-1">
                    Dán đường link file nhạc trực tiếp (.mp3 URL):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://example.com/bai-hat-cuoi.mp3"
                      className="flex-1 p-2 border rounded-lg bg-white text-xs outline-none focus:border-[#963535]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-4 py-2 bg-[#963535] hover:bg-[#7D2929] text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Groom */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-[#963535] mb-3">Thông Tin Chú Rể</h4>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-gray-600 mb-1">Họ tên đầy đủ:</label>
                      <input
                        type="text"
                        value={formData.groom.fullName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, fullName: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Tên ngắn hiển thị trên bìa:</label>
                      <input
                        type="text"
                        value={formData.groom.shortName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, shortName: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Thân phụ:</label>
                      <input
                        type="text"
                        value={formData.groom.fatherName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, fatherName: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Thân mẫu:</label>
                      <input
                        type="text"
                        value={formData.groom.motherName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, motherName: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Số điện thoại:</label>
                      <input
                        type="text"
                        value={formData.groom.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            groom: { ...prev.groom, phone: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bride */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-[#963535] mb-3">Thông Tin Cô Dâu</h4>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-gray-600 mb-1">Họ tên đầy đủ:</label>
                      <input
                        type="text"
                        value={formData.bride.fullName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, fullName: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Tên ngắn hiển thị trên bìa:</label>
                      <input
                        type="text"
                        value={formData.bride.shortName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, shortName: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Thân phụ:</label>
                      <input
                        type="text"
                        value={formData.bride.fatherName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, fatherName: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Thân mẫu:</label>
                      <input
                        type="text"
                        value={formData.bride.motherName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, motherName: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Số điện thoại:</label>
                      <input
                        type="text"
                        value={formData.bride.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bride: { ...prev.bride, phone: e.target.value },
                          }))
                        }
                        className="w-full p-2 border rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-3">
                <h4 className="font-semibold text-[#2C2723]">Lời mời &amp; Lời ngỏ</h4>
                <div>
                  <label className="block text-gray-600 mb-1">Lời ngỏ mở đầu:</label>
                  <textarea
                    rows={2}
                    value={formData.welcomeMessage}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, welcomeMessage: e.target.value }))
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-5 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[#8C6D58]">
                💡 Bấm <strong>"Chọn ảnh từ máy"</strong> để thay thế ảnh từ máy tính hoặc điện thoại của bạn. Ảnh sẽ tự động tối ưu hóa và hiển thị ngay trên thiệp!
              </div>

              {/* Cover Photo */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-16 h-20 object-cover rounded-lg border shadow-xs"
                  />
                  <div>
                    <h5 className="font-semibold text-[#2C2723] text-sm">Ảnh Bìa Thiệp Cưới (Hero)</h5>
                    <p className="text-gray-500">Khung ảnh lớn ở đầu trang thiệp cưới</p>
                  </div>
                </div>
                <label className="px-3.5 py-2 rounded-lg bg-[#963535] text-white font-medium cursor-pointer hover:bg-[#7D2929] flex items-center gap-1.5 shrink-0 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn ảnh từ máy</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'coverImage')}
                  />
                </label>
              </div>

              {/* Groom Avatar */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.groom.avatar}
                    alt="Groom avatar"
                    className="w-14 h-14 rounded-full object-cover border shadow-xs"
                  />
                  <div>
                    <h5 className="font-semibold text-[#2C2723] text-sm">Ảnh Chân Dung Chú Rể</h5>
                    <p className="text-gray-500">Hiển thị tại phần giới thiệu Nhà Trai</p>
                  </div>
                </div>
                <label className="px-3.5 py-2 rounded-lg bg-[#963535] text-white font-medium cursor-pointer hover:bg-[#7D2929] flex items-center gap-1.5 shrink-0 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn ảnh từ máy</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'groomAvatar')}
                  />
                </label>
              </div>

              {/* Bride Avatar */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.bride.avatar}
                    alt="Bride avatar"
                    className="w-14 h-14 rounded-full object-cover border shadow-xs"
                  />
                  <div>
                    <h5 className="font-semibold text-[#2C2723] text-sm">Ảnh Chân Dung Cô Dâu</h5>
                    <p className="text-gray-500">Hiển thị tại phần giới thiệu Nhà Gái</p>
                  </div>
                </div>
                <label className="px-3.5 py-2 rounded-lg bg-[#963535] text-white font-medium cursor-pointer hover:bg-[#7D2929] flex items-center gap-1.5 shrink-0 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn ảnh từ máy</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'brideAvatar')}
                  />
                </label>
              </div>

              {/* Album Photos Replacement */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <h5 className="font-semibold text-[#2C2723] text-sm">Thay đổi các ảnh trong Album Cưới</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.gallery.map((photo, idx) => (
                    <div key={photo.id} className="p-2.5 bg-white rounded-lg border flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img src={photo.url} alt={photo.title} className="w-12 h-14 object-cover rounded border shrink-0" />
                        <span className="text-xs truncate font-medium">{photo.title || `Ảnh ${idx + 1}`}</span>
                      </div>
                      <label className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-[#963535] hover:text-white text-gray-700 text-xs font-medium cursor-pointer transition-colors shrink-0">
                        Đổi ảnh
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, { galleryIndex: idx })}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EVENTS & DATES */}
          {activeTab === 'events' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <h4 className="font-semibold text-[#963535]">Ngày tổ chức hôn lễ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">Ngày hiển thị trên bìa (Dương lịch):</label>
                    <input
                      type="text"
                      value={formData.weddingDateFormatted}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          weddingDateFormatted: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Ngày hiển thị (Âm lịch):</label>
                    <input
                      type="text"
                      value={formData.lunarDateFormatted}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lunarDateFormatted: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Event items */}
              {formData.events.map((event, idx) => (
                <div key={event.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-semibold text-[#2C2723]">Sự kiện {idx + 1}: {event.title}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-500 text-[11px]">Giờ:</label>
                      <input
                        type="text"
                        value={event.time}
                        onChange={(e) => {
                          const newEvents = [...formData.events];
                          newEvents[idx].time = e.target.value;
                          setFormData((prev) => ({ ...prev, events: newEvents }));
                        }}
                        className="w-full p-1.5 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[11px]">Địa điểm:</label>
                      <input
                        type="text"
                        value={event.locationName}
                        onChange={(e) => {
                          const newEvents = [...formData.events];
                          newEvents[idx].locationName = e.target.value;
                          setFormData((prev) => ({ ...prev, events: newEvents }));
                        }}
                        className="w-full p-1.5 border rounded bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-gray-500 text-[11px]">Địa chỉ chi tiết:</label>
                      <input
                        type="text"
                        value={event.address}
                        placeholder="Ví dụ: Số 18 Đường Hoa Hồng, Phường Phú Thịnh, Thị xã Sơn Tây, Hà Nội"
                        onChange={(e) => {
                          const newEvents = [...formData.events];
                          newEvents[idx].address = e.target.value;
                          setFormData((prev) => ({ ...prev, events: newEvents }));
                        }}
                        className="w-full p-1.5 border rounded bg-white text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1 pt-1 border-t border-gray-200/60 mt-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-gray-600 text-[11px] font-semibold">
                          Link Google Maps chỉ đường:
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const autoUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${event.locationName} ${event.address}`.trim()
                              )}`;
                              const newEvents = [...formData.events];
                              newEvents[idx].mapUrl = autoUrl;
                              setFormData((prev) => ({ ...prev, events: newEvents }));
                            }}
                            className="text-[10px] text-[#963535] hover:underline font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Tự tạo link Maps từ địa chỉ</span>
                          </button>

                          {event.mapUrl && (
                            <a
                              href={event.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                            >
                              <span>Mở thử link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <input
                        type="url"
                        value={event.mapUrl || ''}
                        placeholder="https://maps.google.com/... hoặc link Google Maps chia sẻ từ app"
                        onChange={(e) => {
                          const newEvents = [...formData.events];
                          newEvents[idx].mapUrl = e.target.value;
                          setFormData((prev) => ({ ...prev, events: newEvents }));
                        }}
                        className="w-full p-1.5 border rounded bg-white text-xs text-gray-800 font-mono"
                      />
                      <p className="text-[10px] text-gray-400">
                        * Bạn có thể dán link Google Maps chia sẻ từ điện thoại, hoặc bấm &ldquo;Tự tạo link Maps từ địa chỉ&rdquo; để tự động dẫn đường theo địa chỉ trên.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: BANK */}
          {activeTab === 'bank' && (
            <div className="space-y-4 text-xs">
              {/* Security info banner */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-xs text-emerald-900">
                  <span>🔒 An toàn &amp; Bảo mật 100%:</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  Mã QR chuyển tiền này là <strong>chuẩn VietQR công khai</strong> (giống như mã QR trên bàn ăn nhà hàng). Bạn <strong>CHỈ CẦN</strong> điền <em>Tên ngân hàng, Số tài khoản nhận tiền và Họ tên của bạn</em>. 
                  <strong className="text-red-700 block mt-0.5">⚠️ TUYỆT ĐỐI KHÔNG BAO GIỜ NHẬP MẬT KHẨU NGÂN HÀNG!</strong>
                </p>
              </div>

              {/* Groom Bank */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#963535] text-sm">Ngân hàng Chú Rể (Tạo mã QR)</h4>
                  <label className="text-[11px] text-[#963535] bg-white border border-[#D5C2AB] hover:bg-amber-50 px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Tải ảnh mã QR từ máy</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'groomQr')}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-gray-600 mb-1">Chọn nhanh ngân hàng:</label>
                    <select
                      value={formData.groom.bank.bankCode}
                      onChange={(e) => {
                        const bankMap: Record<string, string> = {
                          MB: 'Ngân hàng Quân Đội (MB Bank)',
                          VCB: 'Vietcombank',
                          TCB: 'Techcombank',
                          VPB: 'VPBank',
                          ACB: 'ACB (Á Châu)',
                          BIDV: 'BIDV',
                          ICB: 'VietinBank',
                          AGR: 'Agribank',
                          TPB: 'TPBank',
                          STB: 'Sacombank',
                          VIB: 'VIB',
                          OCB: 'OCB',
                        };
                        const code = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          groom: {
                            ...prev.groom,
                            bank: {
                              ...prev.groom.bank,
                              bankCode: code,
                              bankName: bankMap[code] || code,
                            },
                          },
                        }));
                      }}
                      className="w-full p-2 border rounded-lg bg-white"
                    >
                      <option value="MB">MB Bank (Quân Đội)</option>
                      <option value="VCB">Vietcombank</option>
                      <option value="TCB">Techcombank</option>
                      <option value="VPB">VPBank</option>
                      <option value="ACB">ACB (Á Châu)</option>
                      <option value="BIDV">BIDV</option>
                      <option value="ICB">VietinBank</option>
                      <option value="AGR">Agribank</option>
                      <option value="TPB">TPBank</option>
                      <option value="STB">Sacombank</option>
                      <option value="VIB">VIB</option>
                      <option value="OCB">OCB</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-gray-600 mb-1">Tên hiển thị ngân hàng:</label>
                    <input
                      type="text"
                      value={formData.groom.bank.bankName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          groom: {
                            ...prev.groom,
                            bank: { ...prev.groom.bank, bankName: e.target.value },
                          },
                        }))
                      }
                      className="w-full p-2 border rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Số tài khoản nhận tiền:</label>
                    <input
                      type="text"
                      value={formData.groom.bank.accountNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          groom: {
                            ...prev.groom,
                            bank: { ...prev.groom.bank, accountNumber: e.target.value },
                          },
                        }))
                      }
                      placeholder="Số tài khoản ngân hàng"
                      className="w-full p-2 border rounded-lg bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Tên chủ tài khoản (Không dấu):</label>
                    <input
                      type="text"
                      value={formData.groom.bank.accountName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          groom: {
                            ...prev.groom,
                            bank: { ...prev.groom.bank, accountName: e.target.value },
                          },
                        }))
                      }
                      placeholder="NGUYEN QUOC HUY"
                      className="w-full p-2 border rounded-lg bg-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Bride Bank */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#963535] text-sm">Ngân hàng Cô Dâu (Tạo mã QR)</h4>
                  <label className="text-[11px] text-[#963535] bg-white border border-[#D5C2AB] hover:bg-amber-50 px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Tải ảnh mã QR từ máy</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'brideQr')}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-gray-600 mb-1">Chọn nhanh ngân hàng:</label>
                    <select
                      value={formData.bride.bank.bankCode}
                      onChange={(e) => {
                        const bankMap: Record<string, string> = {
                          MB: 'Ngân hàng Quân Đội (MB Bank)',
                          VCB: 'Vietcombank',
                          TCB: 'Techcombank',
                          VPB: 'VPBank',
                          ACB: 'ACB (Á Châu)',
                          BIDV: 'BIDV',
                          ICB: 'VietinBank',
                          AGR: 'Agribank',
                          TPB: 'TPBank',
                          STB: 'Sacombank',
                          VIB: 'VIB',
                          OCB: 'OCB',
                        };
                        const code = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          bride: {
                            ...prev.bride,
                            bank: {
                              ...prev.bride.bank,
                              bankCode: code,
                              bankName: bankMap[code] || code,
                            },
                          },
                        }));
                      }}
                      className="w-full p-2 border rounded-lg bg-white"
                    >
                      <option value="VCB">Vietcombank</option>
                      <option value="MB">MB Bank (Quân Đội)</option>
                      <option value="TCB">Techcombank</option>
                      <option value="VPB">VPBank</option>
                      <option value="ACB">ACB (Á Châu)</option>
                      <option value="BIDV">BIDV</option>
                      <option value="ICB">VietinBank</option>
                      <option value="AGR">Agribank</option>
                      <option value="TPB">TPBank</option>
                      <option value="STB">Sacombank</option>
                      <option value="VIB">VIB</option>
                      <option value="OCB">OCB</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-gray-600 mb-1">Tên hiển thị ngân hàng:</label>
                    <input
                      type="text"
                      value={formData.bride.bank.bankName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bride: {
                            ...prev.bride,
                            bank: { ...prev.bride.bank, bankName: e.target.value },
                          },
                        }))
                      }
                      className="w-full p-2 border rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Số tài khoản nhận tiền:</label>
                    <input
                      type="text"
                      value={formData.bride.bank.accountNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bride: {
                            ...prev.bride,
                            bank: { ...prev.bride.bank, accountNumber: e.target.value },
                          },
                        }))
                      }
                      placeholder="Số tài khoản ngân hàng"
                      className="w-full p-2 border rounded-lg bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Tên chủ tài khoản (Không dấu):</label>
                    <input
                      type="text"
                      value={formData.bride.bank.accountName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bride: {
                            ...prev.bride,
                            bank: { ...prev.bride.bank, accountName: e.target.value },
                          },
                        }))
                      }
                      placeholder="TRAN NGOC LAN"
                      className="w-full p-2 border rounded-lg bg-white uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RSVPS */}
          {activeTab === 'rsvps' && (
            <div className="space-y-3">
              {rsvps.length === 0 ? (
                <p className="text-center py-8 text-gray-500 text-xs">
                  Chưa có khách mời nào gửi xác nhận tham dự.
                </p>
              ) : (
                rsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#2C2723]">
                      <span>{rsvp.name} ({rsvp.phone || 'Không để lại SĐT'})</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          rsvp.attending === 'yes'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {rsvp.attending === 'yes' ? `Tham dự (${rsvp.guestCount} người)` : 'Không tham dự'}
                      </span>
                    </div>
                    <p className="text-gray-600">Sự kiện: {rsvp.event}</p>
                    {rsvp.message && (
                      <p className="italic text-gray-500">&ldquo;{rsvp.message}&rdquo;</p>
                    )}
                    <span className="text-[10px] text-gray-400 block">{rsvp.createdAt}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Preview Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-[#FAF7F2] to-amber-50/70 border border-[#D5C2AB] rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#2C2723] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#963535]" />
                    <span>Xem trước trực tiếp:</span>
                  </span>
                  <div className="flex bg-white rounded-lg p-0.5 border border-[#D5C2AB]">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                        previewDevice === 'mobile'
                          ? 'bg-[#963535] text-white shadow-xs'
                          : 'text-[#6A5E54] hover:bg-gray-100'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Điện thoại</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('full')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                        previewDevice === 'full'
                          ? 'bg-[#963535] text-white shadow-xs'
                          : 'text-[#6A5E54] hover:bg-gray-100'
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      <span>Rộng (Desktop)</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        onPreview(formData);
                      }}
                      className="px-3 py-1 bg-white hover:bg-amber-100/50 text-[#963535] border border-[#D5C2AB] rounded-lg font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Cập nhật nhanh dữ liệu này ra website chính đang mở phía sau modal"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Áp dụng ra trang web</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-[11px] cursor-pointer"
                  >
                    Quay lại sửa
                  </button>
                </div>
              </div>

              {/* Preview Display Window */}
              <div className="bg-neutral-800 p-2 sm:p-5 rounded-2xl flex justify-center items-start overflow-hidden min-h-[480px]">
                {previewDevice === 'mobile' ? (
                  /* iPhone Mockup Frame */
                  <div className="w-[360px] max-w-full bg-[#FAF7F2] rounded-[36px] border-[8px] border-neutral-900 shadow-2xl overflow-hidden relative max-h-[560px] flex flex-col">
                    {/* Notch */}
                    <div className="h-4 bg-neutral-900 rounded-b-xl w-32 mx-auto flex items-center justify-center gap-1.5 shrink-0 z-30">
                      <div className="w-2 h-2 rounded-full bg-neutral-800" />
                      <div className="w-8 h-1 rounded-full bg-neutral-800" />
                    </div>

                    {/* Scrollable preview content */}
                    <div className="flex-1 overflow-y-auto pointer-events-auto text-left">
                      <HeroSection
                        data={formData}
                        onNavigateRsvp={() => {}}
                        onNavigateWishes={() => {}}
                      />
                      <InvitationLetter data={formData} />
                      <CountdownSection targetDate={formData.weddingDate} />
                      <EventsSection events={formData.events} />
                      <GallerySection
                        photos={formData.gallery}
                        onUploadCustomPhoto={() => {}}
                      />
                      <BankingGiftSection data={formData} />
                    </div>

                    {/* Bottom home bar indicator */}
                    <div className="h-2.5 bg-[#FAF7F2] flex items-center justify-center shrink-0 z-20">
                      <div className="w-24 h-1 bg-neutral-400 rounded-full" />
                    </div>
                  </div>
                ) : (
                  /* Full-width Desktop View Container */
                  <div className="w-full bg-[#FAF7F2] rounded-xl shadow-2xl overflow-y-auto max-h-[560px] text-left border border-neutral-700">
                    <HeroSection
                      data={formData}
                      onNavigateRsvp={() => {}}
                      onNavigateWishes={() => {}}
                    />
                    <InvitationLetter data={formData} />
                    <CountdownSection targetDate={formData.weddingDate} />
                    <EventsSection events={formData.events} />
                    <GallerySection
                      photos={formData.gallery}
                      onUploadCustomPhoto={() => {}}
                    />
                    <BankingGiftSection data={formData} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF7F2] border-t border-[#D5C2AB]">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'preview') {
                  setActiveTab('info');
                } else {
                  setActiveTab('preview');
                  onPreview?.(formData);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8C6D58] border border-amber-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#963535]" />
              <span>{activeTab === 'preview' ? 'Chỉnh sửa' : 'Xem trước'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessingImage}
              className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#963535] hover:bg-[#7D2929] text-white hover:scale-105'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã lưu thành công!</span>
                </>
              ) : isProcessingImage ? (
                <span>Đang xử lý ảnh...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
