import React, { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Store,
  Eye
} from 'lucide-react';

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  cartQuantity = 0,
  onUpdateCartQty,
  onOpenQuickView,
  onSelectShop
}) {
  const [imgError, setImgError] = useState(false);

  // Category-aware fallback images for college supplies
  const categoryFallbacks = {
    books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    stationery: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    lab: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80',
    notes: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    printing: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    gadgets: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80'
  };

  const fallbackUrl =
    categoryFallbacks[product.category] || categoryFallbacks.books;

  return (
    <div className="product-card" id={`product-${product.id}`}>
      {/* Product Image Area */}
      <div className="product-image-wrap">
        <img
          src={imgError ? fallbackUrl : (product.image || fallbackUrl)}
          alt={product.title}
          className="product-img"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Condition Tag */}
        <span className="product-condition-badge">{product.condition}</span>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="product-discount-badge">{product.discount}% OFF</span>
        )}

        {/* Wishlist Button */}
        <button
          className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isWishlisted ? 'In your wishlist' : 'Save for later'}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Overlay Button */}
        <button
          className="product-quick-view-btn"
          onClick={() => onOpenQuickView(product)}
          aria-label="Quick view product details"
        >
          <Eye size={15} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Body */}
      <div className="product-body">
        {/* Shop & Campus Location */}
        <div className="product-shop-row">
          <button
            type="button"
            className="product-shop-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectShop) onSelectShop(product.shopId);
            }}
            title="View all products from this shop"
          >
            <Store size={13} />
            <span className="shop-name-truncate">{product.shopName}</span>
          </button>
        </div>

        {/* Product Title */}
        <h4
          className="product-title"
          onClick={() => onOpenQuickView(product)}
          title={product.title}
        >
          {product.title}
        </h4>

        {/* Rating and Reviews */}
        <div className="product-rating-row">
          <div className="rating-pill">
            <Star size={13} className="star-icon" fill="currentColor" />
            <span className="rating-value">{product.rating}</span>
          </div>
          <span className="reviews-count">({product.reviews} reviews)</span>
        </div>

        {/* First Key Spec Chip */}
        {product.specs && product.specs[0] && (
          <div className="product-spec-chip" title={product.specs[0]}>
            {product.specs[0]}
          </div>
        )}

        {/* Price and Cart Row */}
        <div className="product-footer-row">
          <div className="product-price-box">
            <div className="product-price-main">
              <span className="currency-symbol">₹</span>
              <span className="price-num">{product.price}</span>
            </div>
            {product.originalPrice > product.price && (
              <span className="product-original-price">₹{product.originalPrice}</span>
            )}
          </div>

          <div className="product-action-box">
            {cartQuantity > 0 ? (
              <div className="cart-stepper-control" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="stepper-btn minus"
                  onClick={() => onUpdateCartQty(product.id, cartQuantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="stepper-count">{cartQuantity}</span>
                <button
                  type="button"
                  className="stepper-btn plus"
                  onClick={() => onUpdateCartQty(product.id, cartQuantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                aria-label={`Add ${product.title} to cart`}
              >
                <ShoppingCart size={15} />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
