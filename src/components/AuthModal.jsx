import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  GraduationCap,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { authAPI } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleQuickDemo = (type) => {
    setError('');
    if (type === 'student') {
      setEmail('student@aifinds.edu');
      setPassword('Student@123');
      setIsRegister(false);
    } else {
      setEmail('admin@aifinds.edu');
      setPassword('Admin@123');
      setIsRegister(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await authAPI.register({
          name,
          email,
          password,
          rollNumber,
          phone
        });
        localStorage.setItem('ai_finds_token', res.token);
        onAuthSuccess(res.user);
        showToast(`Welcome to AI FINDS, ${res.user.name}!`);
        onClose();
      } else {
        const res = await authAPI.login({
          email,
          password
        });
        localStorage.setItem('ai_finds_token', res.token);
        onAuthSuccess(res.user);
        showToast(`Welcome back, ${res.user.name}!`);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container auth-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close authentication modal">
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-badge">
            <Sparkles size={16} />
            <span>Campus Student Authentication</span>
          </div>
          <h2 id="auth-modal-title" className="auth-title">
            {isRegister ? 'Join AI FINDS Marketplace' : 'Sign in to Your Account'}
          </h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Save study notes, manage orders, and unlock student discounts.'
              : 'Access your saved wishlist, cart, and campus order history.'}
          </p>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="quick-demo-box">
          <span className="demo-box-label">Quick One-Click Demo Logins:</span>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="demo-pill-btn student"
              onClick={() => handleQuickDemo('student')}
            >
              <GraduationCap size={15} />
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              className="demo-pill-btn admin"
              onClick={() => handleQuickDemo('admin')}
            >
              <ShieldCheck size={15} />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <>
              <div className="form-group">
                <label className="input-label">Full Name *</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    required
                    className="form-input with-icon"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label className="input-label">Roll / Reg Number</label>
                  <div className="input-with-icon">
                    <GraduationCap size={16} className="input-icon" />
                    <input
                      type="text"
                      className="form-input with-icon"
                      placeholder="e.g. 23BCSE104"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">Mobile Number</label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-icon" />
                    <input
                      type="tel"
                      className="form-input with-icon"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="input-label">College Email *</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                required
                className="form-input with-icon"
                placeholder="name@college.edu or gmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Password *</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                required
                minLength={6}
                className="form-input with-icon"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        <div className="auth-modal-footer">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to AI FINDS?{' '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
              >
                Create Student Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
