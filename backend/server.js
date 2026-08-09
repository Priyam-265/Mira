const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

const ALLOWED_ORIGINS = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit: true,
  responseOnLimit: 'File too large. Max size is 10MB.'
}));

const creatorRoutes = require('./routes/creator');
app.use('/api/creator', creatorRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Mira Creator Tools API' });
});

app.get('/api/health', (req, res) => {
  const checks = {
    server: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    env: {
      openrouter: !!process.env.OPENROUTER_API_KEY,
      removebg: !!process.env.REMOVEBG_API_KEY,
    }
  };
  res.json(checks);
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'Origin not allowed' });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request too large' });
  }

  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
