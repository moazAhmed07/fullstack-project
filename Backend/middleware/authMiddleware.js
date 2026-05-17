const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return sendResponse(res, 401, false, 'Not authorized, user not found');
      }

      next();
    } catch (error) {
      return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, no token');
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    sendResponse(res, 403, false, 'Not authorized as an admin');
  }
};

module.exports = { protect, admin };
