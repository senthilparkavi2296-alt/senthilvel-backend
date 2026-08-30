const express = require('express');
const router = express.Router();
const { getEvents, addEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, upload.single('image'), addEvent);

router.route('/:id').delete(protect, deleteEvent);

module.exports = router;
