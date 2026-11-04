import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'wishlist':
        return <Heart size={18} className="toast-icon wishlist-icon" />;
      case 'cart':
        return <ShoppingBag size={18} className="toast-icon cart-icon" />;
      default:
        return <CheckCircle2 size={18} className="toast-icon default-icon" />;
    }
  };

  return (
    <div className={`toast-container ${toast ? 'show' : ''}`} role="alert" aria-live="polite">
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={15} />
      </button>
    </div>
  );
}
