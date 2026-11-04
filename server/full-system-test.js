// server/full-system-test.js
// Comprehensive Full-System Verification for AI FINDS

const API_BASE = 'http://localhost:5000/api';

async function runFullSystemTest() {
  console.log('\n======================================================');
  console.log('🚀 AI FINDS FULL SYSTEM END-TO-END VERIFICATION');
  console.log('======================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      throw new Error(`Test failed: ${message}`);
    }
  }

  try {
    // 1. Health check & DB connection
    console.log('--- Step 1: Health & Database Connectivity ---');
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Health endpoint responds with 200 OK');
    assert(healthData.database === 'connected', 'MongoDB database status is connected');

    // 2. Fresh User Registration
    console.log('\n--- Step 2: Fresh Student Registration ---');
    const timestamp = Date.now();
    const newStudent = {
      name: `Rohan Sharma ${timestamp.toString().slice(-4)}`,
      email: `rohan_${timestamp}@aifinds.edu`,
      password: 'StudentPass@123',
      rollNumber: `23BCE${timestamp.toString().slice(-4)}`,
      phone: '9876543210'
    };

    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, `Student registration succeeded (Status 201) for ${newStudent.email}`);
    assert(Boolean(regData.token), 'JWT token returned on registration');
    assert(regData.user.role === 'student', 'User assigned role "student"');

    // 3. User Login
    console.log('\n--- Step 3: Student Authentication / Login ---');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newStudent.email, password: newStudent.password })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Login succeeded with valid credentials');
    const studentToken = loginData.token;
    assert(Boolean(studentToken), 'JWT bearer token received on login');

    // 4. Fetch Protected Profile (/api/auth/me)
    console.log('\n--- Step 4: Protected User Profile ---');
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, 'Authenticated profile retrieved successfully');
    assert(meData.data.rollNumber === newStudent.rollNumber, 'User profile matches registered roll number');

    // 5. Product Catalog & Search
    console.log('\n--- Step 5: Product Catalog, Category Filter, and Search ---');
    const allProdRes = await fetch(`${API_BASE}/products`);
    const allProdData = await allProdRes.json();
    assert(allProdRes.status === 200 && allProdData.count > 0, `Catalog loaded ${allProdData.count} products from MongoDB`);

    // Search by keyword
    const searchRes = await fetch(`${API_BASE}/products?search=drafter`);
    const searchData = await searchRes.json();
    assert(searchRes.status === 200, 'Product search for "drafter" returned 200');
    assert(searchData.data.some(p => p.title.toLowerCase().includes('drafter')), 'Search correctly matched drafter product');

    // Filter by category
    const catRes = await fetch(`${API_BASE}/products?category=lab`);
    const catData = await catRes.json();
    assert(catRes.status === 200 && catData.data.every(p => p.category === 'lab'), 'Category filter "lab" strictly returns lab items');

    // Sort by price
    const sortRes = await fetch(`${API_BASE}/products?sort=price-asc`);
    const sortData = await sortRes.json();
    assert(sortData.data[0].price <= sortData.data[1].price, 'Price ascending sort operates correctly');

    // Single product detail
    const sampleProduct = allProdData.data[0];
    const singleProdRes = await fetch(`${API_BASE}/products/${sampleProduct.id || sampleProduct._id}`);
    assert(singleProdRes.status === 200, `Single product API returned details for ${sampleProduct.title}`);

    // 6. Shops Directory
    console.log('\n--- Step 6: Campus Shops Directory ---');
    const shopsRes = await fetch(`${API_BASE}/shops`);
    const shopsData = await shopsRes.json();
    assert(shopsRes.status === 200 && shopsData.data.length >= 5, `Fetched ${shopsData.data.length} campus verified stores`);

    const singleShopRes = await fetch(`${API_BASE}/shops/vidya-books`);
    const singleShopData = await singleShopRes.json();
    assert(singleShopRes.status === 200, `Retrieved shop details for: ${singleShopData.data.name}`);

    // 7. Cart Persistence in MongoDB
    console.log('\n--- Step 7: Shopping Cart Persistence ---');
    const targetProduct1 = allProdData.data[0];
    const targetProduct2 = allProdData.data[1];

    const cartPayload = {
      items: [
        { product: targetProduct1._id, quantity: 2 },
        { product: targetProduct2._id, quantity: 1 }
      ]
    };

    const saveCartRes = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify(cartPayload)
    });
    assert(saveCartRes.status === 200, 'Cart items successfully saved to MongoDB');

    const getCartRes = await fetch(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const getCartData = await getCartRes.json();
    assert(getCartRes.status === 200, 'Persistent cart retrieved from MongoDB');
    const cartItems = Array.isArray(getCartData.data) ? getCartData.data : (getCartData.items || []);
    assert(cartItems.length === 2, 'Cart contains exactly 2 saved product entries');
    assert(cartItems[0].quantity === 2, 'Cart item quantity is 2 as persisted');

    // 8. Wishlist Persistence in MongoDB
    console.log('\n--- Step 8: Wishlist Persistence & Toggle ---');
    const wishProductId = targetProduct1.id || targetProduct1._id;
    const wishRes1 = await fetch(`${API_BASE}/wishlist/${wishProductId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const wishData1 = await wishRes1.json();
    assert(wishRes1.status === 200 && wishData1.isSaved === true, 'Product successfully added to student wishlist');

    const wishRes2 = await fetch(`${API_BASE}/wishlist/${wishProductId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const wishData2 = await wishRes2.json();
    assert(wishRes2.status === 200 && wishData2.isSaved === false, 'Product toggled off / removed from wishlist');

    // Re-add to test persistent presence
    await fetch(`${API_BASE}/wishlist/${wishProductId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const getWishRes = await fetch(`${API_BASE}/wishlist`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const getWishData = await getWishRes.json();
    const wishListArray = Array.isArray(getWishData.data) ? getWishData.data : (getWishData.wishlist || []);
    assert(
      wishListArray.some(it => (it._id || it.id || it).toString() === wishProductId.toString()),
      'Wishlist GET returns persisted item array'
    );

    // 9. Order Creation (Demo Checkout)
    console.log('\n--- Step 9: Demo Checkout & Order Placement ---');
    const orderPayload = {
      studentName: newStudent.name,
      rollNumber: newStudent.rollNumber,
      phone: newStudent.phone,
      destination: 'Main Campus Xerox & Stationery Counter',
      timeSlot: 'Lunch Break (1:15 PM - 2:00 PM)',
      deliveryType: 'pickup',
      paymentMethod: 'Pay at Desk (Cash / UPI)',
      items: [
        {
          productId: targetProduct1._id,
          title: targetProduct1.title,
          price: targetProduct1.price,
          quantity: 2,
          image: targetProduct1.image,
          shopName: targetProduct1.shopName
        }
      ],
      total: targetProduct1.price * 2,
      discount: 40
    };

    const createOrderRes = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify(orderPayload)
    });
    const createOrderData = await createOrderRes.json();
    assert(createOrderRes.status === 201, 'Student order created with status 201 Created');
    const placedOrderId = createOrderData.data.orderId;
    assert(Boolean(placedOrderId), `Generated order ID: ${placedOrderId}`);
    assert(createOrderData.data.status === 'Received', 'Initial order status is "Received"');

    // Verify cart was automatically cleared on order placement
    const cartAfterOrderRes = await fetch(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const cartAfterOrderData = await cartAfterOrderRes.json();
    const cartAfterItems = Array.isArray(cartAfterOrderData.data) ? cartAfterOrderData.data : (cartAfterOrderData.items || []);
    assert(cartAfterItems.length === 0, 'Student cart automatically cleared after order placement');

    // 10. Student Order History
    console.log('\n--- Step 10: Student Order History ---');
    const myOrdersRes = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const myOrdersData = await myOrdersRes.json();
    assert(myOrdersRes.status === 200, 'Student order history fetched successfully');
    const matchedOrder = myOrdersData.data.find(o => o.orderId === placedOrderId);
    assert(Boolean(matchedOrder), `Placed order ${placedOrderId} found in student order history`);
    assert(matchedOrder.studentName === newStudent.name, 'Order record has matching student name');

    // 11. Admin Authentication & Management
    console.log('\n--- Step 11: Admin Login & Order Queue Management ---');
    const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@aifinds.edu', password: 'Admin@123' })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, 'Admin login succeeded');
    const adminToken = adminLoginData.token;
    assert(adminLoginData.user.role === 'admin', 'Admin role verified');

    // Admin view all orders
    const allOrdersRes = await fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const allOrdersData = await allOrdersRes.json();
    assert(allOrdersRes.status === 200 && allOrdersData.count > 0, `Admin successfully fetched all ${allOrdersData.count} campus orders`);

    // Admin filter orders by status
    const filterOrdersRes = await fetch(`${API_BASE}/orders?status=Received`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(filterOrdersRes.status === 200, 'Admin filtered orders by status "Received"');

    // Status transition: Received -> Processing -> Ready for Pickup -> Completed
    console.log('\n--- Step 12: Admin Order Lifecycle Status Transitions ---');
    const statusSteps = ['Processing', 'Ready for Pickup', 'Completed'];

    for (const status of statusSteps) {
      const updateRes = await fetch(`${API_BASE}/orders/${placedOrderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      const updateData = await updateRes.json();
      assert(updateRes.status === 200, `Order status transition to "${status}" succeeded`);
      assert(updateData.data.status === status, `Order data confirms updated status "${status}"`);
    }

    // Verify student sees the updated status
    const studentCheckRes = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const studentCheckData = await studentCheckRes.json();
    const updatedStudentOrder = studentCheckData.data.find(o => o.orderId === placedOrderId);
    assert(updatedStudentOrder.status === 'Completed', 'Student order history reflects status transition "Completed"');

    // 12. Admin Product Creation
    console.log('\n--- Step 13: Admin Product Catalog Management ---');
    const newProductPayload = {
      title: `Advanced Microcontroller Lab Kit ${timestamp.toString().slice(-4)}`,
      category: 'lab',
      price: 850,
      originalPrice: 1200,
      discount: 29,
      shopName: 'Apex Engineering & Lab Depot',
      shopId: 'apex-lab',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      description: 'Pre-assembled kit for 3rd semester digital electronics and embedded systems lab.',
      condition: 'Brand New',
      specs: ['8051 & ARM boards', 'Breadboard + Connecting jumpers', 'Lab manual included'],
      inStock: true
    };

    const createProdRes = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(newProductPayload)
    });
    await createProdRes.json();
    assert(createProdRes.status === 201, `Admin successfully added new product: "${newProductPayload.title}"`);

    // Verify product is searchable in catalog by students
    const verifyProdRes = await fetch(`${API_BASE}/products?search=Microcontroller`);
    const verifyProdData = await verifyProdRes.json();
    assert(
      verifyProdData.data.some(p => p.title.includes(newProductPayload.title)),
      'Newly created admin product is discoverable by students via public search'
    );

    console.log('\n======================================================');
    console.log(`🎉 ALL TESTS PASSED: ${passed}/${total} assertions (100%)`);
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌ TEST RUN ABORTED DUE TO ERROR:', err);
    process.exit(1);
  }
}

runFullSystemTest();
