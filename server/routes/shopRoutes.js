import express from 'express';
import { Shop } from '../models/Shop.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// GET /api/shops
router.get('/', async (req, res, next) => {
  try {
    const shops = await Shop.find().sort({ rating: -1 });
    res.json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/shops/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let shop = await Shop.findOne({ id });
    if (!shop && id.match(/^[0-9a-fA-F]{24}$/)) {
      shop = await Shop.findById(id);
    }

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Campus shop not found'
      });
    }

    res.json({
      success: true,
      data: shop
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/shops (Admin only)
router.post('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: shop
    });
  } catch (err) {
    next(err);
  }
});

export default router;
