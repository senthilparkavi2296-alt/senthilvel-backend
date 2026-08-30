const express = require('express');
const router = express.Router();
const { getFaculty, addFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getFaculty).post(protect, upload.single('image'), addFaculty);
router.route('/:id').put(protect, upload.single('image'), updateFaculty).delete(protect, deleteFaculty);

module.exports = router;
