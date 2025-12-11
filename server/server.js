// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import connectDB from './configs/mongodb.js';

const app = express();

// ---- CORS (allow your client domain + local dev) ----
const allowedOrigins = [
  'https://bg-removal-u9h2.vercel.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true, // set true only if you use cookies/auth
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// -----------------------------------------------------

// Health & root
app.get('/healthz', (req, res) => res.status(200).send('ok'));
app.get('/', (req, res) =>
  res.status(200).json({ status: 'ok', message: 'API Working', time: new Date().toISOString() })
);

// Routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Boot
async function start() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 4000;    // Render injects PORT
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown (optional)
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

start();
