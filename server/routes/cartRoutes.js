import express from 'express';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to resolve product ObjectId
async function findProductDoc(productIdOrKey) {
  let product = null;
  if (productIdOrKey.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(productIdOrKey);
  }
  if (!product) {
    product = await Product.findOne({ productId: productIdOrKey });
  }
  return product;
}

// GET /api/cart
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    const items = (user.cart || []).filter((item) => item.product !== null);

    res.json({
      success: true,
      data: items,
      items
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/cart (Add item to cart or sync cart array)
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId, quantity = 1, items } = req.body;
    const user = await User.findById(req.user._id);

    // If client sends bulk cart items array
    if (Array.isArray(items)) {
      const validItems = [];
      for (const it of items) {
        const pId = it.productId || it.product || it._id;
        if (!pId) continue;
        const prod = await findProductDoc(String(pId));
        if (prod) {
          validItems.push({
            product: prod._id,
            quantity: Number(it.quantity) || 1
          });
        }
      }
      user.cart = validItems;
      await user.save();
      const updatedUser = await User.findById(user._id).populate('cart.product');
      return res.json({
        success: true,
        message: 'Cart synchronized',
        data: updatedUser.cart
      });
    }

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId or items array is required' });
    }

    const product = await findProductDoc(String(productId));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === product._id.toString()
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += Number(quantity) || 1;
    } else {
      user.cart.push({
        product: product._id,
        quantity: Number(quantity) || 1
      });
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('cart.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      data: updatedUser.cart
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/cart/:productId (Update quantity)
router.put('/:productId', protect, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const product = await findProductDoc(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === product._id.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      user.cart.splice(itemIndex, 1);
    } else {
      user.cart[itemIndex].quantity = Number(quantity);
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('cart.product');

    res.json({
      success: true,
      message: 'Cart updated',
      data: updatedUser.cart
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/:productId (Remove item)
router.delete('/:productId', protect, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await findProductDoc(productId);

    const user = await User.findById(req.user._id);
    if (product) {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== product._id.toString()
      );
    } else {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('cart.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: updatedUser.cart
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart (Clear all items)
router.delete('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: []
    });
  } catch (err) {
    next(err);
  }
});

export default router;
