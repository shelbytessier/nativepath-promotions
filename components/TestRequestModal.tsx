'use client';

import Modal from './Modal';

interface TestRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TestRequestModal({ isOpen, onClose }: TestRequestModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '32px',
      }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>🧪 Request New Test</h2>
          <p style={{ fontSize: '14px', color: '#888' }}>
            Submit a test idea or request to the CRO team. They'll review, scope, and set up the test in HitPath.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => {
          e.preventDefault();
          alert('Test request submitted! The CRO team will review and reach out.');
          onClose();
        }}>
          {/* Your Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Sarah from Marketing"
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Test Idea / Hypothesis */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Test Idea / Hypothesis
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Free shipping threshold test: $75 vs $50"
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Product */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Product
            </label>
            <select
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">Select a product...</option>
              <option value="collagen">🦴 Collagen 25s</option>
              <option value="probiotics">💊 Probiotics 30B</option>
              <option value="hydrate">💧 Hydrate</option>
              <option value="mct">🥥 MCT Oil</option>
              <option value="creatine">⚡ Creatine</option>
            </select>
          </div>

          {/* Channel */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Channel
            </label>
            <select
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">Select a channel...</option>
              <option value="google">🔍 Google</option>
              <option value="meta">📘 Meta</option>
              <option value="tiktok">🎵 TikTok</option>
              <option value="youtube">📺 YouTube</option>
            </select>
          </div>

          {/* Test Type */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Test Type
            </label>
            <select
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">Select test type...</option>
              <option value="lp-angle">Landing Page Angle</option>
              <option value="offer">Offer/Pricing</option>
              <option value="upsell">Upsell</option>
              <option value="shipping">Shipping</option>
              <option value="creative">Creative/Ad</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Expected Outcome */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Expected Outcome / Why Test This?
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g., I think lowering the free shipping threshold will increase conversion without hurting AOV too much. Competitors offer free shipping at $50."
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Info Box */}
          <div style={{
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6' }}>
              <strong style={{ color: '#3b82f6' }}>📋 What happens next:</strong><br />
              1. CRO team reviews your request<br />
              2. They'll reach out to confirm details<br />
              3. Test gets set up in HitPath<br />
              4. You'll be notified when test goes live
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px',
                background: '#1db954',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1ed760'}
              onMouseOut={(e) => e.currentTarget.style.background = '#1db954'}
            >
              Submit Test Request
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '14px 24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}


