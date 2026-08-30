const express = require('express');
const router = express.Router();
const { studentLogin, getStudents, createStudent, updateStudent, deleteStudent, getMyProfile } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { protectStudent } = require('../middleware/studentMiddleware');

// Public
router.post('/login', studentLogin);

// Student self
router.get('/me', protectStudent, getMyProfile);

// Admin
router.get('/', protect, getStudents);
router.post('/', protect, createStudent);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, deleteStudent);

module.exports = router;
