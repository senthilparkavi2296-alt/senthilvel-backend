const express = require('express');
const router = express.Router();
const { getFeeSummary, submitPayment, getMyPayments, getPendingPayments, getAllPayments, approvePayment, rejectPayment, getPaymentSettings, updatePaymentSettings } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { protectStudent } = require('../middleware/studentMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Student routes
router.get('/summary', protectStudent, getFeeSummary);
router.get('/my-payments', protectStudent, getMyPayments);
router.post('/submit', protectStudent, upload.single('proof'), submitPayment);

// Admin routes
router.get('/pending', protect, getPendingPayments);
router.get('/all', protect, getAllPayments);
router.put('/:id/approve', protect, approvePayment);
router.put('/:id/reject', protect, rejectPayment);

// Settings
router.get('/settings', getPaymentSettings);
router.put('/settings', protect, upload.single('qrCode'), updatePaymentSettings);

module.exports = router;
