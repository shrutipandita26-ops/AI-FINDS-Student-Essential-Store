import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ShoppingBag,
  Store,
  Printer
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/categories';
import { SHOPS } from '../data/shops';

export default function ExplorePage({
  products,
  wishlistIds,
  cartItems,
  onToggleWishlist,
  onAddToCart,
  onUpdateCartQty,
  onOpenQuickView,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedShopFilter,
  setSelectedShopFilter,
  setIsPrintModalOpen
}) {
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under-150' | '150-400' | '400-800' | 'above-800'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (selectedCategory && selectedCategory !== 'all') {
          if (p.category !== selectedCategory) return false;
        }

        // Shop Filter
        if (selectedShopFilter && selectedShopFilter !== 'all') {
          if (p.shopId !== selectedShopFilter) return false;
        }

        // Price Filter
        if (priceFilter === 'under-150' && p.price >= 150) return false;
        if (priceFilter === '150-400' && (p.price < 150 || p.price > 400)) return false;
        if (priceFilter === '400-800' && (p.price < 400 || p.price > 800)) return false;
        if (priceFilter === 'above-800' && p.price < 800) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchShop = p.shopName.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchTags = p.tags && p.tags.some((t) => t.toLowerCase().includes(q));
          const matchSpecs = p.specs && p.specs.some((s) => s.toLowerCase().includes(q));

          if (!matchTitle && !matchDesc && !matchShop && !matchCategory && !matchTags && !matchSpecs) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'discount':
            return b.discount - a.discount;
          case 'featured':
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [products, selectedCategory, selectedShopFilter, priceFilter, searchQuery, sortBy]);

  const getCartQuantity = (productId) => {
    const found = cartItems.find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedShopFilter('all');
    setPriceFilter('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== 'all') ||
    (selectedShopFilter && selectedShopFilter !== 'all') ||
    priceFilter !== 'all' ||
    searchQuery.trim().length > 0;

  const currentShopObj = SHOPS.find((s) => s.id === selectedShopFilter);

  return (
    <div className="explore-page-root">
      <div className="container">
        {/* Page Header */}
        <div className="explore-header-row">
          <div>
            <div className="section-eyebrow">College Catalog</div>
            <h1 className="explore-page-title">
              {currentShopObj ? (
                <>Products at {currentShopObj.name}</>
              ) : selectedCategory && selectedCategory !== 'all' ? (
                <>{CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Essentials'}</>
              ) : (
                <>Explore Student Essentials</>
              )}
            </h1>
            <p className="explore-page-subtitle">
              Browse textbooks, notebooks, laboratory coats, drafting tools, study notes, and campus printing supplies.
            </p>
          </div>

          <button
            type="button"
            className="explore-print-quote-btn"
            onClick={() => setIsPrintModalOpen(true)}
          >
            <Printer size={16} />
            <span>Instant Print Estimator</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="explore-filter-bar">
          {/* Search Input */}
          <div className="filter-search-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by product name, subject, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search text"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Controls: Shop, Price, Sorting */}
          <div className="filter-controls-group">
            {/* Shop Filter */}
            <div className="select-wrap">
              <Store size={15} className="select-icon" />
              <select
                value={selectedShopFilter || 'all'}
                onChange={(e) => setSelectedShopFilter(e.target.value)}
                aria-label="Filter by shop"
              >
                <option value="all">All Campus Shops</option>
                {SHOPS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="select-wrap">
              <SlidersHorizontal size={15} className="select-icon" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                aria-label="Filter by price range"
              >
                <option value="all">Any Price</option>
                <option value="under-150">Under ₹150</option>
                <option value="150-400">₹150 – ₹400</option>
                <option value="400-800">₹400 – ₹800</option>
                <option value="above-800">Above ₹800</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="select-wrap">
              <ArrowUpDown size={15} className="select-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured / Trending</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="category-pills-scroll-row">
          {CATEGORIES.map((cat) => {
            const isSelected =
              (!selectedCategory && cat.id === 'all') || selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                className={`category-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.name}</span>
                {cat.id !== 'all' && <span className="cat-pill-count">{cat.badge}</span>}
              </button>
            );
          })}
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="active-filters-chips-bar">
            <span className="active-filters-title">Active Filters:</span>

            {searchQuery && (
              <span className="filter-chip">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} aria-label="Remove search filter">
                  <X size={13} />
                </button>
              </span>
            )}

            {selectedCategory && selectedCategory !== 'all' && (
              <span className="filter-chip">
                Category: {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory('all')}
                  aria-label="Remove category filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {selectedShopFilter && selectedShopFilter !== 'all' && (
              <span className="filter-chip">
                Shop: {SHOPS.find((s) => s.id === selectedShopFilter)?.name}
                <button
                  onClick={() => setSelectedShopFilter('all')}
                  aria-label="Remove shop filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {priceFilter !== 'all' && (
              <span className="filter-chip">
                Price:{' '}
                {priceFilter === 'under-150'
                  ? 'Under ₹150'
                  : priceFilter === '150-400'
                  ? '₹150 – ₹400'
                  : priceFilter === '400-800'
                  ? '₹400 – ₹800'
                  : 'Above ₹800'}
                <button onClick={() => setPriceFilter('all')} aria-label="Remove price filter">
                  <X size={13} />
                </button>
              </span>
            )}

            <button
              type="button"
              className="btn-clear-all-filters"
              onClick={handleClearFilters}
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Results Counter */}
        <div className="results-count-row">
          <span className="results-count">
            Showing <strong>{filteredProducts.length}</strong> items
          </span>
          <span className="results-note">
            Prices in Indian Rupees (₹) • Campus pickup available
          </span>
        </div>

        {/* Products Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="no-products-state">
            <div className="empty-icon-wrap">
              <ShoppingBag size={46} />
            </div>
            <h3>No Products Found</h3>
            <p>
              We couldn't find any products matching your active filters or search terms. Try loosening your search criteria.
            </p>
            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleClearFilters}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                cartQuantity={getCartQuantity(product.id)}
                onUpdateCartQty={onUpdateCartQty}
                onOpenQuickView={onOpenQuickView}
                onSelectShop={(shopId) => setSelectedShopFilter(shopId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
