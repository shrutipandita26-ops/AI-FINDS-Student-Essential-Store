const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeader() {
  const token = localStorage.getItem('ai_finds_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const authAPI = {
  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  }
};

export const productsAPI = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const url = `${API_BASE_URL}/products${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getById(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(res);
  },

  async create(productData) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  async update(id, productData) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};

export const categoriesAPI = {
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(res);
  }
};

export const shopsAPI = {
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/shops`);
    return handleResponse(res);
  }
};

export const cartAPI = {
  async get() {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async add(productId, quantity = 1) {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ productId, quantity })
    });
    return handleResponse(res);
  },

  async update(productId, quantity) {
    const res = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ quantity })
    });
    return handleResponse(res);
  },

  async remove(productId) {
    const res = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async clear() {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};

export const wishlistAPI = {
  async get() {
    const res = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async toggle(productId) {
    const res = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async remove(productId) {
    const res = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};

export const ordersAPI = {
  async create(orderData) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(orderData)
    });
    return handleResponse(res);
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getAll(status = '') {
    const url = `${API_BASE_URL}/orders${status ? `?status=${status}` : ''}`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async updateStatus(orderId, status) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  }
};
