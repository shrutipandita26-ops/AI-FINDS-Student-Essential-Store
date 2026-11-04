import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  User,
  CreditCard,
  Sparkles
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  checkoutData,
  currentUser,
  onOrderSuccess
}) {
  const [studentName, setStudentName] = useState(currentUser?.name || 'Rahul Sharma');
  const [rollNumber, setRollNumber] = useState(currentUser?.rollNumber || '23BCSE104');
  const [phone, setPhone] = useState(currentUser?.phone || '9876543210');
  const [deliveryType, setDeliveryType] = useState('pickup'); // 'pickup' | 'hostel'
  const [hostelName, setHostelName] = useState('CV Raman Hostel Block B');
  const [roomNumber, setRoomNumber] = useState('314');
  const [timeSlot, setTimeSlot] = useState('Next 15-30 Mins (Ready Queue)');
  const [paymentMethod, setPaymentMethod] = useState('counter'); // 'counter' | 'upi' | 'card'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !checkoutData) return null;

  const { finalTotal, items, discountAmount } = checkoutData;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = {
        orderId: `AIF-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        studentName,
        rollNumber,
        phone,
        deliveryType,
        destination:
          deliveryType === 'pickup'
            ? 'Campus Shop Counters'
            : `${hostelName}, Room ${roomNumber}`,
        timeSlot,
        paymentMethod:
          paymentMethod === 'counter'
            ? 'Pay at Shop Counter (Cash/UPI)'
            : paymentMethod === 'upi'
            ? 'UPI on Delivery'
            : 'Demo Student Card',
        items,
        total: finalTotal,
        discount: discountAmount
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container checkout-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close checkout">
          <X size={20} />
        </button>

        <div className="checkout-modal-header">
          <div className="checkout-badge">
            <Sparkles size={16} />
            <span>Campus Fast Checkout (Demo)</span>
          </div>
          <h2 id="checkout-modal-title" className="checkout-title">
            Complete Your Student Order
          </h2>
          <p className="checkout-subtitle">
            No upfront online transaction required. Confirm your order and inspect items at pickup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form-grid">
          {/* Left Form: Details */}
          <div className="checkout-details-column">
            {/* Student info */}
            <div className="checkout-card-section">
              <h3 className="section-label">
                <User size={16} />
                <span>Student Information</span>
              </h3>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="input-label">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Roll / Reg Number *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 23BCSE104"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Contact Mobile / WhatsApp *</label>
                <div className="input-with-prefix">
                  <span className="prefix">+91</span>
                  <input
                    type="tel"
                    required
                    className="form-input has-prefix"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            {/* Delivery vs Pickup */}
            <div className="checkout-card-section">
              <h3 className="section-label">
                <MapPin size={16} />
                <span>Pickup / Delivery Option</span>
              </h3>

              <div className="delivery-option-cards">
                <label
                  className={`delivery-option-card ${
                    deliveryType === 'pickup' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'pickup'}
                    onChange={() => setDeliveryType('pickup')}
                  />
                  <div className="opt-card-body">
                    <span className="opt-heading">Campus Shop Self-Pickup</span>
                    <span className="opt-detail">
                      Collect at respective shop counters (Fastest • Ready in 15 mins)
                    </span>
                    <span className="opt-tag free">FREE (₹0)</span>
                  </div>
                </label>

                <label
                  className={`delivery-option-card ${
                    deliveryType === 'hostel' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'hostel'}
                    onChange={() => setDeliveryType('hostel')}
                  />
                  <div className="opt-card-body">
                    <span className="opt-heading">Hostel Room Delivery</span>
                    <span className="opt-detail">
                      Hand-delivered to your hostel gate/room by campus student runner
                    </span>
                    <span className="opt-tag free">FREE for Students</span>
                  </div>
                </label>
              </div>

              {deliveryType === 'hostel' && (
                <div className="hostel-fields-grid">
                  <div className="form-group">
                    <label className="input-label">Hostel Name &amp; Block *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={hostelName}
                      onChange={(e) => setHostelName(e.target.value)}
                      placeholder="e.g. CV Raman Hostel Block B"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Room Number *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g. 314"
                    />
                  </div>
                </div>
              )}

              <div className="form-group margin-top-md">
                <label className="input-label">Preferred Pickup / Delivery Slot</label>
                <select
                  className="form-select"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="Next 15-30 Mins (Ready Queue)">
                    Next 15–30 Mins (Ready Queue)
                  </option>
                  <option value="Lunch Break (1:00 PM – 2:30 PM)">
                    Lunch Break (1:00 PM – 2:30 PM)
                  </option>
                  <option value="Evening (5:00 PM – 7:00 PM)">
                    Evening (5:00 PM – 7:00 PM)
                  </option>
                  <option value="Night Study Hours (8:30 PM – 10:00 PM)">
                    Night Study Hours (8:30 PM – 10:00 PM)
                  </option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-card-section">
              <h3 className="section-label">
                <CreditCard size={16} />
                <span>Demo Payment Preference</span>
              </h3>

              <div className="payment-options-grid">
                <label
                  className={`payment-opt-pill ${
                    paymentMethod === 'counter' ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'counter'}
                    onChange={() => setPaymentMethod('counter')}
                  />
                  <span>Pay at Shop Counter (Cash / UPI)</span>
                </label>

                <label
                  className={`payment-opt-pill ${
                    paymentMethod === 'upi' ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <span>UPI on Delivery (GPay / PhonePe)</span>
                </label>

                <label
                  className={`payment-opt-pill ${
                    paymentMethod === 'card' ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <span>Demo Student ID Wallet</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="checkout-summary-column">
            <div className="order-summary-box">
              <h3 className="summary-title">Order Items ({items.length})</h3>

              <div className="summary-items-scroll">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="summary-item-line">
                    <div className="summary-item-left">
                      <span className="item-qty-badge">{quantity}x</span>
                      <span className="item-name" title={product.title}>
                        {product.title}
                      </span>
                    </div>
                    <span className="item-price">₹{product.price * quantity}</span>
                  </div>
                ))}
              </div>

              <div className="summary-calc-list">
                <div className="calc-row">
                  <span>Subtotal</span>
                  <span>₹{checkoutData.subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="calc-row text-orange">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="calc-row">
                  <span>Campus Service Fee</span>
                  <span className="text-green font-semibold">FREE (₹0)</span>
                </div>

                <div className="calc-divider" />

                <div className="calc-row total-calc-row">
                  <span>Total Amount</span>
                  <div className="total-val">
                    <span className="curr">₹</span>
                    <span className="amt">{finalTotal}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn-confirm-order"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Processing Demo Order...</span>
                ) : (
                  <span>Confirm &amp; Place Order • ₹{finalTotal}</span>
                )}
              </button>

              <div className="checkout-trust-notice">
                <ShieldCheck size={16} className="text-green" />
                <span>
                  Demo Project Mode: No real financial charges are made. Your order will be stored locally.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
