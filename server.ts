import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const portArgIndex = process.argv.indexOf('--port');
const portFromArg = portArgIndex !== -1 ? Number(process.argv[portArgIndex + 1]) : null;
const PORT = portFromArg || Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// File-based persistent store
const DATA_DIR = path.resolve(__dirname, 'data_store');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');
const RSVPS_FILE = path.join(DATA_DIR, 'rsvps.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

function readJsonFile<T>(filePath: string, defaultVal: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultVal;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initial starter wishes if file is empty
const defaultWishes = [
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
];

// --- API ROUTES ---

// 1. Wishes API
app.get('/api/wishes', (req, res) => {
  const wishes = readJsonFile(WISHES_FILE, defaultWishes);
  res.json({ wishes });
});

app.post('/api/wishes', (req, res) => {
  const { senderName, relationship, message } = req.body;
  if (!senderName || !message) {
    return res.status(400).json({ error: 'Thiếu thông tin người gửi hoặc lời chúc' });
  }

  const wishes = readJsonFile(WISHES_FILE, defaultWishes);
  const newWish = {
    id: `w-${Date.now()}`,
    senderName: senderName.trim(),
    relationship: relationship || 'Bạn bè',
    message: message.trim(),
    createdAt: 'Vừa xong',
  };

  const updated = [newWish, ...wishes];
  writeJsonFile(WISHES_FILE, updated);
  res.status(201).json({ success: true, newWish, wishes: updated });
});

// 2. RSVP API
app.get('/api/rsvps', (req, res) => {
  const rsvps = readJsonFile(RSVPS_FILE, []);
  res.json({ rsvps });
});

app.post('/api/rsvps', (req, res) => {
  const { name, phone, attending, event, guestCount, message } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Thiếu tên khách mời' });
  }

  const rsvps = readJsonFile(RSVPS_FILE, []);
  const newRsvp = {
    id: `r-${Date.now()}`,
    name,
    phone: phone || '',
    attending: attending || 'yes',
    event: event || 'Tiệc mừng trọng đại',
    guestCount: guestCount || 1,
    message: message || '',
    createdAt: new Date().toLocaleString('vi-VN'),
  };

  const updated = [newRsvp, ...rsvps];
  writeJsonFile(RSVPS_FILE, updated);
  res.status(201).json({ success: true, newRsvp, rsvps: updated });
});

// 3. Wedding Config API (Realtime sync for edits)
app.get('/api/config', (req, res) => {
  const config = readJsonFile(CONFIG_FILE, null);
  res.json({ config });
});

app.post('/api/config', (req, res) => {
  const config = req.body;
  if (config) {
    writeJsonFile(CONFIG_FILE, config);
    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Invalid config' });
});

// Mount Vite or static assets
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wedding server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
