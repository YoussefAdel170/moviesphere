// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import aiGroqRoutes from './routes/ai-groq.js';

const app = express();
const PORT = process.env.PORT || 8080;  // Cloud Run expects PORT

app.use(cors());
app.use(express.json());

app.use('/api', aiGroqRoutes);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

// IMPORTANT: bind to 0.0.0.0 for Cloud Run
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`   POST /api/ai-recommend - AI movie suggestions`);
});