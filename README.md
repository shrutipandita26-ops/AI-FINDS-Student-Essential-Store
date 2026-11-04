# AI FINDS - College Student Essentials Marketplace

> **A modern, full-stack college student marketplace built with Node.js, Express, MongoDB, and React + Vite.**  
> *AI FINDS connects college students to essential academic supplies, notebooks, stationery, engineering/medical lab gear, syllabus study notes & PYQs, campus printing/photocopy services, and hostel daily items from campus-area verified stores.*

---

## 📌 Project Overview

**Important Distinction:**  
AI FINDS is **NOT** a student management system (SMS) and **NOT** an AI tools directory. It is an end-to-end e-commerce & campus logistics platform tailored specifically to the real-life needs and schedules of university students.

### Key Capabilities
- 📚 **Full Essentials Catalog:** Textbooks, reference guides, laboratory kits, drafting boards, stationery, bound notes, past question papers, and print requests.
- 🏪 **Campus Shop Directory:** Local verified campus stores (Vidya Books, Campus Xerox, Apex Engineering Depot, Scholar's Corner, Hostel Mart) with operating hours, locations, and direct ordering.
- 🔐 **Secure Authentication:** User registration, bcrypt password hashing, JWT authorization, and role separation (`student` vs `admin`).
- 🛒 **Database-Backed Cart & Wishlist:** MongoDB persistent shopping cart and student wishlist synchronized across sessions.
- 📦 **Campus Order Management:** Order placement with campus pickup desk selection and lecture-friendly time slots (e.g. Lunch Break, After Lab).
- 🛡️ **Campus Admin Dashboard:** Role-protected admin portal to monitor live order queues, transition status (`Received` ➔ `Processing` ➔ `Ready for Pickup` ➔ `Completed`), and publish new products to MongoDB.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend** | Node.js (v18+), Express 5, Mongoose 9, JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), CORS, Dotenv |
| **Database** | MongoDB (Local Service or MongoDB Atlas URI) |
| **Frontend** | React 19, Vite 8, Lucide React Icons, Native CSS Design Tokens |
| **Validation & Security**| Mongoose Schemas, Bearer Token Auth Middleware, Role-Based Access Control (RBAC), Regex Sanitization |

---

## 📂 Project Directory Structure

```text
AI-FINDS/
├── .env                  # Live environment configuration
├── .env.example          # Template for environment configuration
├── package.json          # Root dependencies & runner scripts
├── README.md             # Complete documentation
├── index.html            # Vite HTML root
│
├── server/               # Express + MongoDB Backend
│   ├── config/
│   │   └── db.js         # MongoDB connection with Mongoose
│   ├── models/
│   │   ├── User.js       # Student & Admin account model with cart/wishlist
│   │   ├── Product.js    # Catalog items with search indexes and shop links
│   │   ├── Category.js   # Campus categories
│   │   ├── Shop.js       # Campus store locations & metadata
│   │   └── Order.js      # Order records, delivery slots, item snapshots
│   ├── middleware/
│   │   ├── auth.js       # JWT extraction & student authentication
│   │   ├── admin.js      # Admin authorization guard
│   │   ├── validate.js   # Request payload validation
│   │   └── errorHandler.js# Centralized HTTP error handler
│   ├── routes/
│   │   ├── authRoutes.js # /api/auth (register, login, me, profile)
│   │   ├── productRoutes.js # /api/products (filter, search, CRUD)
│   │   ├── categoryRoutes.js# /api/categories
│   │   ├── shopRoutes.js # /api/shops
│   │   ├── cartRoutes.js # /api/cart (get, sync, clear)
│   │   ├── wishlistRoutes.js# /api/wishlist (get, toggle)
│   │   └── orderRoutes.js# /api/orders (create, my-orders, admin all, status update)
│   ├── index.js          # Express server entry point (port 5000)
│   ├── seed.js           # Database seeder (categories, shops, 23 products, demo users)
│   └── test-api.js       # Comprehensive 13-point automated test suite
│
└── src/                  # React Frontend
    ├── components/
    │   ├── Navbar.jsx    # Sticky navigation with Auth status & cart badge
    │   ├── Hero.jsx      # Search banner & quick stats
    │   ├── Categories.jsx# Interactive category cards
    │   ├── ProductCard.jsx# Product item card with discount & quick actions
    │   ├── ProductQuickViewModal.jsx # Detail popup modal
    │   ├── ProductList.jsx# Filterable, sortable product grid
    │   ├── Cart.jsx      # Slide-out drawer with quantity updates
    │   ├── Wishlist.jsx  # Saved essentials drawer
    │   ├── Shops.jsx     # Campus store cards & shop-specific view
    │   ├── AuthModal.jsx # Login/Register modal with 1-click demo logins
    │   ├── CheckoutModal.jsx # Campus delivery slot & contact confirmation
    │   ├── StudentOrdersModal.jsx # Student order history & status tracking
    │   ├── AdminDashboardModal.jsx # Admin orders queue & product creator
    │   └── Footer.jsx    # Campus links & info
    ├── data/
    │   └── products.js   # Initial default catalog and categories
    ├── services/
    │   └── api.js        # Axios/Fetch API client with JWT interception
    ├── App.jsx           # Root application state & API synchronization
    ├── App.css           # Design tokens, typography & responsive layouts
    └── main.jsx          # React DOM entry point
```

