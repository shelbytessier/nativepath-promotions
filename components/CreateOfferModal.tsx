'use client';

import { useState } from 'react';
import Modal from './Modal';

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateOfferModal({ isOpen, onClose }: CreateOfferModalProps) {
  const [requestorName, setRequestorName] = useState('');
  const [campaign, setCampaign] = useState('');
  const [channel, setChannel] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [basePrice, setBasePrice] = useState(33.99);
  const [notes, setNotes] = useState('');
  
  // Pricing state - Single
  const [singleDollarOff, setSingleDollarOff] = useState('');
  const [singlePercentOff, setSinglePercentOff] = useState('');
  const [singleTargetPrice, setSingleTargetPrice] = useState('');
  
  // Pricing state - 3-Pack
  const [threePackDollarOff, setThreePackDollarOff] = useState('');
  const [threePackPercentOff, setThreePackPercentOff] = useState('');
  const [threePackTargetPrice, setThreePackTargetPrice] = useState('');
  
  // Pricing state - 6-Pack
  const [sixPackDollarOff, setSixPackDollarOff] = useState('');
  const [sixPackPercentOff, setSixPackPercentOff] = useState('');
  const [sixPackTargetPrice, setSixPackTargetPrice] = useState('');
  
  const products = [
    { id: 'collagen', name: 'Collagen 25s', emoji: '🦴', price: 33.99 },
    { id: 'collagen56', name: 'Collagen 56s', emoji: '🦴', price: 59.99 },
    { id: 'hydrate', name: 'Hydrate', emoji: '💧', price: 29.99 },
    { id: 'creatine', name: 'Creatine', emoji: '💪', price: 34.00 },
    { id: 'mct', name: 'MCT Oil', emoji: '🥥', price: 29.99 },
    { id: 'krill', name: 'Krill Oil', emoji: '🦐', price: 39.99 },
    { id: 'colostrum', name: 'Colostrum', emoji: '🥛', price: 49.99 },
    { id: 'protein', name: 'Protein', emoji: '🥤', price: 44.99 },
  ];

  const handleProductSelect = (product: typeof products[0]) => {
    setSelectedProduct(product.id);
    setBasePrice(product.price);
  };

  // Single Unit Calculations
  const calculateFinalPrice = () => {
    if (singleTargetPrice) return parseFloat(singleTargetPrice);
    if (singleDollarOff) return basePrice - parseFloat(singleDollarOff);
    if (singlePercentOff) return basePrice * (1 - parseFloat(singlePercentOff) / 100);
    return basePrice;
  };

  const calculateMargin = () => {
    const finalPrice = calculateFinalPrice();
    const cogs = 12;
    const margin = finalPrice - cogs;
    const marginPercent = (margin / finalPrice) * 100;
    return { margin, marginPercent };
  };

  // 3-Pack Calculations
  const threePackBase = basePrice * 3;
  const calculateThreePackFinalPrice = () => {
    if (threePackTargetPrice) return parseFloat(threePackTargetPrice);
    if (threePackDollarOff) return threePackBase - parseFloat(threePackDollarOff);
    if (threePackPercentOff) return threePackBase * (1 - parseFloat(threePackPercentOff) / 100);
    return threePackBase;
  };

  const calculateThreePackMargin = () => {
    const finalPrice = calculateThreePackFinalPrice();
    const cogs = 12 * 3;
    const margin = finalPrice - cogs;
    const marginPercent = (margin / finalPrice) * 100;
    return { margin, marginPercent };
  };

  // 6-Pack Calculations
  const sixPackBase = basePrice * 6;
  const calculateSixPackFinalPrice = () => {
    if (sixPackTargetPrice) return parseFloat(sixPackTargetPrice);
    if (sixPackDollarOff) return sixPackBase - parseFloat(sixPackDollarOff);
    if (sixPackPercentOff) return sixPackBase * (1 - parseFloat(sixPackPercentOff) / 100);
    return sixPackBase;
  };

  const calculateSixPackMargin = () => {
    const finalPrice = calculateSixPackFinalPrice();
    const cogs = 12 * 6;
    const margin = finalPrice - cogs;
    const marginPercent = (margin / finalPrice) * 100;
    return { margin, marginPercent };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Offer submitted for approval!');
    onClose();
  };

  const finalPrice = calculateFinalPrice();
  const { margin, marginPercent } = calculateMargin();
  
  const threePackFinalPrice = calculateThreePackFinalPrice();
  const { margin: threePackMargin, marginPercent: threePackMarginPercent } = calculateThreePackMargin();
  
  const sixPackFinalPrice = calculateSixPackFinalPrice();
  const { margin: sixPackMargin, marginPercent: sixPackMarginPercent } = calculateSixPackMargin();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '6px',
        padding: '28px',
        position: 'relative',
      }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Create New Offer</h2>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>
          Set pricing for a specific product within a campaign
        </p>

        <form onSubmit={handleSubmit}>
          {/* Your Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '6px' }}>
              YOUR NAME *
            </label>
            <input
              type="text"
              value={requestorName}
              onChange={(e) => setRequestorName(e.target.value)}
              placeholder="Your name"
              required
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

          {/* Campaign & Channel Selection */}
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '6px' }}>
                  CAMPAIGN *
                </label>
                <select
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  required
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
                  <option value="">Select a campaign...</option>
                  <option value="valentines">💝 Valentine's Day 2026</option>
                  <option value="evergreen">🌲 Evergreen</option>
                  <option value="spring">🌸 Spring Renewal</option>
                  <option value="summer">☀️ Summer Sale</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '6px' }}>
                  YOUR CHANNEL *
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  required
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
                  <option value="">Select your channel...</option>
                  <option value="internal-google">🔍 Internal Google</option>
                  <option value="meta">📘 Meta</option>
                  <option value="youtube">📺 YouTube</option>
                  <option value="tiktok">🎵 TikTok</option>
                  <option value="amazon">🛒 Amazon</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '8px' }}>
              SELECT PRODUCT *
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px'
            }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  style={{
                    background: '#282828',
                    padding: '16px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: selectedProduct === product.id ? '2px solid #1db954' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{product.emoji}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{product.name}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>${product.price.toFixed(2)} base</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '24px 0 16px', color: '#1db954' }}>
            💰 Set Your Pricing
          </h3>
          <p style={{ fontSize: '13px', color: '#b3b3b3', marginBottom: '16px' }}>
            Enter either $ Off, % Discount, or Target Price - all fields auto-calculate. Margin shown based on $12 COGS.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {/* Single Unit */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '12px' }}>Single Unit</div>
              
              <div style={{
                background: '#282828',
                padding: '8px',
                borderRadius: '6px',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '10px', color: '#888' }}>BASE PRICE</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                  ${basePrice.toFixed(2)}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#888' }}>$ OFF</label>
                <input
                  type="number"
                  value={singleDollarOff}
                  onChange={(e) => {
                    setSingleDollarOff(e.target.value);
                    setSinglePercentOff('');
                    setSingleTargetPrice('');
                  }}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#888' }}>% DISCOUNT</label>
                <input
                  type="number"
                  value={singlePercentOff}
                  onChange={(e) => {
                    setSinglePercentOff(e.target.value);
                    setSingleDollarOff('');
                    setSingleTargetPrice('');
                  }}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#888' }}>TARGET PRICE</label>
                <input
                  type="number"
                  value={singleTargetPrice}
                  onChange={(e) => {
                    setSingleTargetPrice(e.target.value);
                    setSingleDollarOff('');
                    setSinglePercentOff('');
                  }}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{
                background: '#1db954',
                padding: '10px',
                borderRadius: '6px',
                textAlign: 'center',
                marginBottom: '8px'
              }}>
                <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.6)' }}>FINAL PRICE</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>
                  ${finalPrice.toFixed(2)}
                </div>
              </div>

              <div style={{
                background: '#282828',
                padding: '8px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '10px', color: '#888' }}>MARGIN</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1db954' }}>
                  ${margin.toFixed(2)} ({marginPercent.toFixed(0)}%)
                </div>
              </div>
            </div>

            {/* 3-Pack Calculator */}
            <div style={{
              background: 'rgba(29, 185, 84, 0.05)',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid rgba(29, 185, 84, 0.3)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>3-Pack</div>
              
              <div style={{ marginBottom: '12px', padding: '8px', background: '#282828', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>BASE PRICE</div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>${threePackBase.toFixed(2)}</div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#888' }}>$ OFF</label>
                <input
                  type="number"
                  value={threePackDollarOff}
                  onChange={(e) => {
                    setThreePackDollarOff(e.target.value);
                    setThreePackPercentOff('');
                    setThreePackTargetPrice('');
                  }}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#888' }}>% DISCOUNT</label>
                <input
                  type="number"
                  value={threePackPercentOff}
                  onChange={(e) => {
                    setThreePackPercentOff(e.target.value);
                    setThreePackDollarOff('');
                    setThreePackTargetPrice('');
                  }}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#888' }}>TARGET PRICE</label>
                <input
                  type="number"
                  value={threePackTargetPrice}
                  onChange={(e) => {
                    setThreePackTargetPrice(e.target.value);
                    setThreePackDollarOff('');
                    setThreePackPercentOff('');
                  }}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{
                background: '#1db954',
                padding: '10px',
                borderRadius: '6px',
                textAlign: 'center',
                marginBottom: '8px'
              }}>
                <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.6)' }}>FINAL PRICE</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>
                  ${threePackFinalPrice.toFixed(2)}
                </div>
              </div>

              <div style={{
                background: '#282828',
                padding: '8px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '10px', color: '#888' }}>MARGIN</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1db954' }}>
                  ${threePackMargin.toFixed(2)} ({threePackMarginPercent.toFixed(0)}%)
                </div>
              </div>
            </div>

            {/* 6-Pack Calculator */}
            <div style={{
              background: 'rgba(29, 185, 84, 0.1)',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid rgba(29, 185, 84, 0.5)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>6-Pack</div>
              
              <div style={{ marginBottom: '12px', padding: '8px', background: '#282828', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>BASE PRICE</div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>${sixPackBase.toFixed(2)}</div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#888' }}>$ OFF</label>
                <input
                  type="number"
                  value={sixPackDollarOff}
                  onChange={(e) => {
                    setSixPackDollarOff(e.target.value);
                    setSixPackPercentOff('');
                    setSixPackTargetPrice('');
                  }}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#888' }}>% DISCOUNT</label>
                <input
                  type="number"
                  value={sixPackPercentOff}
                  onChange={(e) => {
                    setSixPackPercentOff(e.target.value);
                    setSixPackDollarOff('');
                    setSixPackTargetPrice('');
                  }}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#888' }}>TARGET PRICE</label>
                <input
                  type="number"
                  value={sixPackTargetPrice}
                  onChange={(e) => {
                    setSixPackTargetPrice(e.target.value);
                    setSixPackDollarOff('');
                    setSixPackPercentOff('');
                  }}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{
                background: '#1db954',
                padding: '10px',
                borderRadius: '6px',
                textAlign: 'center',
                marginBottom: '8px'
              }}>
                <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.6)' }}>FINAL PRICE</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>
                  ${sixPackFinalPrice.toFixed(2)}
                </div>
              </div>

              <div style={{
                background: '#282828',
                padding: '8px',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '10px', color: '#888' }}>MARGIN</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1db954' }}>
                  ${sixPackMargin.toFixed(2)} ({sixPackMarginPercent.toFixed(0)}%)
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '6px' }}>
              NOTES (OPTIONAL)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional context about this pricing decision, competitive considerations, margin goals, etc."
              rows={4}
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

          {/* Info Box */}
          <div style={{
            background: 'rgba(255, 193, 7, 0.1)',
            borderLeft: '4px solid #ffc107',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{ fontWeight: '700', marginBottom: '8px' }}>📋 What happens next?</div>
            <div style={{ fontSize: '14px', color: '#b3b3b3', lineHeight: '1.6' }}>
              Your pricing request will be sent to Admin for approval. Once approved, you can request landing pages for this campaign.
            </div>
          </div>

          {/* Buttons */}
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
              }}
            >
              Submit for Approval
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
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

