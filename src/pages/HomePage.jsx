import React from 'react';
import {
  ArrowRight,
  Printer,
  Sparkles,
  Store,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  FileText,
  ShoppingBag
} from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import CategoryCards from '../components/CategoryCards';
import ProductCard from '../components/ProductCard';
import { SHOPS } from '../data/shops';

export default function HomePage({
  products,
  wishlistIds,
  cartItems,
  onToggleWishlist,
  onAddToCart,
  onUpdateCartQty,
  onOpenQuickView,
  onSelectCategory,
  onSearchSubmit,
  onQuickFilterClick,
  onSelectShop,
  onNavigateExplore,
  onNavigateShops,
  setIsPrintModalOpen
}) {
  // Trending featured products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);

  const getCartQuantity = (productId) => {
    const found = cartItems.find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="home-page-root">
      {/* Hero Section */}
      <HeroBanner
        onSearchSubmit={onSearchSubmit}
        onQuickFilterClick={onQuickFilterClick}
      />

      {/* Categories Grid */}
      <CategoryCards
        onSelectCategory={onSelectCategory}
        activeCategoryId={null}
      />

      {/* Featured / Trending Essentials */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">
                <Sparkles size={14} className="text-orange" />
                <span>Trending on Campus</span>
              </div>
              <h2 className="section-title">Most Needed by Students This Week</h2>
            </div>
            <button
              type="button"
              className="view-all-link-btn"
              onClick={onNavigateExplore}
            >
              <span>View All 20+ Essentials</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
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
      </section>

      {/* Print & Xerox Hub Highlight Banner */}
      <section className="print-hub-highlight-section">
        <div className="container">
          <div className="print-hub-banner-card">
            <div className="print-hub-content">
              <div className="print-hub-badge">
                <Printer size={16} />
                <span>Express Campus Printing Desk</span>
              </div>

              <h2 className="print-hub-title">
                Got a Lab Manual, Assignment, or Final Year Thesis to Print?
              </h2>

              <p className="print-hub-desc">
                Don’t wait in 45-minute morning lines before your 9:00 AM submission deadline. Use our instant print calculator, configure single or double-sided printing, choose spiral or golden embossed hardcover binding, and pick it up ready at <strong>Campus Xerox &amp; Tech Point</strong>.
              </p>

              <div className="print-rates-row">
                <div className="rate-badge-card">
                  <span className="rate-price">₹1.30</span>
                  <span className="rate-label">B&amp;W Back-to-Back</span>
                </div>
                <div className="rate-badge-card">
                  <span className="rate-price">₹3.80</span>
                  <span className="rate-label">Color Charts &amp; Graphs</span>
                </div>
                <div className="rate-badge-card">
                  <span className="rate-price">₹30</span>
                  <span className="rate-label">Clear Spiral Binding</span>
                </div>
                <div className="rate-badge-card">
                  <span className="rate-price">₹280</span>
                  <span className="rate-label">Gold Embossed Thesis</span>
                </div>
              </div>

              <div className="print-hub-cta-row">
                <button
                  type="button"
                  className="btn-open-print-calculator"
                  onClick={() => setIsPrintModalOpen(true)}
                >
                  <Printer size={18} />
                  <span>Open Print Cost Estimator</span>
                  <ArrowRight size={16} />
                </button>
                <span className="queue-status-text">
                  ⚡ Current counter wait time: &lt; 5 mins
                </span>
              </div>
            </div>

            <div className="print-hub-visual">
              <div className="print-visual-card">
                <div className="doc-icon-wrap">
                  <FileText size={38} className="text-forest" />
                </div>
                <h4>Thesis &amp; Assignment Queue</h4>
                <div className="mini-order-step">
                  <CheckCircle2 size={16} className="text-green" />
                  <span>1. Configure Pages &amp; Binding</span>
                </div>
                <div className="mini-order-step">
                  <CheckCircle2 size={16} className="text-green" />
                  <span>2. Instant Calculated Quote</span>
                </div>
                <div className="mini-order-step">
                  <CheckCircle2 size={16} className="text-green" />
                  <span>3. Collect at North Gate Counter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Shops Preview */}
      <section className="section-padding bg-cream-surface">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">Campus Ecosystem</div>
              <h2 className="section-title">Local College Shops Available Nearby</h2>
            </div>
            <button
              type="button"
              className="view-all-link-btn"
              onClick={onNavigateShops}
            >
              <span>View All 5 Shops</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="shops-preview-grid">
            {SHOPS.slice(0, 3).map((shop) => (
              <div
                key={shop.id}
                className="shop-card-preview"
                onClick={() => onSelectShop(shop.id)}
              >
                <div className="shop-img-wrap">
                  <img src={shop.image} alt={shop.name} />
                  <span className="shop-zone-pill">{shop.campusZone}</span>
                </div>

                <div className="shop-card-body">
                  <div className="shop-rating-pill">
                    <Star size={13} fill="currentColor" />
                    <span>{shop.rating}</span>
                    <span className="sub">({shop.reviewsCount})</span>
                  </div>

                  <h3 className="shop-title">{shop.name}</h3>
                  <p className="shop-desc">{shop.description}</p>

                  <div className="shop-meta-line">
                    <MapPin size={14} className="text-muted" />
                    <span>{shop.location}</span>
                  </div>

                  <div className="shop-meta-line">
                    <Clock size={14} className="text-muted" />
                    <span>{shop.timing}</span>
                  </div>

                  <div className="shop-tags-list">
                    {shop.specialties.slice(0, 2).map((sp, idx) => (
                      <span key={idx} className="shop-spec-tag">
                        {sp}
                      </span>
                    ))}
                  </div>

                  <div className="shop-card-footer">
                    <button
                      type="button"
                      className="shop-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectShop(shop.id);
                      }}
                    >
                      <span>Explore Shop Catalog</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AI FINDS (Student Benefits) */}
      <section className="section-padding">
        <div className="container">
          <div className="why-us-header text-center">
            <span className="section-eyebrow">Designed for Campus Life</span>
            <h2 className="section-title">Why Students Rely on AI FINDS</h2>
            <p className="section-subtitle">
              Built specifically around the college routine — exam schedules, laboratory regulations, and student budgets.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-circle green">
                <Clock size={24} />
              </div>
              <h3 className="benefit-title">Zero Waiting in Xerox Lines</h3>
              <p className="benefit-desc">
                Pre-order prints, thesis hardcover binding, and spiral files before your lecture. Just show your Order ID at the counter and pick up.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-circle orange">
                <ShieldCheck size={24} />
              </div>
              <h3 className="benefit-title">Lab-Inspected Instruments</h3>
              <p className="benefit-desc">
                Never get marked absent for faulty equipment. All mini-drafters, cotton lab coats, dissection sets, and multimeters meet college norms.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-circle green">
                <FileText size={24} />
              </div>
              <h3 className="benefit-title">Verified Topper Study Notes</h3>
              <p className="benefit-desc">
                Handwritten notes and 5-year solved previous year question banks compiled by university rank holders, syllabus-checked for 2026.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-circle orange">
                <Store size={24} />
              </div>
              <h3 className="benefit-title">Hostel Delivery &amp; Counter Pay</h3>
              <p className="benefit-desc">
                Choose convenient campus pickup or late evening hostel drops. Inspect items and pay at the shop desk using UPI or cash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="container bottom-cta-container">
        <div className="cta-banner-box">
          <div className="cta-banner-text">
            <h2>Ready to Ace Your Semester?</h2>
            <p>
              Find all your textbooks, lab tools, study guides, and instant print services in one student marketplace.
            </p>
          </div>
          <button
            type="button"
            className="btn-cta-explore"
            onClick={onNavigateExplore}
          >
            <ShoppingBag size={19} />
            <span>Browse Full Marketplace</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}
