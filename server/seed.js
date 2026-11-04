import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Category } from './models/Category.js';
import { Shop } from './models/Shop.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';

import { CATEGORIES } from '../src/data/categories.js';
import { SHOPS } from '../src/data/shops.js';
import { PRODUCTS } from '../src/data/products.js';

async function seedData() {
  try {
    console.log('[Seed] Starting database seed...');
    await connectDB();

    // Clear existing collections
    await Category.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // Seed Categories
    const validCategories = CATEGORIES.filter((c) => c.id !== 'all');
    await Category.insertMany(validCategories);
    console.log(`[Seed] Seeded ${validCategories.length} categories.`);

    // Seed Shops
    await Shop.insertMany(SHOPS);
    console.log(`[Seed] Seeded ${SHOPS.length} campus shops.`);

    // Seed Products
    const productsToInsert = PRODUCTS.map((p) => ({
      productId: p.id,
      title: p.title,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      rating: p.rating,
      reviews: p.reviews,
      shopId: p.shopId,
      shopName: p.shopName,
      condition: p.condition,
      image: p.image,
      description: p.description,
      specs: p.specs,
      inStock: p.inStock,
      featured: p.featured,
      tags: p.tags
    }));

    await Product.insertMany(productsToInsert);
    console.log(`[Seed] Seeded ${productsToInsert.length} student essentials.`);

    // Seed Demo Users
    const demoStudent = await User.create({
      name: 'Rahul Sharma',
      email: 'student@aifinds.edu',
      password: 'Student@123',
      rollNumber: '23BCSE104',
      phone: '9876543210',
      role: 'student'
    });
    console.log(`[Seed] Seeded demo student: ${demoStudent.email} (Password: Student@123)`);

    const demoAdmin = await User.create({
      name: 'Campus Administrator',
      email: 'admin@aifinds.edu',
      password: 'Admin@123',
      rollNumber: 'ADMIN-01',
      phone: '9811122334',
      role: 'admin'
    });
    console.log(`[Seed] Seeded demo admin: ${demoAdmin.email} (Password: Admin@123)`);

    // Seed Sample Past Order for Demo Student
    await Order.create({
      orderId: 'AIF-720194',
      user: demoStudent._id,
      studentName: demoStudent.name,
      rollNumber: demoStudent.rollNumber,
      phone: demoStudent.phone,
      deliveryType: 'pickup',
      destination: 'Campus Xerox & Tech Point, North Gate',
      timeSlot: 'Ready for Pickup',
      paymentMethod: 'Pay at Shop Counter (Cash/UPI)',
      items: [
        {
          productId: 'prod-book-grewal',
          title: 'Higher Engineering Mathematics - B.S. Grewal (44th Edition)',
          price: 620,
          quantity: 1,
          shopId: 'vidya-books',
          shopName: 'Vidya Book House & Stationery',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
        },
        {
          productId: 'prod-stat-notebook-pack',
          title: 'Classmate Pulse 6-Subject Spiral Notebook (300 Pages, A4)',
          price: 160,
          quantity: 2,
          shopId: 'campus-xerox',
          shopName: 'Campus Xerox & Tech Point',
          image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
        }
      ],
      total: 940,
      discount: 0,
      status: 'Ready for Pickup',
      date: '21 Oct 2026, 04:30 PM'
    });
    console.log('[Seed] Seeded sample past order for student.');

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seedData();
