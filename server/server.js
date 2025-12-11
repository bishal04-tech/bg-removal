// // import 'dotenv/config';
// // import express from 'express'
// // import cors from 'cors'
// // import userRouter from './routes/userRoutes.js';
// // import connectDB from './configs/mongodb.js';
// // import imageRouter from './routes/imageRoutes.js';

// // // App Config
// // const PORT = process.env.PORT || 4000
// // const app = express();
// // await connectDB()

// // // Intialize Middlewares
// // app.use(express.json())
// // app.use(cors())

// // // API routes
// // app.use('/api/user',userRouter)
// // app.use('/api/image',imageRouter)

// // app.get('/', (req,res) => res.send("API Working"))

// // app.listen(PORT, () => console.log('Server running on port ' + PORT));
// // server.js
// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';

// import userRouter from './routes/userRoutes.js';
// import imageRouter from './routes/imageRoutes.js';
// import connectDB from './configs/mongodb.js';

// const app = express();


// // Intialize Middlewares
// app.use(express.json())
// app.use(cors())

// // Health & root checks (Render can use these)
// app.get('/healthz', (req, res) => res.status(200).send('ok'));
// app.get('/', (req, res) =>
//   res.status(200).json({ status: 'ok', message: 'API Working', time: new Date().toISOString() })
// );

// // API routes
// app.use('/api/user', userRouter);
// app.use('/api/image', imageRouter);

// // (Optional) simple 404 for unknown routes
// app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// // Boot function (no top-level await)
// async function start() {
//   try {
//     await connectDB();

//     const PORT = process.env.PORT || 4000;
//     // Bind to 0.0.0.0 so Render can reach it
//     app.listen(PORT, '0.0.0.0', () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error('Failed to start server:', err);
//     process.exit(1);
//   }
// }

// // Graceful shutdown (nice to have)
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received. Shutting down gracefully.');
//   process.exit(0);
// });
// process.on('SIGINT', () => {
//   console.log('SIGINT received. Shutting down gracefully.');
//   process.exit(0);
// });

// start();
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import connectDB from './configs/mongodb.js';

const app = express();

// ---- CORS (fix) ----
const allowedOrigins = [
  'https://bg-removal-u9h2.vercel.app', // your client origin
  'http://localhost:5173',              // dev (Vite) optional
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true, // set to true only if you actually send cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length']
};

app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // make OPTIONS preflights succeed
// --------------------

// Health & root checks
app.get('/healthz', (req, res) => res.status(200).send('ok'));
app.get('/', (req, res) =>
  res.status(200).json({ status: 'ok', message: 'API Working', time: new Date().toISOString() })
);

// API routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Boot
async function start() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

start();
