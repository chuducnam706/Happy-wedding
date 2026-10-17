export interface WeddingEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  lunarDate: string;
  time: string;
  locationName: string;
  address: string;
  mapUrl: string;
  type: 'an-hoi' | 'vu-quy' | 'thanh-hon' | 'tiec-cuoi';
}

export interface LoveStoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  tag?: string;
}

export interface WishItem {
  id: string;
  senderName: string;
  relationship: string;
  message: string;
  createdAt: string;
}

export interface RSVPItem {
  id: string;
  name: string;
  phone: string;
  attending: 'yes' | 'no';
  event: string;
  guestCount: number;
  message: string;
  createdAt: string;
}

export interface BankAccount {
  bankName: string;
  bankCode: string; // e.g. MB, VCB, TCB
  accountNumber: string;
  accountName: string;
  qrUrl?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url?: string;
  youtubeId?: string;
  type: 'synth' | 'youtube' | 'audio-url' | 'file';
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export const PRESET_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'canon-d',
    title: 'Canon in D (Hòa tấu lãng mạn)',
    artist: 'Johann Pachelbel',
    type: 'synth',
  },
  {
    id: 'beautiful-in-white',
    title: 'Beautiful In White (Piano & Cello)',
    artist: 'Shane Filan',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c976f62b2e.mp3?filename=romantic-wedding-piano-112191.mp3',
    type: 'audio-url',
  },
  {
    id: 'until-i-found-you',
    title: 'Until I Found You (Acoustic Wedding)',
    artist: 'Stephen Sanchez',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=wedding-love-story-10492.mp3',
    type: 'audio-url',
  },
  {
    id: 'ngay-dau-tien',
    title: 'Ngày Đầu Tiên / Ánh Nắng Của Anh (Wedding Piano)',
    artist: 'Acoustic Wedding Melody',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_24911d61c6.mp3?filename=gentle-wedding-acoustic-124438.mp3',
    type: 'audio-url',
  },
  {
    id: 'a-thousand-years',
    title: 'A Thousand Years (Sweet Harp & Strings)',
    artist: 'Christina Perri',
    url: 'https://cdn.pixabay.com/download/audio/2023/02/12/audio_16503bce3f.mp3?filename=romantic-harp-melody-138381.mp3',
    type: 'audio-url',
  },
];

export interface WeddingConfig {
  groom: {
    fullName: string;
    shortName: string;
    fatherName: string;
    motherName: string;
    address: string;
    avatar: string;
    phone: string;
    bank: BankAccount;
  };
  bride: {
    fullName: string;
    shortName: string;
    fatherName: string;
    motherName: string;
    address: string;
    avatar: string;
    phone: string;
    bank: BankAccount;
  };
  weddingDate: string; // ISO string: '2026-10-25T11:00:00'
  weddingDateFormatted: string;
  lunarDateFormatted: string;
  invitationMessage: string;
  welcomeMessage: string;
  coverImage: string;
  events: WeddingEvent[];
  loveStory: LoveStoryItem[];
  gallery: GalleryPhoto[];
  musicTrack: MusicTrack;
}

