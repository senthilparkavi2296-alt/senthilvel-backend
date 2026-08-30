const express = require('express');
const router = express.Router();
const { getDownloads, addDownload, deleteDownload } = require('../controllers/downloadController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Allow all file types for downloads (PDF, DOC, etc.)
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) { cb(null, `download-${Date.now()}${path.extname(file.originalname)}`); }
});
const uploadFile = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

router.route('/').get(getDownloads).post(protect, uploadFile.single('file'), addDownload);
router.route('/:id').delete(protect, deleteDownload);

module.exports = router;
