const express = require('express');
const router = express.Router();
const { getAttendance, markAttendance, getStudentSummary } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { protectStudent } = require('../middleware/studentMiddleware');

// Admin/Faculty routes
router.get('/', protect, getAttendance);
router.post('/', protect, markAttendance);

// Student route
router.get('/student/summary', protectStudent, getStudentSummary);

module.exports = router;
