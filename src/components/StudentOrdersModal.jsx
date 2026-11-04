import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { ordersAPI } from '../services/api';

export default function StudentOrdersModal({ isOpen, onClose, onNavigateExplore }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ordersAPI.getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    ordersAPI.getMyOrders()
      .then((res) => {
        if (active) {
          setOrders(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Failed to load orders.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container orders-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="orders-modal-title"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close orders modal">
          <X size={20} />
        </button>

        <div className="orders-modal-header">
          <div className="orders-badge">
            <Package size={16} />
            <span>Campus Order History</span>
          </div>
          <h2 id="orders-modal-title" className="orders-title">
            My Past Orders
          </h2>
          <p className="orders-subtitle">
            Track pickup readiness at campus shops and review past semester receipts.
          </p>
        </div>

        {loading ? (
          <div className="orders-loading-state">
            <Clock size={32} className="spinning-icon" />
            <p>Loading your campus orders...</p>
          </div>
        ) : error ? (
          <div className="orders-error-state">
            <p>{error}</p>
            <button className="btn-retry-orders" onClick={fetchOrders}>
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty-state">
            <ShoppingBag size={48} className="empty-icon" />
            <h3>No Orders Placed Yet</h3>
            <p>Your confirmed campus textbook, stationery, and printing orders will appear here.</p>
            <button
              className="btn-browse-empty"
              onClick={() => {
                onClose();
                onNavigateExplore();
              }}
            >
              <span>Explore Essentials</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="orders-list-scroll">
            {orders.map((ord) => (
              <div key={ord.orderId || ord._id} className="order-history-card">
                <div className="order-card-top-row">
                  <div>
                    <span className="order-id-chip">{ord.orderId}</span>
                    <span className="order-date-text">
                      <Calendar size={13} />
                      {ord.date}
                    </span>
                  </div>

                  <span className={`status-pill ${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CheckCircle2 size={13} />
                    {ord.status}
                  </span>
                </div>

                <div className="order-card-meta-grid">
                  <div className="meta-item">
                    <MapPin size={14} className="text-forest" />
                    <span>{ord.destination}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={14} className="text-orange" />
                    <span>{ord.timeSlot}</span>
                  </div>
                </div>

                <div className="order-card-items-box">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="order-item-inline">
                      <span className="item-name">
                        <strong>{item.quantity}x</strong> {item.title}
                      </span>
                      <span className="item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card-bottom-row">
                  <span className="payment-note">Mode: {ord.paymentMethod}</span>
                  <div className="total-display">
                    <span className="total-label">Total:</span>
                    <span className="total-val">₹{ord.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
