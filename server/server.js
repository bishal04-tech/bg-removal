// import 'dotenv/config';
// import express from 'express'
// import cors from 'cors'
// import userRouter from './routes/userRoutes.js';
// import connectDB from './configs/mongodb.js';
// import imageRouter from './routes/imageRoutes.js';

// // App Config
// const PORT = process.env.PORT || 4000
// const app = express();
// await connectDB()

// // Intialize Middlewares
// app.use(express.json())
// app.use(cors())

// // API routes
// app.use('/api/user',userRouter)
// app.use('/api/image',imageRouter)

// app.get('/', (req,res) => res.send("API Working"))

// app.listen(PORT, () => console.log('Server running on port ' + PORT));
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import connectDB from './configs/mongodb.js';

const app = express();

// Connect to MongoDB
(async () => {
  try {
    await connectDB();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
})();

// Middleware
app.use(express.json());
app.use(cors()); // simple, open CORS for college project

// Routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 API Working');
});

// Start server (Render will inject PORT)
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
