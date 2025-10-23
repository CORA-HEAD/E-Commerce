const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // your protect middleware
const cartController = require('../controllers/cartController');

// All routes require auth (cart is per-user). If you want guests to have server-side carts, change this.
router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addToCart);
router.put('/item/:itemId', protect, cartController.updateCartItem);
router.delete('/item/:itemId', protect, cartController.removeCartItem);
router.delete('/', protect, cartController.clearCart);

module.exports = router;
