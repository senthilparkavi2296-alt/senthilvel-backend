const express = require('express');
const router = express.Router();
const { getFeeStructures, getFeeStructureByClass, createFeeStructure, updateFeeStructure, deleteFeeStructure } = require('../controllers/feeStructureController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getFeeStructures);
router.get('/:className', getFeeStructureByClass);
router.post('/', protect, createFeeStructure);
router.put('/:id', protect, updateFeeStructure);
router.delete('/:id', protect, deleteFeeStructure);

module.exports = router;
