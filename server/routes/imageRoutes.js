import express from 'express';
import { removeBgImage } from '../controllers/imageController.js';
import multer from 'multer';

const router = express.Router();

// --- 1. CONFIG FROM YOUR WORKING TEST FILE ---
// We define this right here to be 100% sure it loads
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    // This naming strategy worked in your test
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });
// ---------------------------------------------

// --- 2. THE ROUTE ---
// Matches: POST /api/image/remove-bg
router.post('/remove-bg', upload.single('image'), removeBgImage);

export default router;