import multer from 'multer';

// This configures multer to keep the original file extension
// and gives it a unique name so files don't overwrite each other.
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

export default upload;