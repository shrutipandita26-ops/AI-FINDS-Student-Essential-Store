import express from 'express';
import { Category } from '../models/Category.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let category = await Category.findOne({ id });
    if (!category && id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/categories (Admin only)
router.post('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (err) {
    next(err);
  }
});

export default router;