export const INITIAL_WEDDING_DATA: WeddingConfig = {
  musicTrack: PRESET_MUSIC_TRACKS[0],
  groom: {
    fullName: 'Nguyễn Quốc Huy',
    shortName: 'Quốc Huy',
    fatherName: 'Nguyễn Văn Hùng',
    motherName: 'Trần Thị Mai',
    address: 'Xã Đông Anh, TP. Hà Nội',
    avatar: '/src/assets/images/gallery_couple_walk_1792145100890.jpg',
    phone: '0988 123 456',
    bank: {
      bankName: 'Ngân hàng Quân Đội (MB Bank)',
      bankCode: 'MB',
      accountNumber: '9999888868',
      accountName: 'NGUYEN QUOC HUY',
    },
  },
  bride: {
    fullName: 'Trần Ngọc Lan',
    shortName: 'Ngọc Lan',
    fatherName: 'Trần Đình Trọng',
    motherName: 'Lê Thị Thu',
    address: 'Thị xã Sơn Tây, TP. Hà Nội',
    avatar: '/src/assets/images/gallery_couple_close_1792145116906.jpg',
    phone: '0977 654 321',
    bank: {
      bankName: 'Ngân hàng Vietcombank (VCB)',
      bankCode: 'VCB',
      accountNumber: '1012345678',
      accountName: 'TRAN NGOC LAN',
    },
  },
  weddingDate: '2026-10-25T11:00:00',
  weddingDateFormatted: 'Chủ Nhật | 25 Tháng 10, 2026',
  lunarDateFormatted: 'Ngày 16 tháng 09 năm Bính Ngọ',
  welcomeMessage: 'Tình yêu không phải là tìm kiếm một người hoàn hảo, mà là học cách nhìn thấy những điều tuyệt vời từ một người không hoàn hảo.',
  invitationMessage: 'Trân trọng kính mời quý khách tới tham dự Lễ Thành Hôn & Tiệc Mừng chung vui cùng gia đình chúng tôi.',
  coverImage: '/src/assets/images/hero_cover_wedding_1792145038991.jpg',
  events: [
    {
      id: 'event-1',
      title: 'LỄ ĂN HỎI',
      subtitle: 'Nghi lễ truyền thống tại tư gia Nhà Gái',
      date: 'Chủ Nhật, 25.10.2026',
      lunarDate: '16.09 Bính Ngọ (ÂL)',
      time: '08:30 Sáng',
      locationName: 'Tư gia Nhà Gái',
      address: 'Số 18 Đường Hoa Hồng, Phường Phú Thịnh, Thị xã Sơn Tây, Hà Nội',
      mapUrl: 'https://maps.google.com/?q=Son+Tay+Ha+Noi',
      type: 'an-hoi',
    },
    {
      id: 'event-2',
      title: 'LỄ VU QUY',
      subtitle: 'Nghi thức xuất giá tại Nhà Gái',
      date: 'Chủ Nhật, 25.10.2026',
      lunarDate: '16.09 Bính Ngọ (ÂL)',
      time: '09:30 Sáng',
      locationName: 'Tư gia Nhà Gái',
      address: 'Số 18 Đường Hoa Hồng, Phường Phú Thịnh, Thị xã Sơn Tây, Hà Nội',
      mapUrl: 'https://maps.google.com/?q=Son+Tay+Ha+Noi',
      type: 'vu-quy',
    },
    {
      id: 'event-3',
      title: 'LỄ THÀNH HÔN',
      subtitle: 'Nghi thức đón dâu & rước dâu tại Nhà Trai',
      date: 'Chủ Nhật, 25.10.2026',
      lunarDate: '16.09 Bính Ngọ (ÂL)',
      time: '10:30 Sáng',
      locationName: 'Tư gia Nhà Trai',
      address: 'Thôn Cổ Loa, Xã Cổ Loa, Huyện Đông Anh, TP. Hà Nội',
      mapUrl: 'https://maps.google.com/?q=Dong+Anh+Ha+Noi',
      type: 'thanh-hon',
    },
    {
      id: 'event-4',
      title: 'TIỆC MỪNG TRỌNG ĐẠI',
      subtitle: 'Chung vui tiệc cưới cùng hai bên gia đình',
      date: 'Chủ Nhật, 25.10.2026',
      lunarDate: '16.09 Bính Ngọ (ÂL)',
      time: '11:30 Trưa',
      locationName: 'Trung Tâm Tiệc Cưới Trống Đồng Palace',
      address: 'Số 65 Quán Sứ, Hoàn Kiếm, TP. Hà Nội',
      mapUrl: 'https://maps.google.com/?q=Trong+Dong+Palace+Ha+Noi',
      type: 'tiec-cuoi',
    },
  ],
  loveStory: [
    {
      id: 'story-1',
      year: '2022',
      title: 'Ngày đầu tiên gặp gỡ',
      description: 'Lần đầu tiên gặp nhau tại một quán cà phê nhỏ giữa lòng Hà Nội vào một chiều thu dịu dàng. Ánh mắt đầu tiên đã khiến cả hai nhận ra sự gắn kết kỳ lạ.',
      image: '/src/assets/images/gallery_couple_walk_1792145100890.jpg',
    },
    {
      id: 'story-2',
      year: '2023',
      title: 'Chuyến đi xa đầu tiên',
      description: 'Cùng nhau ngắm bình minh trên đỉnh núi mờ sương, cùng chia sẻ từng câu chuyện cuộc sống và nhận ra đối phương là mảnh ghép hoàn hảo nhất.',
      image: '/src/assets/images/couple_landscape_garden_1792145133607.jpg',
    },
    {
      id: 'story-3',
      year: '2025',
      title: 'Khoảnh khắc "Em đồng ý"',
      description: 'Dưới bầu trời đêm ngập tràn ánh đèn và tiếng sóng biển, chiếc nhẫn được trao cùng lời hẹn ước đi cùng nhau suốt trọn cuộc đời.',
      image: '/src/assets/images/gallery_couple_close_1792145116906.jpg',
    },
    {
      id: 'story-4',
      year: '2026',
      title: 'Ngày về chung một nhà',
      description: 'Khép lại chặng đường hẹn hò để mở ra hành trình hôn nhân đong đầy hạnh phúc, yêu thương và trách nhiệm.',
      image: '/src/assets/images/hero_cover_wedding_1792145038991.jpg',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      url: '/src/assets/images/hero_cover_wedding_1792145038991.jpg',
      title: 'Nét đẹp truyền thống',
      description: 'Lễ ăn hỏi trong trang phục áo dài truyền thống Việt Nam',
      tag: 'Truyền thống',
    },
    {
      id: 'gal-2',
      url: '/src/assets/images/gallery_couple_walk_1792145100890.jpg',
      title: 'Dạo bước con đường hoa',
      description: 'Tay trong tay dạo bước dưới giàn hoa giấy rực rỡ',
      tag: 'Lãng mạn',
    },
    {
      id: 'gal-3',
      url: '/src/assets/images/gallery_couple_close_1792145116906.jpg',
      title: 'Nụ cười hạnh phúc',
      description: 'Khoảnh khắc ấm áp và ánh nhìn tràn đầy yêu thương',
      tag: 'Cảm xúc',
    },
    {
      id: 'gal-4',
      url: '/src/assets/images/couple_landscape_garden_1792145133607.jpg',
      title: 'Bình minh ước hẹn',
      description: 'Nụ cười rạng rỡ hướng về tương lai ngập tràn hy vọng',
      tag: 'Hoàng hôn',
    },
    {
      id: 'gal-5',
      url: '/src/assets/images/couple_rustic_porch_1792145062115.jpg',
      title: 'Mộc mạc & Bình yên',
      description: 'Góc hiên nhà thân thương lưu giữ bao kỉ niệm',
      tag: 'Kỷ niệm',
    },
  ],
};

