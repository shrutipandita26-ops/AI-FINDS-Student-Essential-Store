async function runTests() {
  const baseURL = 'http://localhost:5000/api';
  console.log('--- Starting Comprehensive AI FINDS API Tests ---');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Health Check
  await test('GET /health (Server Health & DB)', async () => {
    const res = await fetch(`${baseURL}/health`);
    const data = await res.json();
    if (!res.ok || data.status !== 'ok') throw new Error(`Status not ok: ${res.status}`);
  });

  // 2. Categories
  await test('GET /categories (Fetch all categories)', async () => {
    const res = await fetch(`${baseURL}/categories`);
    const data = await res.json();
    if (!res.ok || !data.success || !Array.isArray(data.data) || data.data.length < 5) {
      throw new Error(`Categories count invalid: ${data.data?.length}`);
    }
  });

  // 3. Shops
  await test('GET /shops (Fetch campus shops)', async () => {
    const res = await fetch(`${baseURL}/shops`);
    const data = await res.json();
    if (!res.ok || !data.success || !Array.isArray(data.data) || data.data.length < 5) {
      throw new Error(`Shops count invalid: ${data.data?.length}`);
    }
  });

  // 4. Products with Filters
  let sampleProductId = '';
  await test('GET /products (Fetch catalog and query filter)', async () => {
    const res = await fetch(`${baseURL}/products?category=books`);
    const data = await res.json();
    if (!res.ok || !data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Products failed or empty: ${data.data?.length}`);
    }
    sampleProductId = data.data[0].productId || data.data[0]._id;
  });

  // 5. Student Login
  let studentToken = '';
  await test('POST /auth/login (Student Authentication)', async () => {
    const res = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@aifinds.edu',
        password: 'Student@123'
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.token) {
      throw new Error(`Login failed: ${data.message}`);
    }
    studentToken = data.token;
  });

  // 6. Current User Profile
  await test('GET /auth/me (Protected Route with JWT)', async () => {
    const res = await fetch(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success || data.user.email !== 'student@aifinds.edu') {
      throw new Error(`Profile check failed: ${data.message}`);
    }
  });

  // 7. Cart Persistence in DB
  await test('POST /cart & GET /cart (MongoDB Cart Persistence)', async () => {
    const addRes = await fetch(`${baseURL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ productId: sampleProductId, quantity: 2 })
    });
    const addData = await addRes.json();
    if (!addRes.ok || !addData.success) throw new Error(`Add to cart failed: ${addData.message}`);

    const getRes = await fetch(`${baseURL}/cart`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const getData = await getRes.json();
    if (!getRes.ok || !getData.success || getData.data.length === 0) {
      throw new Error(`Get cart failed or empty`);
    }
  });

  // 8. Wishlist Persistence in DB
  await test('POST /wishlist/:id (MongoDB Wishlist Toggle)', async () => {
    const res = await fetch(`${baseURL}/wishlist/${sampleProductId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(`Wishlist toggle failed: ${data.message}`);
  });

  // 9. Order Creation
  let createdOrderId = '';
  await test('POST /orders (Create Student Campus Order)', async () => {
    const res = await fetch(`${baseURL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        studentName: 'Rahul Sharma',
        rollNumber: '23BCSE104',
        phone: '9876543210',
        deliveryType: 'pickup',
        destination: 'Campus Xerox & Tech Point',
        timeSlot: 'Next 15-30 Mins',
        paymentMethod: 'Pay at Counter',
        items: [
          {
            productId: sampleProductId,
            title: 'Test Engineering Textbook',
            price: 499,
            quantity: 1,
            shopName: 'Vidya Book House'
          }
        ],
        total: 499,
        discount: 0
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.data.orderId) {
      throw new Error(`Order creation failed: ${data.message}`);
    }
    createdOrderId = data.data.orderId;
  });

  // 10. Student Order History
  await test('GET /orders/my-orders (Fetch Student Order History)', async () => {
    const res = await fetch(`${baseURL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Order history check failed: ${data.message}`);
    }
  });

  // 11. Admin Login
  let adminToken = '';
  await test('POST /auth/login (Admin Authentication)', async () => {
    const res = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@aifinds.edu',
        password: 'Admin@123'
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success || data.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${data.message}`);
    }
    adminToken = data.token;
  });

  // 12. Admin View All Orders
  await test('GET /orders (Admin All Orders Management)', async () => {
    const res = await fetch(`${baseURL}/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success || data.count === 0) {
      throw new Error(`Admin orders fetch failed`);
    }
  });

  // 13. Admin Update Order Status
  await test('PUT /orders/:id/status (Admin Status Transition)', async () => {
    const res = await fetch(`${baseURL}/orders/${createdOrderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Ready for Pickup' })
    });
    const data = await res.json();
    if (!res.ok || !data.success || data.data.status !== 'Ready for Pickup') {
      throw new Error(`Status update failed: ${data.message}`);
    }
  });

  console.log(`\n====================================================`);
  console.log(`🏁 API Test Results: ${passed}/${total} Tests Passed (${Math.round((passed/total)*100)}%)`);
  console.log(`====================================================`);
  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
