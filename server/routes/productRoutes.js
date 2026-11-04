import express from 'express';
import { Product } from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { validateProduct } from '../middleware/validate.js';

const router = express.Router();

// GET /api/products (filter by category, shopId, search, price range, sort)
router.get('/', async (req, res, next) => {
  try {
    const { category, shopId, search, minPrice, maxPrice, sort, featured } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (shopId && shopId !== 'all') {
      filter.shopId = shopId;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search && search.trim()) {
      const q = search.trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { shopName: regex },
        { tags: regex },
        { specs: regex }
      ];
    }

    let sortObj = { featured: -1, createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'discount') sortObj = { discount: -1 };

    const products = await Product.find(filter).sort(sortObj);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findOne({ productId: id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/products (Admin only)
router.post('/', protect, requireAdmin, validateProduct, async (req, res, next) => {
  try {
    const productData = { ...req.body };
    if (!productData.productId) {
      productData.productId = `prod-${Date.now()}`;
    }

    const newProduct = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id (Admin only)
router.put('/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findOne({ productId: id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id (Admin only)
router.delete('/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findOneAndDelete({ productId: id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findByIdAndDelete(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
