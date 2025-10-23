const Order = require('../models/Order');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY );

exports.createOrder = async (req, res) => {
    try {
        const {
            orderItems, shippingAddress, paymentMethod,
            itemsPrice, shippingPrice, taxPrice, totalPrice
        } = req.body;


        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }


        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            isPaid: false
        });


        const created = await order.save();
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


