import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ShieldCheck,
  Package,
  Plus,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react';
import { ordersAPI, productsAPI } from '../services/api';

export default function AdminDashboardModal({
  isOpen,
  onClose,
  showToast,
  onProductCreatedOrDeleted
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('books');
  const [newPrice, setNewPrice] = useState(299);
  const [newOrigPrice, setNewOrigPrice] = useState(450);
  const [newShopName, setNewShopName] = useState('Vidya Book House & Stationery');
  const [newShopId, setNewShopId] = useState('vidya-books');
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  );
  const [newDesc, setNewDesc] = useState('');
  const [creatingProduct, setCreatingProduct] = useState(false);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await ordersAPI.getAll(statusFilter);
      setOrders(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch admin orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    ordersAPI.getAll(statusFilter)
      .then((res) => {
        if (active) {
          setOrders(res.data || []);
          setOrdersLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          showToast(err.message || 'Failed to fetch admin orders');
          setOrdersLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen, statusFilter, showToast]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      showToast(`Order ${orderId} marked as "${newStatus}"`);
      fetchOrders();
    } catch (err) {
      showToast(err.message || 'Failed to update order status');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setCreatingProduct(true);
    try {
      const productPayload = {
        title: newTitle.trim(),
        category: newCategory,
        price: Number(newPrice),
        originalPrice: Number(newOrigPrice),
        discount: Math.round(((newOrigPrice - newPrice) / newOrigPrice) * 100),
        shopName: newShopName,
        shopId: newShopId,
        image: newImage.trim(),
        description: newDesc.trim() || 'Official college essential stocked in campus store.',
        condition: 'Brand New',
        specs: ['100% University Verified', 'Immediate Campus Pickup'],
        inStock: true
      };

      await productsAPI.create(productPayload);
      showToast(`Created new product: "${newTitle}"!`);
      setNewTitle('');
      setNewDesc('');
      if (onProductCreatedOrDeleted) onProductCreatedOrDeleted();
    } catch (err) {
      showToast(err.message || 'Failed to create product');
    } finally {
      setCreatingProduct(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container admin-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close admin dashboard">
          <X size={20} />
        </button>

        <div className="admin-modal-header">
          <div className="admin-badge">
            <ShieldCheck size={16} />
            <span>Campus Admin Control Panel</span>
          </div>
          <h2 id="admin-modal-title" className="admin-title">
            AI FINDS Marketplace Management
          </h2>
          <p className="admin-subtitle">
            Manage incoming orders from campus shop desks and update the essential products catalog.
          </p>

          <div className="admin-tabs-row">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={16} />
              <span>Campus Orders Queue ({orders.length})</span>
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Plus size={16} />
              <span>Add New Catalog Product</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content">
            <div className="admin-filter-bar">
              <div className="filter-group">
                <Filter size={15} />
                <span>Filter by status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="">All Statuses</option>
                  <option value="Received">Received</option>
                  <option value="Processing">Processing</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button type="button" className="admin-refresh-btn" onClick={fetchOrders}>
                <RefreshCw size={14} />
                <span>Refresh Queue</span>
              </button>
            </div>

            {ordersLoading ? (
              <div className="admin-loading-state">
                <Clock size={32} className="spinning-icon" />
                <p>Loading campus orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="admin-empty-state">
                <p>No orders match the selected status.</p>
              </div>
            ) : (
              <div className="admin-orders-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Student Info</th>
                      <th>Destination / Slot</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status Transition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.orderId || ord._id}>
                        <td>
                          <strong>{ord.orderId}</strong>
                          <span className="table-sub-date">{ord.date}</span>
                        </td>
                        <td>
                          <div className="table-user-cell">
                            <span>{ord.studentName}</span>
                            <span className="table-roll">{ord.rollNumber}</span>
                            <span className="table-phone">{ord.phone}</span>
                          </div>
                        </td>
                        <td>
                          <span className="dest-text">{ord.destination}</span>
                          <span className="slot-text">{ord.timeSlot}</span>
                        </td>
                        <td>
                          <span className="items-count-badge">
                            {ord.items.reduce((s, it) => s + it.quantity, 0)} items
                          </span>
                        </td>
                        <td>
                          <strong className="table-price">₹{ord.total}</strong>
                        </td>
                        <td>
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                            className={`status-select ${ord.status.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <option value="Received">Received</option>
                            <option value="Processing">Processing</option>
                            <option value="Ready for Pickup">Ready for Pickup</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Add New Product */}
        {activeTab === 'products' && (
          <div className="admin-tab-content">
            <form onSubmit={handleCreateProduct} className="admin-product-form">
              <div className="form-row-two">
                <div className="form-group">
                  <label className="input-label">Product Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Microprocessors 8086 Manual"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Category *</label>
                  <select
                    className="form-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="books">Academic Books</option>
                    <option value="stationery">Notebooks &amp; Stationery</option>
                    <option value="lab">Lab &amp; Workshop</option>
                    <option value="notes">Study Notes &amp; PYQs</option>
                    <option value="printing">Printing &amp; Xerox</option>
                    <option value="gadgets">Hostel &amp; Electronics</option>
                  </select>
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="input-label">Price in ₹ *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    className="form-input"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Original MRP in ₹</label>
                  <input
                    type="number"
                    min={0}
                    className="form-input"
                    value={newOrigPrice}
                    onChange={(e) => setNewOrigPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="input-label">Fulfilling Shop *</label>
                  <select
                    className="form-select"
                    value={newShopId}
                    onChange={(e) => {
                      setNewShopId(e.target.value);
                      const shopNames = {
                        'campus-xerox': 'Campus Xerox & Tech Point',
                        'vidya-books': 'Vidya Book House & Stationery',
                        'apex-lab': 'Apex Engineering & Lab Depot',
                        'scholars-corner': "Scholar's Corner Notes & Binders",
                        'hostel-mart': 'Hostel Mart & Quick Supplies'
                      };
                      setNewShopName(shopNames[e.target.value] || 'Campus Shop');
                    }}
                  >
                    <option value="vidya-books">Vidya Book House &amp; Stationery</option>
                    <option value="campus-xerox">Campus Xerox &amp; Tech Point</option>
                    <option value="apex-lab">Apex Engineering &amp; Lab Depot</option>
                    <option value="scholars-corner">Scholar's Corner Notes &amp; Binders</option>
                    <option value="hostel-mart">Hostel Mart &amp; Quick Supplies</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label">Image URL *</label>
                  <input
                    type="url"
                    required
                    className="form-input"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Description *</label>
                <textarea
                  className="form-input"
                  rows={3}
                  required
                  placeholder="Explain syllabus coverage, condition, and course utility..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-create-product-submit"
                disabled={creatingProduct}
              >
                <Plus size={16} />
                <span>{creatingProduct ? 'Saving to Database...' : 'Add Product to Live MongoDB Catalog'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
