import express from 'express';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

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

// GET /api/wishlist
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    const items = (user.wishlist || []).filter((item) => item !== null);

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/wishlist/:productId (Toggle Wishlist)
router.post('/:productId', protect, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await findProductDoc(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const exists = user.wishlist.some(
      (id) => id.toString() === product._id.toString()
    );

    let isSaved = false;
    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== product._id.toString()
      );
      isSaved = false;
    } else {
      user.wishlist.push(product._id);
      isSaved = true;
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('wishlist');

    res.json({
      success: true,
      isSaved,
      message: isSaved ? 'Added to wishlist' : 'Removed from wishlist',
      data: updatedUser.wishlist,
      wishlist: updatedUser.wishlist
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wishlist/:productId (Remove)
router.delete('/:productId', protect, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await findProductDoc(productId);

    const user = await User.findById(req.user._id);
    if (product) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== product._id.toString()
      );
    } else {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('wishlist');

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      data: updatedUser.wishlist
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wishlist (Clear)
router.delete('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      message: 'Wishlist cleared',
      data: []
    });
  } catch (err) {
    next(err);
  }
});

export default router;
