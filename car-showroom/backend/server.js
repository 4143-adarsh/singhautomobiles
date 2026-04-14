require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// Middleware
// ============================================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// API Routes
// ============================================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/inquiries', require('./routes/inquiries'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SecondHand Car Showroom API is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max size is 5MB.' });
  }
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// ============================================================
// Start server after DB connection
// ============================================================
const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚗 Car Showroom API running on http://localhost:${PORT}`);
    console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`);
  });
};

startServer();
