const express = require('express');
const router = express.Router();
const { createOrder, createPaymentIntent } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');


router.post('/', protect, createOrder);
// router.post('/create-payment-intent', protect, createPaymentIntent);


module.exports = router;