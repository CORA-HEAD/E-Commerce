require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const products = [
  { name: 'T-Shirt', description: 'Comfortable cotton t-shirt', price: 1999, image: '', countInStock: 20 },
  { name: 'Sneakers', description: 'Stylish sneakers', price: 5999, image: '', countInStock: 10 },
  { name: 'Headphones', description: 'Noise-cancelling', price: 9999, image: '', countInStock: 15 }
];

const importData = async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
