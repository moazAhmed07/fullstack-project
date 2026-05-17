const express = require('express');
const router = express.Router();
const {
  getUsers,
  getOrders,
  createCategory,
  getCategories,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users')
  .get(protect, admin, getUsers);

router.route('/orders')
  .get(protect, admin, getOrders);

router.route('/categories')
  .post(protect, admin, createCategory)
  .get(getCategories); // Made public so frontend can fetch categories without auth

module.exports = router;
