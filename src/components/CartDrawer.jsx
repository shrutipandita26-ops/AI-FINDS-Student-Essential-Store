import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Store
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onNavigateExplore
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Calculate Subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Apply Coupon
  let discountAmount = 0;
  if (appliedCoupon === 'CAMPUS10') {
    discountAmount = Math.round(subtotal * 0.1);
  } else if (appliedCoupon === 'STUDENT50') {
    discountAmount = Math.min(50, subtotal);
  }

  const deliveryFee = 0; // Free for campus students!
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'CAMPUS10') {
      setAppliedCoupon('CAMPUS10');
      setCouponError('');
    } else if (code === 'STUDENT50') {
      setAppliedCoupon('STUDENT50');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try CAMPUS10 or STUDENT50');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-wrap">
            <ShoppingBag size={22} className="text-green" />
            <h2 id="cart-drawer-title" className="cart-drawer-title">
              Campus Cart
            </h2>
            <span className="cart-count-badge">
              {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items
            </span>
          </div>

          <div className="cart-header-actions">
            {cartItems.length > 0 && (
              <button
                type="button"
                className="clear-cart-btn"
                onClick={onClearCart}
                title="Remove all items from cart"
              >
                Clear all
              </button>
            )}
            <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <div className="cart-empty-icon-wrap">
              <ShoppingBag size={48} />
            </div>
            <h3 className="empty-title">Your Campus Cart is Empty</h3>
            <p className="empty-desc">
              Discover textbooks, stationery, lab coats, handwritten study notes, and express printing services.
            </p>
            <button
              type="button"
              className="btn-empty-browse"
              onClick={() => {
                onClose();
                onNavigateExplore();
              }}
            >
              <span>Explore Student Essentials</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="cart-drawer-content">
            {/* Items List */}
            <div className="cart-items-list">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item-card">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="cart-item-thumb"
                  />

                  <div className="cart-item-info">
                    <div className="cart-item-shop-badge">
                      <Store size={12} />
                      <span>{product.shopName}</span>
                    </div>

                    <h4 className="cart-item-title" title={product.title}>
                      {product.title}
                    </h4>

                    <div className="cart-item-price-row">
                      <span className="cart-item-unit-price">
                        ₹{product.price} <span className="each-label">/ unit</span>
                      </span>
                      <span className="cart-item-line-total">
                        Total: <strong>₹{product.price * quantity}</strong>
                      </span>
                    </div>

                    <div className="cart-item-controls-row">
                      {/* Stepper */}
                      <div className="cart-stepper">
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onUpdateQty(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="stepper-val">{quantity}</span>
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onUpdateQty(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label="Remove item"
                        title="Remove from cart"
                      >
                        <Trash2 size={15} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="cart-promo-box">
              {appliedCoupon ? (
                <div className="applied-coupon-row">
                  <div className="coupon-tag-applied">
                    <Tag size={15} />
                    <span>Coupon <strong>{appliedCoupon}</strong> Applied (-₹{discountAmount})</span>
                  </div>
                  <button className="btn-remove-coupon" onClick={removeCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <form className="coupon-form" onSubmit={handleApplyCoupon}>
                  <div className="coupon-input-wrap">
                    <Tag size={16} className="coupon-icon" />
                    <input
                      type="text"
                      placeholder="Enter code (CAMPUS10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-apply-coupon">
                    Apply
                  </button>
                </form>
              )}

              {couponError && <p className="coupon-error-msg">{couponError}</p>}

              {!appliedCoupon && (
                <div className="coupon-hint-pills">
                  <button
                    type="button"
                    className="hint-pill"
                    onClick={() => {
                      setCouponCode('CAMPUS10');
                      setAppliedCoupon('CAMPUS10');
                      setCouponError('');
                    }}
                  >
                    Use <strong>CAMPUS10</strong> for 10% off
                  </button>
                  <button
                    type="button"
                    className="hint-pill"
                    onClick={() => {
                      setCouponCode('STUDENT50');
                      setAppliedCoupon('STUDENT50');
                      setCouponError('');
                    }}
                  >
                    Use <strong>STUDENT50</strong> for ₹50 off
                  </button>
                </div>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="cart-summary-section">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Student Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="summary-row">
                <span className="flex-align">
                  Campus Pickup / Delivery
                  <span className="free-badge">FREE</span>
                </span>
                <span className="text-green font-semibold">₹0</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row grand-total-row">
                <div>
                  <span className="grand-total-label">Total to Pay</span>
                  <span className="tax-inclusive-note">All taxes included</span>
                </div>
                <div className="grand-total-amt">
                  <span className="curr">₹</span>
                  <span className="amt">{finalTotal}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-checkout-proceed"
                onClick={() => {
                  onProceedToCheckout({
                    subtotal,
                    discountAmount,
                    appliedCoupon,
                    finalTotal,
                    items: cartItems
                  });
                }}
              >
                <span>Proceed to Campus Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div className="cart-trust-footer">
                <ShieldCheck size={15} className="text-green" />
                <span>Pay at shop counter or via UPI upon pickup / hostel drop</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
