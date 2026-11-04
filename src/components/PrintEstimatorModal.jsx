import React, { useState } from 'react';
import {
  Printer,
  X,
  ShoppingCart,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function PrintEstimatorModal({ isOpen, onClose, onAddCustomPrintOrder }) {
  const [documentTitle, setDocumentTitle] = useState('My Assignment / Lab Manual');
  const [pages, setPages] = useState(40);
  const [printType, setPrintType] = useState('bw'); // 'bw' | 'color-mixed' | 'full-color'
  const [sidedness, setSidedness] = useState('double'); // 'single' | 'double'
  const [binding, setBinding] = useState('spiral'); // 'none' | 'staple' | 'spiral' | 'soft' | 'hardcover'
  const [copies, setCopies] = useState(1);
  const [paperQuality, setPaperQuality] = useState('75gsm'); // '75gsm' | '85gsm-executive'

  if (!isOpen) return null;

  // Rates in ₹
  const rates = {
    bw: { single: 1.8, double: 1.3 },
    'color-mixed': { single: 4.5, double: 3.8 },
    'full-color': { single: 8.0, double: 7.0 }
  };

  const paperMultiplier = paperQuality === '85gsm-executive' ? 1.25 : 1.0;

  const bindingCosts = {
    none: 0,
    staple: 5,
    spiral: 30,
    soft: 50,
    hardcover: 280
  };

  const bindingLabels = {
    none: 'No Binding (Loose Sheets)',
    staple: 'Corner Heavy Staple (+₹5)',
    spiral: 'Plastic Spiral + Clear Sheets (+₹30)',
    soft: 'Soft Project Strip Binding (+₹50)',
    hardcover: 'Royal Hardcover Golden Embossed (+₹280)'
  };

  // Calculation
  const pageRate = rates[printType][sidedness] * paperMultiplier;
  const printCostPerCopy = Math.round(pages * pageRate);
  const bindingCostPerCopy = bindingCosts[binding];
  const unitCost = printCostPerCopy + bindingCostPerCopy;
  const totalAmount = unitCost * copies;

  const handleAddToCart = () => {
    const customPrintItem = {
      id: `custom-print-${Date.now()}`,
      title: `Print: ${documentTitle || 'Campus Document'} (${pages} pages, ${copies} copy)`,
      category: 'printing',
      price: unitCost,
      originalPrice: Math.round(unitCost * 1.3),
      discount: 23,
      rating: 4.9,
      reviews: 1,
      shopId: 'campus-xerox',
      shopName: 'Campus Xerox & Tech Point',
      condition: 'Custom Print Job',
      image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=600&q=80',
      description: `Custom print job: ${pages} pages, ${printType.toUpperCase()} print, ${sidedness} sided, ${bindingLabels[binding]}, ${paperQuality.toUpperCase()} paper.`,
      specs: [
        `${pages} Pages (${sidedness === 'double' ? 'Back-to-Back' : 'Single Sided'})`,
        `${printType === 'bw' ? 'Black & White Laser' : 'High Resolution Color'}`,
        `${bindingLabels[binding]}`,
        `Pre-ordered for 15-min campus pickup`
      ],
      isCustomPrint: true,
      inStock: true
    };

    onAddCustomPrintOrder(customPrintItem, copies);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container print-estimator-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-estimator-title"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="estimator-header">
          <div className="estimator-badge">
            <Printer size={16} />
            <span>Campus Xerox &amp; Print Estimator</span>
          </div>
          <h2 id="print-estimator-title" className="estimator-title">
            Calculate Instant Print &amp; Thesis Binding Cost
          </h2>
          <p className="estimator-subtitle">
            Skip the morning crowd at <strong>Campus Xerox &amp; Tech Point</strong>. Pre-calculate your order, add it to your cart, and pick up your ready-bound documents at the North Gate desk.
          </p>
        </div>

        <div className="estimator-body-grid">
          {/* Controls Column */}
          <div className="estimator-controls-col">
            {/* Document Title */}
            <div className="form-group">
              <label className="form-label">Document or Assignment Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Major Project Report / Lab File"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
            </div>

            {/* Pages Slider & Input */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Total Number of Pages</label>
                <span className="slider-value-badge">{pages} pages</span>
              </div>
              <div className="page-range-wrap">
                <input
                  type="range"
                  min="2"
                  max="350"
                  step="2"
                  value={pages}
                  onChange={(e) => setPages(parseInt(e.target.value, 10) || 2)}
                  className="custom-range-slider"
                />
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={pages}
                  onChange={(e) => setPages(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="page-number-input"
                />
              </div>
            </div>

            {/* Print Type: B&W vs Color */}
            <div className="form-group">
              <label className="form-label">Print Color Mode</label>
              <div className="options-grid three-cols">
                <button
                  type="button"
                  className={`option-btn ${printType === 'bw' ? 'active' : ''}`}
                  onClick={() => setPrintType('bw')}
                >
                  <span className="opt-title">Black &amp; White</span>
                  <span className="opt-sub">₹1.30/side (High Speed)</span>
                </button>

                <button
                  type="button"
                  className={`option-btn ${printType === 'color-mixed' ? 'active' : ''}`}
                  onClick={() => setPrintType('color-mixed')}
                >
                  <span className="opt-title">Color Charts</span>
                  <span className="opt-sub">₹3.80/side (Vivid)</span>
                </button>

                <button
                  type="button"
                  className={`option-btn ${printType === 'full-color' ? 'active' : ''}`}
                  onClick={() => setPrintType('full-color')}
                >
                  <span className="opt-title">Full Photo Color</span>
                  <span className="opt-sub">₹7.00/side (HD Laser)</span>
                </button>
              </div>
            </div>

            {/* Sidedness */}
            <div className="form-group">
              <label className="form-label">Printing Sides</label>
              <div className="options-grid two-cols">
                <button
                  type="button"
                  className={`option-btn ${sidedness === 'double' ? 'active' : ''}`}
                  onClick={() => setSidedness('double')}
                >
                  <span className="opt-title">Double Sided (Back-to-Back)</span>
                  <span className="opt-sub">Recommended • Saves Paper</span>
                </button>

                <button
                  type="button"
                  className={`option-btn ${sidedness === 'single' ? 'active' : ''}`}
                  onClick={() => setSidedness('single')}
                >
                  <span className="opt-title">Single Sided Only</span>
                  <span className="opt-sub">Required for some University Thesis</span>
                </button>
              </div>
            </div>

            {/* Binding Options */}
            <div className="form-group">
              <label className="form-label">Finishing &amp; Binding</label>
              <select
                className="form-select"
                value={binding}
                onChange={(e) => setBinding(e.target.value)}
              >
                <option value="none">No Binding (Loose Sheets)</option>
                <option value="staple">Corner Heavy Staple (+₹5)</option>
                <option value="spiral">Plastic Spiral Binding with Transparent Cover (+₹30)</option>
                <option value="soft">Soft Project Strip Binding with Color Spine (+₹50)</option>
                <option value="hardcover">Royal Hardcover Golden Embossed Thesis (+₹280)</option>
              </select>
            </div>

            {/* Paper Quality */}
            <div className="form-group">
              <label className="form-label">Paper Weight</label>
              <div className="options-grid two-cols">
                <button
                  type="button"
                  className={`option-btn ${paperQuality === '75gsm' ? 'active' : ''}`}
                  onClick={() => setPaperQuality('75gsm')}
                >
                  <span className="opt-title">Standard 75 GSM</span>
                  <span className="opt-sub">Crisp White Bond</span>
                </button>

                <button
                  type="button"
                  className={`option-btn ${paperQuality === '85gsm-executive' ? 'active' : ''}`}
                  onClick={() => setPaperQuality('85gsm-executive')}
                >
                  <span className="opt-title">Executive 85 GSM (+25%)</span>
                  <span className="opt-sub">Extra Opaque for Thesis</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Quote Column */}
          <div className="estimator-quote-col">
            <div className="quote-card">
              <div className="quote-card-header">
                <span className="quote-card-title">Live Print Estimate</span>
                <span className="quote-shop-tag">Campus Xerox</span>
              </div>

              <div className="quote-breakdown">
                <div className="breakdown-row">
                  <span>Document Title</span>
                  <strong className="text-truncate">{documentTitle || 'Campus Document'}</strong>
                </div>

                <div className="breakdown-row">
                  <span>Pages &amp; Format</span>
                  <span>
                    {pages} pages • {sidedness === 'double' ? 'Double' : 'Single'}
                  </span>
                </div>

                <div className="breakdown-row">
                  <span>Color Mode</span>
                  <span className="capitalize">{printType.replace('-', ' ')}</span>
                </div>

                <div className="breakdown-row">
                  <span>Binding Type</span>
                  <span>{bindingLabels[binding].split('(')[0]}</span>
                </div>

                <div className="breakdown-row">
                  <span>Paper Quality</span>
                  <span>{paperQuality.toUpperCase()}</span>
                </div>

                <div className="breakdown-divider" />

                <div className="copies-selector-row">
                  <span className="copies-label">Number of Copies:</span>
                  <div className="copies-stepper">
                    <button
                      type="button"
                      className="copies-btn"
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                    >
                      -
                    </button>
                    <span className="copies-val">{copies}</span>
                    <button
                      type="button"
                      className="copies-btn"
                      onClick={() => setCopies(copies + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="breakdown-divider" />

                <div className="quote-total-row">
                  <div>
                    <span className="total-label">Estimated Total</span>
                    <span className="total-note">Incl. taxes &amp; covers</span>
                  </div>
                  <div className="total-price-display">
                    <span className="curr">₹</span>
                    <span className="amt">{totalAmount}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-add-quote-to-cart"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                <span>Add Print Order to Cart • ₹{totalAmount}</span>
              </button>

              <div className="quote-perks-list">
                <div className="quote-perk">
                  <Clock size={14} className="text-green" />
                  <span>Ready within 15–30 mins at North Gate Counter</span>
                </div>
                <div className="quote-perk">
                  <ShieldCheck size={14} className="text-orange" />
                  <span>Bring PDF on USB or send via WhatsApp on pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
