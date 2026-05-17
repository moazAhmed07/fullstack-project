/**
 * Utility function to send formatted API responses
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {Object|Array} [data={}] - Payload data
 */
const sendResponse = (res, statusCode, success, message, data = {}) => {
  res.status(statusCode).json({
    success,
    message,
    data
  });
};

module.exports = { sendResponse };
