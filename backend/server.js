// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const stripeRoutes=require('./routes/stripe');
const app = express();

// connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to DB', err);
  process.exit(1);
});

// middlewares
app.use(cors());
app.use(express.json()); // parse JSON bodies


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/stripe',stripeRoutes);
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
