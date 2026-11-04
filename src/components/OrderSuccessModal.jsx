import React from 'react';
import {
  CheckCircle2,
  X,
  Package,
  MapPin,
  Clock,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function OrderSuccessModal({ order, onClose, onNavigateExplore }) {
  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container order-success-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="success-icon-container">
          <div className="success-check-bubble">
            <CheckCircle2 size={46} className="text-forest" />
          </div>
          <Sparkles size={20} className="success-sparkle top" />
          <Sparkles size={16} className="success-sparkle bottom" />
        </div>

        <h2 id="success-modal-title" className="success-title">
          Campus Order Confirmed!
        </h2>
        <p className="success-subtitle">
          Your order has been transmitted to the local campus shop counter. Keep your Order ID ready when picking up.
        </p>

        {/* Order Receipt Card */}
        <div className="receipt-card">
          <div className="receipt-header-row">
            <div>
              <span className="receipt-id-label">Order ID</span>
              <span className="receipt-id-val">{order.orderId}</span>
            </div>
            <div className="text-right">
              <span className="receipt-date-label">Order Timestamp</span>
              <span className="receipt-date-val">{order.date}</span>
            </div>
          </div>

          <div className="receipt-info-grid">
            <div className="receipt-info-item">
              <User size={15} className="receipt-icon" />
              <div>
                <span className="label">Student</span>
                <span className="val">
                  {order.studentName} ({order.rollNumber})
                </span>
              </div>
            </div>

            <div className="receipt-info-item">
              <MapPin size={15} className="receipt-icon" />
              <div>
                <span className="label">Pickup / Drop Point</span>
                <span className="val">{order.destination}</span>
              </div>
            </div>

            <div className="receipt-info-item">
              <Clock size={15} className="receipt-icon" />
              <div>
                <span className="label">Ready Slot</span>
                <span className="val">{order.timeSlot}</span>
              </div>
            </div>

            <div className="receipt-info-item">
              <Package size={15} className="receipt-icon" />
              <div>
                <span className="label">Payment Mode</span>
                <span className="val">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="receipt-items-list">
            <span className="items-header">Ordered Essentials ({order.items.length})</span>
            {order.items.map(({ product, quantity }) => (
              <div key={product.id} className="receipt-item-row">
                <span className="item-name">
                  {quantity}x {product.title}
                </span>
                <span className="item-cost">₹{product.price * quantity}</span>
              </div>
            ))}
          </div>

          <div className="receipt-total-row">
            <span>Total Payable Amount</span>
            <div className="total-display">
              <span className="curr">₹</span>
              <span className="amt">{order.total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions-row">
          <button
            type="button"
            className="btn-continue-shopping"
            onClick={() => {
              onClose();
              onNavigateExplore();
            }}
          >
            <span>Explore More Essentials</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
