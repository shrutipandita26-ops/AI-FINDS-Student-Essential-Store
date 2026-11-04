import React from 'react';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Star,
  CheckCircle2,
  ArrowRight,
  Printer
} from 'lucide-react';
import { SHOPS } from '../data/shops';

export default function ShopsPage({
  onSelectShop,
  setIsPrintModalOpen
}) {
  return (
    <div className="shops-page-root">
      <div className="container">
        {/* Header */}
        <div className="shops-page-header">
          <div className="section-eyebrow">
            <Store size={15} />
            <span>Campus Network</span>
          </div>
          <h1 className="shops-page-title">Local College-Area Shops</h1>
          <p className="shops-page-subtitle">
            Walk right in or pre-order essentials online through AI FINDS. All 5 shops are within a 5-minute walk from lecture halls and student hostels.
          </p>
        </div>

        {/* Shops Grid */}
        <div className="shops-full-list">
          {SHOPS.map((shop) => (
            <div key={shop.id} className="shop-full-card" id={`shop-${shop.id}`}>
              <div className="shop-full-img-col">
                <img src={shop.image} alt={shop.name} />
                <div className="shop-status-badge open">
                  <span className="dot" />
                  <span>Open Now</span>
                </div>
                <span className="shop-zone-overlay">{shop.campusZone}</span>
              </div>

              <div className="shop-full-details-col">
                <div className="shop-header-line">
                  <div>
                    <span className="shop-cat-text">{shop.category}</span>
                    <h2 className="shop-name-title">{shop.name}</h2>
                  </div>

                  <div className="shop-rating-box">
                    <Star size={16} fill="currentColor" />
                    <span className="rating-score">{shop.rating}</span>
                    <span className="rating-total">({shop.reviewsCount} reviews)</span>
                  </div>
                </div>

                <p className="shop-description-text">{shop.description}</p>

                {/* Location & Time Info */}
                <div className="shop-contact-grid">
                  <div className="contact-tile">
                    <MapPin size={16} className="text-forest" />
                    <div>
                      <span className="tile-label">Location &amp; Landmark</span>
                      <span className="tile-value">{shop.location}</span>
                      <span className="tile-sub">{shop.distance}</span>
                    </div>
                  </div>

                  <div className="contact-tile">
                    <Clock size={16} className="text-orange" />
                    <div>
                      <span className="tile-label">Working Hours</span>
                      <span className="tile-value">{shop.timing}</span>
                    </div>
                  </div>

                  <div className="contact-tile">
                    <Phone size={16} className="text-forest" />
                    <div>
                      <span className="tile-label">Phone &amp; WhatsApp</span>
                      <span className="tile-value">{shop.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Specialties & Perks */}
                <div className="shop-tags-container">
                  <div className="tags-group">
                    <span className="tags-label">Specialties:</span>
                    <div className="tags-wrap">
                      {shop.specialties.map((spec, i) => (
                        <span key={i} className="spec-tag-item">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="tags-group">
                    <span className="tags-label">Campus Perks:</span>
                    <div className="tags-wrap">
                      {shop.perks.map((perk, i) => (
                        <span key={i} className="perk-tag-item">
                          <CheckCircle2 size={13} className="text-green" />
                          <span>{perk}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="shop-actions-row">
                  <button
                    type="button"
                    className="btn-browse-shop-products"
                    onClick={() => onSelectShop(shop.id)}
                  >
                    <span>Browse Products from this Shop</span>
                    <ArrowRight size={16} />
                  </button>

                  {shop.id === 'campus-xerox' && (
                    <button
                      type="button"
                      className="btn-shop-print-cta"
                      onClick={() => setIsPrintModalOpen(true)}
                    >
                      <Printer size={16} />
                      <span>Print Cost Estimator</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
