import express from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { validateOrder } from '../middleware/validate.js';

const router = express.Router();

// POST /api/orders (Create order, guest or authenticated student)
router.post('/', optionalAuth, validateOrder, async (req, res, next) => {
  try {
    const {
      studentName,
      rollNumber,
      phone,
      deliveryType,
      destination,
      timeSlot,
      paymentMethod,
      items,
      total,
      discount
    } = req.body;

    const orderId = `AIF-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      orderId,
      user: req.user ? req.user._id : null,
      studentName: studentName.trim(),
      rollNumber: rollNumber.trim(),
      phone: phone.trim(),
      deliveryType: deliveryType || 'pickup',
      destination: destination || 'Campus Shop Counters',
      timeSlot: timeSlot || 'Next 15-30 Mins (Ready Queue)',
      paymentMethod: paymentMethod || 'Pay at Shop Counter (Cash/UPI)',
      items,
      total,
      discount: discount || 0,
      status: 'Received'
    });

    // If logged in, clear their cart in DB
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { cart: [] });
    }

    res.status(201).json({
      success: true,
      message: 'Campus order placed successfully!',
      data: order
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/my-orders (Logged in student order history)
router.get('/my-orders', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ user: req.user._id }, { rollNumber: req.user.rollNumber }]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders (Admin only: view all campus orders)
router.get('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id (Retrieve specific order details)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = await Order.findOne({ orderId: id });
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/status (Admin only: update order status)
router.put('/:id/status', protect, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'Received',
      'Processing',
      'Ready for Pickup',
      'Out for Delivery',
      'Completed',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    let order = await Order.findOne({ orderId: id });
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: order
    });
  } catch (err) {
    next(err);
  }
});

export default router;
