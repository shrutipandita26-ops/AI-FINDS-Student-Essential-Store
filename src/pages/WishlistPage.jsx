import React from 'react';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function WishlistPage({
  wishlistProducts,
  wishlistIds,
  cartItems,
  onToggleWishlist,
  onAddToCart,
  onUpdateCartQty,
  onOpenQuickView,
  onSelectShop,
  onMoveAllToCart,
  onClearWishlist,
  onNavigateExplore
}) {
  const getCartQuantity = (productId) => {
    const found = cartItems.find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="wishlist-page-root">
      <div className="container">
        {/* Header */}
        <div className="wishlist-header-row">
          <div>
            <div className="section-eyebrow">Saved Items</div>
            <h1 className="wishlist-page-title">My Campus Wishlist</h1>
            <p className="wishlist-page-subtitle">
              Save essentials for semester exams, upcoming lab courses, or group orders.
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="wishlist-bulk-actions">
              <button
                type="button"
                className="btn-move-all"
                onClick={onMoveAllToCart}
              >
                <ShoppingCart size={17} />
                <span>Move All to Cart</span>
              </button>

              <button
                type="button"
                className="btn-clear-wishlist"
                onClick={onClearWishlist}
                title="Remove all saved items"
              >
                <Trash2 size={16} />
                <span>Clear Wishlist</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {wishlistProducts.length === 0 ? (
          <div className="wishlist-empty-box">
            <div className="empty-heart-bubble">
              <Heart size={48} className="text-orange" />
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>
              Tap the heart icon on any textbook, stationery pack, lab coat, or topper study notes to save it here for later.
            </p>
            <button
              type="button"
              className="btn-browse-from-wishlist"
              onClick={onNavigateExplore}
            >
              <ShoppingBag size={18} />
              <span>Explore Student Essentials</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div>
            <div className="wishlist-count-banner">
              <span>
                You have <strong>{wishlistProducts.length}</strong> saved essential
                {wishlistProducts.length > 1 ? 's' : ''}.
              </span>
            </div>

            <div className="products-grid">
              {wishlistProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  cartQuantity={getCartQuantity(product.id)}
                  onUpdateCartQty={onUpdateCartQty}
                  onOpenQuickView={onOpenQuickView}
                  onSelectShop={onSelectShop}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
