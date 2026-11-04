import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = express.Router();

function generateToken(id) {
  const secret = process.env.JWT_SECRET || 'super_secret_college_marketplace_key_2026';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { name, email, password, rollNumber, phone, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      rollNumber: rollNumber ? rollNumber.trim() : '',
      phone: phone ? phone.trim() : '',
      role: role === 'admin' ? 'admin' : 'student'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: user.toSafeObject(),
      data: { token, user: user.toSafeObject() }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: user.toSafeObject(),
      data: { token, user: user.toSafeObject() }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me (Current user profile with populated cart and wishlist)
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('cart.product')
      .populate('wishlist');

    res.json({
      success: true,
      user,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, rollNumber, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (rollNumber !== undefined) user.rollNumber = rollNumber.trim();
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: user.toSafeObject()
    });
  } catch (err) {
    next(err);
  }
});

export default router;
