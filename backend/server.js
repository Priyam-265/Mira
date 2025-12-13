const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}));

// Routes
const creatorRoutes = require('./routes/creator');
app.use('/api/creator', creatorRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Mira Creator Tools API' });
});

const PORT = process.env.CORS_ORIGIN || process.env.port||5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});