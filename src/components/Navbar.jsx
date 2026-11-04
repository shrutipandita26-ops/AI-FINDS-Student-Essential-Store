import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Store,
  Compass,
  Home,
  Printer,
  Menu,
  X,
  Search,
  Sparkles,
  User,
  LogOut,
  Package,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  setIsCartOpen,
  setIsPrintModalOpen,
  onQuickSearch,
  currentUser,
  onOpenAuthModal,
  onOpenOrdersModal,
  onOpenAdminModal,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      onQuickSearch(headerSearchQuery.trim());
      setHeaderSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick('home')}>
          <div className="brand-icon-wrapper">
            <Sparkles size={20} className="brand-sparkle" />
          </div>
          <div className="brand-text">
            <span className="brand-name">AI FINDS</span>
            <span className="brand-tagline">Campus Student Marketplace</span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
          <Search size={17} className="search-icon" />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search books, lab coats, drafters, notes..."
            value={headerSearchQuery}
            onChange={(e) => setHeaderSearchQuery(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn" aria-label="Search">
            Find
          </button>
        </form>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <button
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            <Home size={17} />
            <span>Home</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => handleNavClick('explore')}
          >
            <Compass size={17} />
            <span>Explore</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'shops' ? 'active' : ''}`}
            onClick={() => handleNavClick('shops')}
          >
            <Store size={17} />
            <span>Shops</span>
          </button>

          <button
            className="nav-link print-cta-link"
            onClick={() => setIsPrintModalOpen(true)}
            title="Calculate xerox & print binding costs"
          >
            <Printer size={17} />
            <span>Print Hub</span>
            <span className="nav-badge-pill">Express</span>
          </button>
        </nav>

        {/* Action Buttons: User, Wishlist, Cart */}
        <div className="navbar-actions">
          {/* User Auth / Profile Dropdown */}
          {currentUser ? (
            <div className="user-profile-menu-wrap">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User profile options"
              >
                <div className="user-avatar-circle">
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck size={16} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="user-profile-info">
                  <span className="user-name-text">{currentUser.name.split(' ')[0]}</span>
                  <span className={`user-role-badge ${currentUser.role}`}>
                    {currentUser.role === 'admin' ? 'Admin' : currentUser.rollNumber || 'Student'}
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  className="user-dropdown-menu"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="dropdown-header">
                    <strong>{currentUser.name}</strong>
                    <span className="dropdown-email">{currentUser.email}</span>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      type="button"
                      className="dropdown-item admin-item"
                      onClick={() => onOpenAdminModal()}
                    >
                      <ShieldCheck size={16} />
                      <span>Admin Control Panel</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => onOpenOrdersModal()}
                  >
                    <Package size={16} />
                    <span>My Past Orders</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-item logout-item"
                    onClick={() => onLogout()}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="action-btn-auth"
              onClick={onOpenAuthModal}
              title="Sign in or create student account"
            >
              <User size={17} />
              <span>Sign In</span>
            </button>
          )}

          {/* Wishlist */}
          <button
            className={`action-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => handleNavClick('wishlist')}
            aria-label="Wishlist"
            title="Your Saved Items"
          >
            <Heart size={20} />
            {wishlistCount > 0 && <span className="counter-badge orange-badge">{wishlistCount}</span>}
          </button>

          {/* Cart */}
          <button
            className="action-btn cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
            title="Campus Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="counter-badge green-badge">{cartCount}</span>}
            <span className="cart-label">Cart</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="navbar-brand">
                <div className="brand-icon-wrapper">
                  <Sparkles size={18} />
                </div>
                <span className="brand-name">AI FINDS</span>
              </div>
              <button className="drawer-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile User Status */}
            {currentUser ? (
              <div className="mobile-user-card">
                <div className="user-avatar-circle">
                  {currentUser.role === 'admin' ? <ShieldCheck size={18} /> : <User size={18} />}
                </div>
                <div>
                  <div className="user-name-text">{currentUser.name}</div>
                  <div className="mobile-user-email">{currentUser.email}</div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn-mobile-signin"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
              >
                <User size={18} />
                <span>Student Sign In / Register</span>
              </button>
            )}

            {/* Mobile Search */}
            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search campus essentials..."
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <nav className="mobile-drawer-nav">
              <button
                className={`drawer-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                <Home size={19} />
                <span>Home Page</span>
              </button>

              <button
                className={`drawer-link ${activeTab === 'explore' ? 'active' : ''}`}
                onClick={() => handleNavClick('explore')}
              >
                <Compass size={19} />
                <span>Explore Marketplace</span>
              </button>

              <button
                className={`drawer-link ${activeTab === 'shops' ? 'active' : ''}`}
                onClick={() => handleNavClick('shops')}
              >
                <Store size={19} />
                <span>Campus Shops</span>
              </button>

              <button
                className={`drawer-link ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => handleNavClick('wishlist')}
              >
                <Heart size={19} />
                <span>Wishlist</span>
                {wishlistCount > 0 && <span className="drawer-counter">{wishlistCount}</span>}
              </button>

              <button
                className="drawer-link print-highlight"
                onClick={() => {
                  setIsPrintModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Printer size={19} />
                <span>Print &amp; Xerox Estimator</span>
              </button>

              {currentUser && (
                <button
                  className="drawer-link"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrdersModal();
                  }}
                >
                  <Package size={19} />
                  <span>My Past Orders</span>
                </button>
              )}

              {currentUser && currentUser.role === 'admin' && (
                <button
                  className="drawer-link print-highlight"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminModal();
                  }}
                >
                  <ShieldCheck size={19} />
                  <span>Admin Control Panel</span>
                </button>
              )}

              <button
                className="drawer-link cart-highlight"
                onClick={() => {
                  setIsCartOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <ShoppingBag size={19} />
                <span>Open Cart ({cartCount} items)</span>
              </button>

              {currentUser && (
                <button
                  className="drawer-link"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                >
                  <LogOut size={19} />
                  <span>Sign Out</span>
                </button>
              )}
            </nav>

            <div className="mobile-drawer-footer">
              <p className="college-tag">Made for College Students</p>
              <p className="college-sub">Books • Stationery • Lab Kits • Xerox</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
