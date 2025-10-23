require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Expanded sample products with HD images
const products = [
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Soft and breathable 100% cotton t-shirt, perfect for daily wear.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1660774986940-7ceeea68158f?auto=format&fit=crop&q=80&w=687',
    countInStock: 25,
  },
  {
    name: 'Urban Sneakers',
    description: 'Lightweight and stylish sneakers for everyday comfort.',
    price: 145,
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&q=80&w=1974',
    countInStock: 15,
  },
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Over-ear Bluetooth headphones with immersive sound and ANC technology.',
    price: 200,
    image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?auto=format&fit=crop&q=80&w=764',
    countInStock: 10,
  },
  {
    name: 'Smart Watch',
    description: 'Water-resistant smartwatch with fitness and sleep tracking features.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=764',
    countInStock: 8,
  },
  {
    name: 'Leather Backpack',
    description: 'Durable handmade leather backpack for travel and daily commute.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?auto=format&fit=crop&q=80&w=1274',
    countInStock: 12,
  },
  {
    name: 'Slim Laptop Bag',
    description: 'Waterproof laptop bag with adjustable strap and padded compartments.',
    price: 75,
    image: 'https://images.unsplash.com/photo-1630522521764-9ec0064a7e6e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    countInStock: 18,
  },
  {
    name: 'Bluetooth Portable Speaker',
    description: 'Compact speaker with deep bass and 12-hour battery life.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1675319245480-215961c129f1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    countInStock: 22,
  },
  {
    name: 'Aviator Sunglasses',
    description: 'UV-protected metal frame sunglasses for a stylish look.',
    price: 50,
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880',
    countInStock: 30,
  },
  {
    name: 'Sports Water Bottle',
    description: 'Leak-proof stainless steel bottle, keeps drinks cold for 24 hours.',
    price: 30,
    image: 'https://plus.unsplash.com/premium_photo-1664527307281-faf42c09ac8f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    countInStock: 40,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic mouse with silent clicks and adjustable DPI.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1028',
    countInStock: 20,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches for fast response.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2080',
    countInStock: 16,
  },
  {
    name: 'Gaming Chair',
    description: 'Ergonomic gaming chair with adjustable armrests and lumbar support.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1670946839270-cc4febd43b09?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688',
    countInStock: 6,
  },
  {
    name: 'Table Lamp',
    description: 'Modern LED table lamp with adjustable brightness and warm lighting.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1573676386604-78f8ed228e2b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    countInStock: 25,
  },
  {
    name: 'Wool Beanie',
    description: 'Warm and soft winter beanie made of premium wool blend.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1606453860825-29443dab3893?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    countInStock: 50,
  },
  {
    name: 'Cotton Hoodie',
    description: 'Classic pullover hoodie with front pocket and adjustable drawstring.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1634132364871-e6352fb3abcd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
    countInStock: 28,
  },
];

const importData = async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('MongoDB connected');

    await Product.deleteMany();
    console.log('Old products removed');

    await Product.insertMany(products);
    console.log('Products successfully seeded!');
    console.log('Total products added:', products.length);

    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err.message);
    process.exit(1);
  }
};

importData();
