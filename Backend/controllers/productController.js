const Product = require('../models/Product');
const Category = require('../models/Category');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    // Search keyword
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    // Category filter
    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const count = await Product.countDocuments({ ...keyword, ...categoryFilter });
    const products = await Product.find({ ...keyword, ...categoryFilter })
      .populate('category', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    sendResponse(res, 200, true, 'Products fetched successfully', {
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (product) {
      sendResponse(res, 200, true, 'Product fetched successfully', product);
    } else {
      sendResponse(res, 404, false, 'Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, featured, brand } = req.body;
    let images = [];

    // If using multer for single or multiple files
    if (req.files) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      images = req.body.images; // If images are passed as string array (URLs)
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      images,
      stock,
      featured,
      brand,
    });

    const createdProduct = await product.save();
    sendResponse(res, 201, true, 'Product created successfully', createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, featured, brand } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.featured = featured !== undefined ? featured : product.featured;
      product.brand = brand || product.brand;

      if (req.files && req.files.length > 0) {
        product.images = req.files.map(file => `/uploads/${file.filename}`);
      }

      const updatedProduct = await product.save();
      sendResponse(res, 200, true, 'Product updated successfully', updatedProduct);
    } else {
      sendResponse(res, 404, false, 'Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      sendResponse(res, 200, true, 'Product removed successfully');
    } else {
      sendResponse(res, 404, false, 'Product not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
