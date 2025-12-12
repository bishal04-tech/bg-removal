import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import authRouter from './routes/authRoutes.js';
import connectDB from './configs/mongodb.js';

const app = express();

// DB
(async () => {
  try {
    await connectDB();
    console.log('✅ Database connected');
  } catch (e) {
    console.error('❌ MongoDB connection failed:', e.message);
    process.exit(1);
  }
})();

// middleware
app.use(express.json());
app.use(cors());

// DEBUG: log every request so we see what hits the server

// 🔎 hard-wire a test route (bypasses the router file entirely)
// app.get('/api/auth/health', (_req, res) => res.json({ ok: true, via: 'server.js inline' }));

// mount routers (before 404)
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

// default
app.get('/', (_req, res) => res.send('🚀 API Working'));

// JSON 404 fallback LAST (prevents HTML and bad JSON parsing)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
