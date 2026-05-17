const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
    ]);

    const adminUser = createdUsers[0]._id;

    const createdCategories = await Category.insertMany([
      { name: 'Boots', description: 'Football boots and cleats' },
      { name: 'Jerseys', description: 'Official club and national team jerseys' },
      { name: 'Equipment', description: 'Balls, shin guards, and training gear' },
    ]);

    const bootsCategory = createdCategories[0]._id;
    const jerseysCategory = createdCategories[1]._id;

    await Product.insertMany([
      {
        name: 'Nike Mercurial Superfly',
        description: 'Elite football boots for explosive speed.',
        price: 279.99,
        category: bootsCategory,
        images: ['/uploads/sample-boot.jpg'],
        stock: 50,
        featured: true,
        brand: 'Nike',
      },
      {
        name: 'Real Madrid Home Jersey 23/24',
        description: 'Authentic home jersey of Real Madrid.',
        price: 89.99,
        category: jerseysCategory,
        images: ['/uploads/sample-jersey.jpg'],
        stock: 100,
        featured: true,
        brand: 'Adidas',
      },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
