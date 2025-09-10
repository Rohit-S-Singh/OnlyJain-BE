// index.js

// 1. Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/api/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// Start the Server
app.listen(PORT, () => {
  console.log(`Sattvik server is running on http://localhost:${PORT}`);
});