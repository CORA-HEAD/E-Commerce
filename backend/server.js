const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// const authRoutes = require('./routes/auth');
// const productRoutes = require('./routes/products');
// const cartRoutes = require('./routes/cart');
// const orderRoutes = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Mongodb connected');
    })
    .catch((err) => console.error(err));
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));