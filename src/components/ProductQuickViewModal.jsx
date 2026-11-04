import React, { useState } from 'react';
import {
  X,
  Star,
  Store,
  ShoppingCart,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Minus,
  Clock
} from 'lucide-react';

export default function ProductQuickViewModal({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) {
  const [selectedQty, setSelectedQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const categoryFallbacks = {
    books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    stationery: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    lab: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
    notes: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    printing: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    gadgets: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
  };

  const fallbackUrl =
    categoryFallbacks[product.category] || categoryFallbacks.books;

  const handleAdd = () => {
    onAddToCart(product, selectedQty);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container quick-view-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="quick-view-grid">
          {/* Left: Image Column */}
          <div className="quick-view-image-col">
            <div className="quick-view-img-frame">
              <img
                src={imgError ? fallbackUrl : product.image}
                alt={product.title}
                onError={() => setImgError(true)}
              />
              <span className="product-condition-badge top-left">{product.condition}</span>
              {product.discount > 0 && (
                <span className="product-discount-badge top-right">{product.discount}% OFF</span>
              )}
            </div>

            <div className="campus-guarantee-box">
              <div className="guarantee-item">
                <CheckCircle2 size={16} className="text-green" />
                <span>Verified by Campus Shop</span>
              </div>
              <div className="guarantee-item">
                <ShieldCheck size={16} className="text-orange" />
                <span>Inspect before payment at pickup</span>
              </div>
            </div>
          </div>

          {/* Right: Details Column */}
          <div className="quick-view-details-col">
            {/* Shop info banner */}
            <div className="shop-ref-badge">
              <Store size={14} />
              <span>Available at: <strong>{product.shopName}</strong></span>
            </div>

            <h2 id="quick-view-title" className="quick-view-title">
              {product.title}
            </h2>

            {/* Rating Row */}
            <div className="quick-view-rating-row">
              <div className="rating-pill">
                <Star size={14} fill="currentColor" />
                <span>{product.rating}</span>
              </div>
              <span className="reviews-text">{product.reviews} student reviews</span>
              <span className="bullet-sep">•</span>
              <span className="stock-tag in-stock">In Stock for Immediate Pickup</span>
            </div>

            {/* Price section */}
            <div className="quick-view-price-section">
              <div className="main-price">
                <span className="curr">₹</span>
                <span className="amt">{product.price}</span>
              </div>
              {product.originalPrice > product.price && (
                <div className="discount-info">
                  <span className="orig-price">₹{product.originalPrice}</span>
                  <span className="saved-amount">
                    Save ₹{product.originalPrice - product.price} ({product.discount}%)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="quick-view-description">{product.description}</p>

            {/* Specs Bullet Points */}
            {product.specs && product.specs.length > 0 && (
              <div className="quick-view-specs-box">
                <h4 className="specs-heading">Key Features &amp; Syllabus Coverage:</h4>
                <ul className="specs-list">
                  {product.specs.map((spec, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} className="spec-check" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart & Wishlist Actions */}
            <div className="quick-view-cta-row">
              <div className="qty-picker">
                <button
                  type="button"
                  className="qty-picker-btn"
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="qty-picker-value">{selectedQty}</span>
                <button
                  type="button"
                  className="qty-picker-btn"
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                className="btn-primary-add"
                onClick={handleAdd}
              >
                <ShoppingCart size={18} />
                <span>Add {selectedQty > 1 ? `${selectedQty} Items` : ''} to Cart • ₹{product.price * selectedQty}</span>
              </button>

              <button
                type="button"
                className={`btn-icon-wishlist ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product)}
                aria-label="Save to Wishlist"
                title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Campus Pickup Notice */}
            <div className="campus-pickup-note">
              <Clock size={15} />
              <span>Ready for pickup within 15–30 minutes at <strong>{product.shopName}</strong> counter or choose evening hostel delivery at checkout.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
