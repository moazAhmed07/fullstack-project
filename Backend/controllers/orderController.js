const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return sendResponse(res, 400, false, 'No order items');
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Reduce stock for products
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    sendResponse(res, 201, true, 'Order created successfully', createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    sendResponse(res, 200, true, 'Orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order && (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString())) {
      sendResponse(res, 200, true, 'Order fetched successfully', order);
    } else {
      sendResponse(res, 404, false, 'Order not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
