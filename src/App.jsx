import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ShopsPage from './pages/ShopsPage';
import WishlistPage from './pages/WishlistPage';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import PrintEstimatorModal from './components/PrintEstimatorModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import AuthModal from './components/AuthModal';
import StudentOrdersModal from './components/StudentOrdersModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import Toast from './components/Toast';

import { PRODUCTS as INITIAL_PRODUCTS } from './data/products';
import {
  authAPI,
  productsAPI,
  cartAPI,
  wishlistAPI,
  ordersAPI
} from './services/api';
import './App.css';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShopFilter, setSelectedShopFilter] = useState('all');

  // Products State (initialized with fallback, synced with MongoDB)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // User State
  const [currentUser, setCurrentUser] = useState(null);

  // Cart State with LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_finds_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State with LocalStorage
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_finds_wishlist');
      return saved ? JSON.parse(saved) : ['prod-book-grewal', 'prod-lab-coat'];
    } catch {
      return ['prod-book-grewal', 'prod-lab-coat'];
    }
  });

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Toast Helper
  const showToast = (message, type = 'default') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // 1. Initial Load: Check JWT Auth & Fetch Live MongoDB Products
  useEffect(() => {
    const checkAuthAndProducts = async () => {
      // Check Auth
      const token = localStorage.getItem('ai_finds_token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setCurrentUser(res.user);
          }
        } catch {
          localStorage.removeItem('ai_finds_token');
          setCurrentUser(null);
        }
      }

      // Fetch Live Products from MongoDB
      try {
        const prodRes = await productsAPI.getAll();
        if (prodRes.success && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
          setProducts(prodRes.data);
        }
      } catch {
        // Keeps INITIAL_PRODUCTS if server is still spinning up
      }
    };

    checkAuthAndProducts();
  }, []);

  // 2. Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_finds_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to sync cart to localStorage:', e);
    }
  }, [cartItems]);

  // 3. Sync Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_finds_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to sync wishlist to localStorage:', e);
    }
  }, [wishlistIds]);

  // Auth Handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    // If user has saved cart/wishlist in MongoDB, sync it
    if (user.wishlist && user.wishlist.length > 0) {
      const dbWishlistIds = user.wishlist.map((w) => w.productId || w._id || w);
      setWishlistIds((prev) => Array.from(new Set([...prev, ...dbWishlistIds])));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ai_finds_token');
    setCurrentUser(null);
    showToast('You have signed out.');
  };

  // Cart Actions
  const handleAddToCart = (product, quantityToAdd = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: quantityToAdd }];
    });

    // If logged in, sync to server in background
    if (currentUser) {
      cartAPI.add(product.productId || product.id, quantityToAdd).catch(() => {});
    }

    showToast(`Added "${product.title}" to Cart`, 'cart');
  };

  const handleUpdateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQty } : item
        )
      );

      if (currentUser) {
        cartAPI.update(productId, newQty).catch(() => {});
      }
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (currentUser) {
      cartAPI.remove(productId).catch(() => {});
    }
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    setCartItems([]);
    if (currentUser) {
      cartAPI.clear().catch(() => {});
    }
    showToast('Your cart has been cleared');
  };

  // Wishlist Actions
  const handleToggleWishlist = (product) => {
    const pId = product.productId || product.id;
    setWishlistIds((prev) => {
      if (prev.includes(pId)) {
        showToast(`Removed from Wishlist: ${product.title}`);
        return prev.filter((id) => id !== pId);
      } else {
        showToast(`Saved to Wishlist: ${product.title}`, 'wishlist');
        return [...prev, pId];
      }
    });

    if (currentUser) {
      wishlistAPI.toggle(pId).catch(() => {});
    }
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    showToast('Wishlist cleared');
  };

  const handleMoveAllWishlistToCart = () => {
    const wishlisted = products.filter((p) =>
      wishlistIds.includes(p.productId || p.id)
    );
    if (wishlisted.length === 0) return;

    setCartItems((prev) => {
      const updated = [...prev];
      wishlisted.forEach((p) => {
        const found = updated.find((item) => (item.product.productId || item.product.id) === (p.productId || p.id));
        if (found) {
          found.quantity += 1;
        } else {
          updated.push({ product: p, quantity: 1 });
        }
      });
      return updated;
    });

    showToast(`Moved ${wishlisted.length} items to your cart!`, 'cart');
  };

  // Custom Print Order Integration
  const handleAddCustomPrintOrder = (customPrintProduct, copies = 1) => {
    setProducts((prev) => [customPrintProduct, ...prev]);
    handleAddToCart(customPrintProduct, copies);
    setIsCartOpen(true);
  };

  // Navigation & Search Helpers
  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory('all');
    setSelectedShopFilter('all');
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearchSubmit = (query, catId) => {
    setSearchQuery(query);
    setSelectedCategory(catId);
    setSelectedShopFilter('all');
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickFilterClick = (label, catId) => {
    setSearchQuery(label);
    setSelectedCategory(catId);
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectShop = (shopId) => {
    setSelectedShopFilter(shopId);
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Checkout Handlers
  const handleProceedToCheckout = (data) => {
    setIsCartOpen(false);
    setCheckoutData(data);
  };

  const handleOrderSuccess = async (orderPayload) => {
    setCheckoutData(null);
    setCartItems([]);

    // Persist to MongoDB backend!
    try {
      const backendPayload = {
        studentName: orderPayload.studentName,
        rollNumber: orderPayload.rollNumber,
        phone: orderPayload.phone,
        deliveryType: orderPayload.deliveryType,
        destination: orderPayload.destination,
        timeSlot: orderPayload.timeSlot,
        paymentMethod: orderPayload.paymentMethod,
        items: orderPayload.items.map((it) => ({
          productId: it.product.productId || it.product.id || 'prod',
          title: it.product.title,
          price: it.product.price,
          quantity: it.quantity,
          shopName: it.product.shopName || '',
          shopId: it.product.shopId || '',
          image: it.product.image || ''
        })),
        total: orderPayload.total,
        discount: orderPayload.discount || 0
      };

      const res = await ordersAPI.create(backendPayload);
      if (res.success && res.data) {
        setCompletedOrder(res.data);
        showToast(`Order #${res.data.orderId} saved to database!`, 'cart');
        return;
      }
    } catch (err) {
      console.warn('Backend order sync note:', err.message);
    }

    // Fallback display if offline
    setCompletedOrder(orderPayload);
    showToast(`Order ${orderPayload.orderId} confirmed!`, 'cart');
  };

  // Refetch products after admin changes
  const handleReloadCatalog = async () => {
    try {
      const res = await productsAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch {
      // keep existing
    }
  };

  // Derive counts
  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalWishlistCount = wishlistIds.length;
  const wishlistProducts = products.filter((p) =>
    wishlistIds.includes(p.productId || p.id)
  );

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        wishlistCount={totalWishlistCount}
        setIsCartOpen={setIsCartOpen}
        setIsPrintModalOpen={setIsPrintModalOpen}
        onQuickSearch={handleQuickSearch}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenOrdersModal={() => setIsOrdersModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Dynamic View */}
      <main className="app-main-content">
        {activeTab === 'home' && (
          <HomePage
            products={products}
            wishlistIds={wishlistIds}
            cartItems={cartItems}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onOpenQuickView={setQuickViewProduct}
            onSelectCategory={handleSelectCategory}
            onSearchSubmit={handleHeroSearchSubmit}
            onQuickFilterClick={handleQuickFilterClick}
            onSelectShop={handleSelectShop}
            onNavigateExplore={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateShops={() => {
              setActiveTab('shops');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setIsPrintModalOpen={setIsPrintModalOpen}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorePage
            products={products}
            wishlistIds={wishlistIds}
            cartItems={cartItems}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onOpenQuickView={setQuickViewProduct}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedShopFilter={selectedShopFilter}
            setSelectedShopFilter={setSelectedShopFilter}
            setIsPrintModalOpen={setIsPrintModalOpen}
          />
        )}

        {activeTab === 'shops' && (
          <ShopsPage
            onSelectShop={handleSelectShop}
            setIsPrintModalOpen={setIsPrintModalOpen}
          />
        )}

        {activeTab === 'wishlist' && (
          <WishlistPage
            wishlistProducts={wishlistProducts}
            wishlistIds={wishlistIds}
            cartItems={cartItems}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onOpenQuickView={setQuickViewProduct}
            onSelectShop={handleSelectShop}
            onMoveAllToCart={handleMoveAllWishlistToCart}
            onClearWishlist={handleClearWishlist}
            onNavigateExplore={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        setIsPrintModalOpen={setIsPrintModalOpen}
        onSelectCategory={handleSelectCategory}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        onNavigateExplore={() => {
          setIsCartOpen(false);
          setActiveTab('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          isWishlisted={wishlistIds.includes(quickViewProduct.productId || quickViewProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          cartQuantity={
            cartItems.find(
              (item) =>
                (item.product.productId || item.product.id) ===
                (quickViewProduct.productId || quickViewProduct.id)
            )?.quantity || 0
          }
          onSelectShop={handleSelectShop}
        />
      )}

      {/* Print & Xerox Estimator Modal */}
      <PrintEstimatorModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onAddCustomPrintOrder={handleAddCustomPrintOrder}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={!!checkoutData}
        onClose={() => setCheckoutData(null)}
        checkoutData={checkoutData}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onNavigateExplore={() => {
          setCompletedOrder(null);
          setActiveTab('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      {/* Student Past Orders Modal */}
      <StudentOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        onNavigateExplore={() => {
          setIsOrdersModalOpen(false);
          setActiveTab('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        showToast={showToast}
        onProductCreatedOrDeleted={handleReloadCatalog}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
