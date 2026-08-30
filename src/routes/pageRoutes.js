const express = require('express');
const router = express.Router();
const { getPages, getPageBySlug, createPage, updatePage } = require('../controllers/pageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPages).post(protect, createPage);
router.route('/:slug').get(getPageBySlug);
router.route('/:id').put(protect, updatePage);

module.exports = router;
