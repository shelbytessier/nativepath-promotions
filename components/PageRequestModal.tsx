'use client';

import { useState } from 'react';
import Modal from './Modal';

interface PageRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PageRequestModal({ isOpen, onClose }: PageRequestModalProps) {
  const [formData, setFormData] = useState({
    campaign: '',
    product: '',
    channel: '',
    offer: '',
    lpType: '',
    leadAngle: '',
    painPoint: '',
    notes: '',
  });

  const products = [
    { id: 'collagen-25s', name: 'Collagen 25s', price: '$33.99 base', emoji: '🦴' },
    { id: 'collagen-56s', name: 'Collagen 56s', price: '$59.99 base', emoji: '🦴' },
    { id: 'hydrate', name: 'Hydrate', price: '$29.99 base', emoji: '💧' },
    { id: 'creatine', name: 'Creatine', price: '$34.00 base', emoji: '💪' },
    { id: 'mct-oil', name: 'MCT Oil', price: '$29.99 base', emoji: '🥥' },
    { id: 'krill-oil', name: 'Krill Oil', price: '$39.99 base', emoji: '🦐' },
    { id: 'colostrum', name: 'Colostrum', price: '$49.99 base', emoji: '🥛' },
    { id: 'protein', name: 'Protein', price: '$44.99 base', emoji: '🥤' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Page request submitted! (This is a demo)');
    onClose();
    setFormData({
      campaign: '',
      product: '',
      channel: '',
      offer: '',
      lpType: '',
      leadAngle: '',
      painPoint: '',
      notes: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '24px',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Request New Page</h2>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
          Fill out the form below to request a new landing page. The web team will build it and add the URL when live.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>CAMPAIGN *</label>
            <select
              required
              value={formData.campaign}
              onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
              }}
            >
              <option value="">Select Campaign</option>
              <option value="VDAY-26">💝 VDAY-26</option>
              <option value="EVRGN">🌲 Evergreen</option>
              <option value="SPRNG-26">🌸 SPRNG-26</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '12px' }}>SELECT PRODUCT *</label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
              gap: '12px' 
            }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setFormData({ ...formData, product: product.id })}
                  style={{
                    background: formData.product === product.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: formData.product === product.id ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '20px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    if (formData.product !== product.id) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (formData.product !== product.id) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    }
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.name.toLowerCase().includes('collagen') ? (
                      <img 
                        src="/images/products/collagen.png" 
                        alt={product.name}
                        style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                      />
                    ) : (
                      product.emoji
                    )}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{product.name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{product.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>CHANNEL *</label>
              <select
                required
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#282828',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                }}
              >
                <option value="">Select Channel</option>
                <option value="Meta">📘 Meta</option>
                <option value="Google">🔍 Google</option>
                <option value="YouTube">📺 YouTube</option>
                <option value="SMS">💬 SMS</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>LP TYPE *</label>
              <select
                required
                value={formData.lpType}
                onChange={(e) => setFormData({ ...formData, lpType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#282828',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                }}
              >
                <option value="">Select Type</option>
                <option value="Listicle">Listicle</option>
                <option value="VSL">VSL</option>
                <option value="Advertorial">Advertorial</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>LEAD ANGLE *</label>
            <input
              type="text"
              required
              placeholder="e.g., Fear, Problem/Solution"
              value={formData.leadAngle}
              onChange={(e) => setFormData({ ...formData, leadAngle: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>PAIN POINT *</label>
            <input
              type="text"
              required
              placeholder="e.g., Joint Pain, Low Energy"
              value={formData.painPoint}
              onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>NOTES</label>
            <textarea
              rows={4}
              placeholder="Additional details or requirements..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                background: '#1db954',
                border: 'none',
                borderRadius: '6px',
                color: '#000',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1ed760'}
              onMouseOut={(e) => e.currentTarget.style.background = '#1db954'}
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

