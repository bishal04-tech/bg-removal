import express from 'express';
import multer from 'multer';

const app = express();

// 1. SIMPLE MULTER SETUP
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    console.log("--> Multer is renaming the file now...");
    cb(null, 'test-' + Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 2. LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`[HIT] Received ${req.method} request at ${req.url}`);
  next();
});

// 3. THE ROUTE
// We use the key 'image' here
app.post('/upload', upload.single('image'), (req, res) => {
  console.log("--> INSIDE ROUTE!");
  
  if (!req.file) {
    console.log("--> ERROR: No file found in req.file");
    return res.status(400).send('No file uploaded (Check Key name)');
  }

  console.log("--> SUCCESS! File info:", req.file);
  res.send(`File uploaded successfully! Name: ${req.file.filename}`);
});

// 4. START SERVER
app.listen(5000, () => {
  console.log('-----------------------------------------------');
  console.log('>>> TEST SERVER RUNNING ON PORT 5000 <<<');
  console.log('-----------------------------------------------');
});