const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0 });
    }

    sendResponse(res, 200, true, 'Cart fetched successfully', cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // product exists in cart, update the quantity
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // product does not exists in cart, add new item
      cart.items.push({ product: productId, quantity });
    }

    // Calculate total price (requires populated product info, so we do it roughly or save and populate)
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    
    let total = 0;
    updatedCart.items.forEach(item => {
      total += item.quantity * item.product.price;
    });
    
    updatedCart.totalPrice = total;
    await updatedCart.save();

    sendResponse(res, 200, true, 'Item added to cart', updatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;

    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      return sendResponse(res, 404, false, 'Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity);
      
      let total = 0;
      cart.items.forEach(item => {
        total += item.quantity * item.product.price;
      });
      
      cart.totalPrice = total;
      await cart.save();
      
      sendResponse(res, 200, true, 'Cart item updated', cart);
    } else {
      sendResponse(res, 404, false, 'Item not found in cart');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const productId = req.params.id;

    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      return sendResponse(res, 404, false, 'Cart not found');
    }

    cart.items = cart.items.filter(item => item.product._id.toString() !== productId);
    
    let total = 0;
    cart.items.forEach(item => {
      total += item.quantity * item.product.price;
    });
    
    cart.totalPrice = total;
    await cart.save();

    sendResponse(res, 200, true, 'Item removed from cart', cart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
