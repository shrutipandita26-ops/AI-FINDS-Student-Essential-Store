import React from 'react';
import {
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Printer,
  ShieldCheck
} from 'lucide-react';

export default function Footer({
  setActiveTab,
  setIsPrintModalOpen,
  onSelectCategory
}) {
  const handleNav = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root">
      <div className="container footer-container">
        {/* Top Feature Banner */}
        <div className="footer-perks-grid">
          <div className="footer-perk-card">
            <div className="perk-icon-wrap">
              <MapPin size={22} />
            </div>
            <div>
              <h4 className="perk-title">Direct from Campus Shops</h4>
              <p className="perk-sub">Collect at Library Gate, SAC &amp; Engineering Wing</p>
            </div>
          </div>

          <div className="footer-perk-card">
            <div className="perk-icon-wrap">
              <Printer size={22} />
            </div>
            <div>
              <h4 className="perk-title">15-Min Express Printing</h4>
              <p className="perk-sub">Pre-order assignments, thesis &amp; color charts</p>
            </div>
          </div>

          <div className="footer-perk-card">
            <div className="perk-icon-wrap">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="perk-title">Student Friendly Prices</h4>
              <p className="perk-sub">Verified study notes, lab tools &amp; textbook buyback</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="footer-main-grid">
          {/* Brand Col */}
          <div className="footer-col brand-col">
            <div className="navbar-brand footer-brand">
              <div className="brand-icon-wrapper">
                <Sparkles size={20} />
              </div>
              <div className="brand-text">
                <span className="brand-name">AI FINDS</span>
                <span className="brand-tagline">College Student Essentials Marketplace</span>
              </div>
            </div>

            <p className="footer-about-text">
              A dedicated marketplace connecting college students with local campus shops. Discover textbooks, notebooks, lab coats, drafting kits, topper handwritten notes, and instant printing services without standing in long queues.
            </p>

            <div className="footer-campus-badge">
              <span className="dot" />
              <span>5 Verified Shops Active on Campus</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => handleNav('home')}>Home Marketplace</button>
              </li>
              <li>
                <button onClick={() => handleNav('explore')}>Explore All Products</button>
              </li>
              <li>
                <button onClick={() => handleNav('shops')}>Campus Local Shops</button>
              </li>
              <li>
                <button onClick={() => handleNav('wishlist')}>Saved Wishlist</button>
              </li>
              <li>
                <button onClick={() => setIsPrintModalOpen(true)}>
                  Print &amp; Xerox Estimator
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Student Essentials</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  onClick={() => {
                    handleNav('explore');
                    if (onSelectCategory) onSelectCategory('books');
                  }}
                >
                  Academic Textbooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleNav('explore');
                    if (onSelectCategory) onSelectCategory('stationery');
                  }}
                >
                  Notebooks &amp; Drafting Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleNav('explore');
                    if (onSelectCategory) onSelectCategory('lab');
                  }}
                >
                  Lab Coats &amp; Workshop Gear
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleNav('explore');
                    if (onSelectCategory) onSelectCategory('notes');
                  }}
                >
                  Topper Handwritten Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleNav('explore');
                    if (onSelectCategory) onSelectCategory('gadgets');
                  }}
                >
                  Scientific Calculators &amp; Lamps
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Support */}
          <div className="footer-col">
            <h4 className="footer-heading">Campus Help &amp; Pickup</h4>
            <div className="footer-contact-item">
              <MapPin size={16} />
              <span>North Gate, SAC &amp; Hostel Common Quad</span>
            </div>
            <div className="footer-contact-item">
              <Clock size={16} />
              <span>Service Desk: 8:00 AM – 10:00 PM</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={16} />
              <span>WhatsApp Helpline: +91 98765 43210</span>
            </div>

            <div className="demo-notice-pill">
              <strong>College Project Notice:</strong> AI FINDS is a student marketplace web app demo. Payment flows are simulated for evaluation.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © 2026 <strong>AI FINDS</strong> — College Student Essentials Marketplace. Built with React &amp; Vite.
          </p>
          <div className="footer-badge-clean">
            <span>Forest Green &amp; Warm Orange Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
