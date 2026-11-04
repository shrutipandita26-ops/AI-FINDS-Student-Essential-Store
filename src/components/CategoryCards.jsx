import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import CategoryIcon from './CategoryIcon';

export default function CategoryCards({ onSelectCategory, activeCategoryId }) {
  // We exclude 'all' from the card grid or show it as the first broad exploration option
  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">Campus Catalog</div>
            <h2 className="section-title">Explore by Category</h2>
          </div>
          <p className="section-caption">
            Curated student supplies vetted for university labs, lecture halls, and dorm life.
          </p>
        </div>

        <div className="category-cards-grid">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <div
              key={cat.id}
              className={`category-card ${activeCategoryId === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectCategory(cat.id);
              }}
            >
              <div className="category-card-top">
                <div className="category-icon-bubble" style={{ color: cat.accentColor }}>
                  <CategoryIcon name={cat.iconName} size={24} />
                </div>
                <span className="category-badge">{cat.badge}</span>
              </div>

              <div className="category-card-body">
                <h3 className="category-card-title">{cat.name}</h3>
                <p className="category-card-desc">{cat.shortDesc}</p>
              </div>

              <div className="category-card-footer">
                <span className="category-count">{cat.itemCount}</span>
                <span className="category-browse-link">
                  Browse <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
