const express = require('express');
const router = express.Router();
const { getMenus, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getMenus).post(protect, createMenu);
router.route('/:id').put(protect, updateMenu).delete(protect, deleteMenu);

module.exports = router;
