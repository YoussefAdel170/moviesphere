// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // loads .env variables

import aiGroqRoutes from './routes/ai-groq.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', aiGroqRoutes);

// Simple error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   POST /api/ai-recommend - AI movie suggestions`);
});