export const INITIAL_WISHES: WishItem[] = [
  {
    id: 'w-1',
    senderName: 'Bác Thành & Gia đình',
    relationship: 'Họ hàng nhà trai',
    message: 'Chúc hai cháu Quốc Huy và Ngọc Lan trăm năm hạnh phúc, đầu bạc răng long, con đàn cháu đống!',
    createdAt: 'Vừa xong',
  },
  {
    id: 'w-2',
    senderName: 'Hội bạn thân Đại học',
    relationship: 'Bạn chú rể',
    message: 'Chúc mừng anh bạn thân chính thức rời hội độc thân! Chúc đôi bạn trẻ luôn yêu thương, nhường nhịn và đồng lòng cùng nhau nhé!',
    createdAt: '15 phút trước',
  },
  {
    id: 'w-3',
    senderName: 'Chị Mai Linh',
    relationship: 'Đồng nghiệp cô dâu',
    message: 'Cô dâu của chị hôm nay đẹp rạng ngời! Chúc hai em có một tổ ấm ngập tràn tiếng cười và tài lộc dồi dào!',
    createdAt: '1 giờ trước',
  },
  {
    id: 'w-4',
    senderName: 'Vợ chồng em Tuấn Anh',
    relationship: 'Em họ',
    message: 'Chúc mừng anh chị Huy - Lan! Ngày vui trọn vẹn và một chặng đường mới ngập tràn hạnh phúc viên mãn!',
    createdAt: 'Hôm qua',
  },
];
