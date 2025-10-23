const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_TEST);
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { items = [], shippingAddress = {} } = req.body;
    if (!items.length) return res.status(400).json({ message: 'No items provided' });

    const line_items = items.map(({ name, image, product, price, qty }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name,
          images: image ? [image] : [],
          metadata: { productId: product || '' },
        },
        unit_amount: Math.round(price * 100),
      },
      quantity: qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: String(req.user._id),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('Stripe session error:', err.message);
    res.status(500).json({ message: 'Unable to create checkout session' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const sessionId = req.params.id;
    if (!sessionId) return res.status(400).json({ message: 'Session ID required' });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    if (!session || session.payment_status !== 'paid')
      return res.status(400).json({ message: 'Payment not completed' });

    // Avoid duplicate orders
    const existingOrder = await Order.findOne({ checkoutSessionId: sessionId });
    if (existingOrder) return res.json(existingOrder);

    // Prepare order items
    const orderItems = session.line_items.data.map(li => {
      const p = li.price.product;
      return {
        product: p.metadata?.productId || null,
        name: p.name,
        image: p.images?.[0] || '',
        price: (li.price.unit_amount || 0) / 100,
        qty: li.quantity,
      };
    });

    const shipping = session.metadata?.shippingAddress
      ? JSON.parse(session.metadata.shippingAddress)
      : {};

    // Create new order
    const order = new Order({
      user: session.metadata?.userId || null,
      orderItems,
      shippingAddress: shipping,
      paymentMethod: 'stripe',
      itemsPrice: orderItems.reduce((s, i) => s + i.price * i.qty, 0),
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: (session.amount_total || 0) / 100,
      isPaid: true,
      paidAt: new Date(),
      paymentResult: { id: session.payment_intent || session.id, status: 'succeeded' },
      checkoutSessionId: sessionId,
    });

    const savedOrder = await order.save();

    // Reduce stock safely
    for (const item of orderItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: -item.qty } }).catch(() => {});
      }
    }

    res.json(savedOrder);
  } catch (err) {
    console.error('Stripe confirm error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
