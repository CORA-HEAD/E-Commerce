const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createCheckoutSession,
  confirmPayment,
} = require('../controllers/stripeController');

//Create Stripe Checkout Session (User must be logged in)
router.post('/create-checkout-session', protect, createCheckoutSession);

//Confirm Payment after successful checkout
router.get('/confirm/:id', confirmPayment);

module.exports = router;
