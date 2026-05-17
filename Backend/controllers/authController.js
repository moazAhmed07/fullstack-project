const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendResponse(res, 400, false, 'User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      sendResponse(res, 201, true, 'User registered successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      sendResponse(res, 400, false, 'Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      sendResponse(res, 200, true, 'User logged in successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      sendResponse(res, 401, false, 'Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      sendResponse(res, 200, true, 'User profile fetched successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      sendResponse(res, 404, false, 'User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
