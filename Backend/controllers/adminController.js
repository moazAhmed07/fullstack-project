const User = require('../models/User');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    sendResponse(res, 200, true, 'Users fetched successfully', users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    sendResponse(res, 200, true, 'Orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return sendResponse(res, 400, false, 'Category already exists');
    }

    const category = await Category.create({
      name,
      description,
    });

    sendResponse(res, 201, true, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    sendResponse(res, 200, true, 'Categories fetched successfully', categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getOrders,
  createCategory,
  getCategories,
};
