import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  MapPin,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function HeroBanner({ onSearchSubmit, onQuickFilterClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(searchTerm, selectedCategory);
  };

  const popularSearches = [
    { label: 'Engineering Maths', cat: 'books' },
    { label: 'Lab Coat Apron', cat: 'lab' },
    { label: 'Spiral Notebooks', cat: 'stationery' },
    { label: 'Casio Calculator', cat: 'gadgets' },
    { label: 'Topper Notes', cat: 'notes' },
    { label: 'Thesis Binding', cat: 'printing' }
  ];

  return (
    <section className="hero-section">
      <div className="container hero-container">
        {/* Glow Badges */}
        <div className="hero-pill-badge">
          <Sparkles size={14} className="pill-sparkle" />
          <span>Smart College Essentials & Local Campus Shops</span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title">
          Discover Books, Lab Kits &amp; Campus Printing at{' '}
          <span className="hero-highlight">Student-Friendly Prices</span>
        </h1>

        {/* Hero Description */}
        <p className="hero-subtitle">
          AI FINDS brings together local shops around your college campus. Skip the Xerox line, find verified handwritten notes, discount engineering instruments, and hostel essentials in one simple platform.
        </p>

        {/* Main Interactive Search Box */}
        <form className="hero-search-box" onSubmit={handleSubmit}>
          <div className="search-category-select-wrapper">
            <select
              className="search-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-input-field">
            <Search size={20} className="search-field-icon" />
            <input
              type="text"
              placeholder="Search books, lab aprons, mini drafters, handwritten notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button type="submit" className="hero-submit-btn">
            <span>Find Essentials</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="hero-chips-row">
          <span className="chips-label">Popular on campus:</span>
          <div className="chips-list">
            {popularSearches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="hero-chip-btn"
                onClick={() => onQuickFilterClick(item.label, item.cat)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Campus Highlights Bar */}
        <div className="hero-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap green">
              <MapPin size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">5 Local Campus Shops</span>
              <span className="stat-desc">Library Gate, SAC &amp; Hostel Quad</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap orange">
              <Zap size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">15-Min Express Print</span>
              <span className="stat-desc">Pre-order PDF prints &amp; skip lines</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap green">
              <BookOpen size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">500+ Student Essentials</span>
              <span className="stat-desc">Books, drafters, aprons &amp; notes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap orange">
              <ShieldCheck size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-title">Student Budget Rates</span>
              <span className="stat-desc">Save up to 50% vs retail stores</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
