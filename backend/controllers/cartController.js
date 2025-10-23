const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to format cart items for response
const normalizeCart = (cart) => (cart ? cart.items : []);

//Get Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(normalizeCart(cart));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = (await Cart.findOne({ user: req.user._id })) || new Cart({ user: req.user._id, items: [] });

    const existingItem = cart.items.find(i => String(i.product) === String(productId));
    const finalQty = Math.min(product.countInStock, (existingItem?.qty || 0) + Math.max(1, Number(qty)));

    const itemData = {
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: finalQty,
    };

    if (existingItem) Object.assign(existingItem, itemData);
    else cart.items.push(itemData);

    await cart.save();
    res.json(normalizeCart(cart));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//Update Cart Item Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId: productId } = req.params;
    const qty = Number(req.body.qty);

    if (!productId || qty <= 0) return res.status(400).json({ message: 'Invalid input' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => String(i.product) === String(productId));
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.qty = Math.min(qty, product.countInStock);
    item.name = product.name;
    item.price = product.price;
    item.image = product.image;

    await cart.save();
    res.json(normalizeCart(cart));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove Cart Item
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId: productId } = req.params;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => String(i.product) !== String(productId));
    await cart.save();

    res.json(normalizeCart(cart));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//Clear Entire Cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