---

## ⚡ Getting Started & Setup Instructions

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (`node -v`)
- **npm**: `v9.0.0` or higher (`npm -v`)
- **MongoDB**: Active local service (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI.

### 2. Installation
Clone the repository and install all dependencies:
```bash
cd AI-FINDS
npm install
```

### 3. Environment Configuration
Copy the template file to create `.env`:
```bash
cp .env.example .env
```
Ensure `.env` matches your environment:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_finds_db
JWT_SECRET=super_secret_college_marketplace_key_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed the Database
Populate MongoDB with default campus categories, stores, 23 essentials, and pre-configured student/admin demo accounts:
```bash
npm run seed
```
*Expected output: Connected to MongoDB, inserted 6 categories, 5 shops, 23 products, demo student, demo admin, and sample order.*

### 5. Run the Backend Server
Start the Express server on port 5000:
```bash
npm run server
```
*(Or run with hot-reload via `npm run server:dev`)*

### 6. Run the React Frontend
In a new terminal window, start the Vite development server:
```bash
npm run dev
```
The frontend is available at `http://localhost:5173`.

### 7. Run Automated Test Suites
AI FINDS includes two automated testing suites:

**1. Complete End-to-End System Test (44 Assertions):**
Verifies fresh registration, login, protected profile, product search, categories, shops, cart persistence, wishlist toggle, demo checkout, order creation, student order history, admin queue, admin status transitions, and admin catalog management:
```bash
npm run test:full
```
*Output: `🎉 ALL TESTS PASSED: 44/44 assertions (100%)`*

**2. Core API Endpoint Test (13 Assertions):**
```bash
npm run test:api
```
*Output: `🏁 API Test Results: 13/13 Tests Passed (100%)`*

**3. Frontend Quality & Production Build:**
```bash
npm run lint    # oxlint: 0 warnings, 0 errors
npm run build   # vite build: production assets compiled to dist/
```

---

## 🔑 Pre-Configured Demo Credentials

The database seeder provisions two ready-to-use testing accounts:

| Role | Email | Password | Roll Number | Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `student@aifinds.edu` | `Student@123` | `23BCSE104` | Place orders, track personal order history, save cart & wishlist to MongoDB |
| **Campus Admin** | `admin@aifinds.edu` | `Admin@123` | `ADMIN-01` | Access Admin Dashboard, view all campus orders, update order status, publish new products |

> 💡 **Quick Login Tip:** The Login modal includes **"Demo Student"** and **"Demo Admin"** quick-fill buttons for immediate 1-click testing.

---

## 📡 REST API Reference

All API routes are prefixed with `/api`.

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student account (`name`, `email`, `password`, `rollNumber`, `phone`) |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT bearer token |
| `GET` | `/api/auth/me` | Protected (JWT) | Get authenticated user profile, cart, and wishlist IDs |
| `PUT` | `/api/auth/profile` | Protected (JWT) | Update phone, campus block, or preferred time slot |

### 2. Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products. Supports `?category=`, `?search=`, `?shopId=`, `?sort=` |
| `GET` | `/api/products/:id` | Public | Retrieve single product details |
| `POST` | `/api/products` | Admin Only | Create new product catalog entry |
| `PUT` | `/api/products/:id` | Admin Only | Update product details, price, or stock status |
| `DELETE` | `/api/products/:id` | Admin Only | Remove product from catalog |

### 3. Categories & Shops (`/api/categories`, `/api/shops`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | Retrieve all 6 campus product categories |
| `GET` | `/api/shops` | Public | Retrieve all 5 verified campus stores |
| `GET` | `/api/shops/:id` | Public | Retrieve single campus store details |

### 4. Cart & Wishlist Persistence (`/api/cart`, `/api/wishlist`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Protected (JWT) | Fetch user's persistent cart items with live product details |
| `POST` | `/api/cart` | Protected (JWT) | Replace/sync current cart items (`[{ product, quantity }]`) |
| `DELETE` | `/api/cart` | Protected (JWT) | Clear student's cart upon checkout |
| `GET` | `/api/wishlist` | Protected (JWT) | Retrieve array of student's favorited product IDs |
| `POST` | `/api/wishlist/:productId` | Protected (JWT) | Toggle product in/out of student's wishlist |

### 5. Orders & Logistics (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Public / Auth | Create campus order with pickup slot, roll number, and items |
| `GET` | `/api/orders/my-orders` | Protected (JWT) | Fetch student's own previous orders and status history |
| `GET` | `/api/orders` | Admin Only | View all campus orders with status filter (`?status=`) |
| `PUT` | `/api/orders/:id/status` | Admin Only | Advance status (`Received` ➔ `Processing` ➔ `Ready for Pickup` ➔ `Completed` ➔ `Cancelled`) |

---

## 🎨 Design System & Aesthetics
- **Forest Green** (`#1b4332`, `#2d6a4f`): Grounded, trusted academic campus theme.
- **Warm Orange** (`#d97706`, `#b45309`): High-energy accents for CTA buttons, discounts, and badges.
- **Cream & Soft Off-White** (`#fcfbf7`, `#f4f1ea`, `#ffffff`): Premium reading background with reduced eye strain.
- **Typography**: Google Fonts Inter & Outfit with crisp responsive scales.
- **Micro-Animations**: Smooth slide-in drawers, modal backdrops, hover zooms, and real-time toast alerts.

---

## 🛡️ Security & Quality Standards
- Passwords salted and hashed with **bcryptjs** (10 salt rounds).
- Requests guarded by **JWT Bearer Authentication**.
- **Role-Based Authorization** (`admin` vs `student`) protects catalog mutations and order processing.
- Input validation sanitizes roll numbers, emails, phone numbers, and prices.
- Fallback resilience: If backend is temporarily offline, the React frontend seamlessly renders the cached catalog.
- Zero mock payment integration: Campus desk verification and Pay-at-Desk/UPI on collection.

---

## ⚠️ Manual Configuration & Requirements

The project is fully implemented, self-contained, and tested. For fresh setups or deployment to other machines, note the following requirements:

1. **MongoDB Service**:
   - The backend connects by default to local MongoDB: `mongodb://127.0.0.1:27017/ai_finds_db`.
   - On Windows, ensure the MongoDB service is running: `net start MongoDB` or run `mongod`.
   - **Alternative (Cloud)**: If local MongoDB is not installed, provide a MongoDB Atlas connection string in `.env`:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai_finds_db?retryWrites=true&w=majority
     ```

2. **Environment Secrets**:
   - Create your local `.env` from `.env.example`.
   - Change `JWT_SECRET` in `.env` to a custom secret string before production deployment.

3. **Database Seeding (`npm run seed`)**:
   - Run `npm run seed` once to populate initial product categories, 5 campus shops, 23 essentials items, and pre-configured student/admin demo accounts.

4. **Port Configuration**:
   - Backend default: `PORT=5000` (Endpoint: `http://localhost:5000/api`)
   - Frontend default: `5173` (Vite)
   - If port `5000` is already in use by another application, modify `PORT` in `.env` and set `VITE_API_BASE_URL=http://localhost:<YOUR_PORT>/api` for the frontend.

5. **Payment Processing (Deliberate Architectural Decision)**:
   - Real payment gateways (Razorpay, Stripe) are **deliberately not integrated** in accordance with college project requirements and financial regulations.
   - The application models a real-world campus logistics flow: orders are placed in the campus queue, assigned a lecture-friendly pickup slot, and verified with student ID at the shop desk with Pay-at-Desk (Cash / Campus UPI QR).

---

## 📜 License
Developed as a College Mini-Project for **AI FINDS Student Essentials Marketplace**.
