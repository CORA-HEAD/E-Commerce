const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true }, // USD numeric value (e.g. 60)
  image: { type: String },
  qty: { type: Number, required: true, min: 1 },
}, { _id: false });

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // optional, useful for reference
    required: true,
    unique: true, // one cart per user
  },
  items: [CartItemSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);
