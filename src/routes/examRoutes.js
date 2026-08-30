const express = require('express');
const router = express.Router();
const { getExams, createExam, deleteExam, getExamResults, saveExamResults, getStudentReports } = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');
const { protectStudent } = require('../middleware/studentMiddleware');

// Student routes
router.get('/student/reports', protectStudent, getStudentReports);

// Admin routes
router.route('/')
  .get(protect, getExams)
  .post(protect, createExam);

router.delete('/:id', protect, deleteExam);

router.route('/:id/results')
  .get(protect, getExamResults)
  .post(protect, saveExamResults);

module.exports = router;
