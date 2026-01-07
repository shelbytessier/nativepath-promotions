'use client';

import { useState } from 'react';
import Modal from './Modal';

interface PageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: {
    id: string;
    name: string;
    url: string;
    product: string;
    campaign: string;
    channel: string;
    channelEmoji: string;
    offer: string;
    status: 'live' | 'dev' | 'ended';
  } | null;
}

export default function PageDetailModal({ isOpen, onClose, page }: PageDetailModalProps) {
  const [selectedCampaign, setSelectedCampaign] = useState('VDAY-26');
  const [selectedOffer, setSelectedOffer] = useState('VDAY-COL25');
  const [pageUrl, setPageUrl] = useState('');

  if (!page) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(pageUrl || page.url);
    alert('URL copied to clipboard!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        background: '#181818',
        borderRadius: '6px',
        padding: '32px',
        position: 'relative',
      }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{page.name}</h2>
            <a 
              href={`https://${page.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                fontSize: '13px', 
                color: '#3b82f6',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '8px'
              }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              {page.url}
            </a>
            <p style={{ color: '#b3b3b3', fontSize: '13px' }}>{page.channelEmoji} {page.channel} • {page.campaign}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{
              background: page.status === 'live' ? 'rgba(29, 185, 84, 0.2)' : page.status === 'dev' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: page.status === 'live' ? '#1db954' : page.status === 'dev' ? '#fbbf24' : '#ef4444',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              ● {page.status === 'live' ? 'Live' : page.status === 'dev' ? 'In Dev' : 'Ended'}
            </span>
            {page.status === 'live' && (
              <a 
                href={`https://${page.url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: '#1db954',
                  color: '#000',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                View Live ↗
              </a>
            )}
          </div>
        </div>

        {/* Editable Fields Section */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>
            PAGE SETTINGS
          </div>

          {/* Campaign & Offer Dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '6px' }}>CAMPAIGN</label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#282828',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px'
                }}
              >
                <option value="VDAY-26">💝 VDAY-26 - Valentine's Day 2026</option>
                <option value="EVRGN">🌲 EVRGN - Evergreen</option>
                <option value="SPRNG-26">🌸 SPRNG-26 - Spring Renewal 2026</option>
                <option value="SUMR-26">☀️ SUMR-26 - Summer Sale 2026</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '6px' }}>OFFER</label>
              <select
                value={selectedOffer}
                onChange={(e) => setSelectedOffer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#282828',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px'
                }}
              >
                <option value="VDAY-COL25">VDAY-COL25 - Collagen 25s</option>
                <option value="VDAY-HYD30">VDAY-HYD30 - Hydrate</option>
                <option value="VDAY-PRO60">VDAY-PRO60 - Probiotics 30B</option>
                <option value="EG-COL25">EG-COL25 - Collagen Evergreen</option>
              </select>
            </div>
          </div>

          {/* URL Field */}
          <div>
            <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '6px' }}>LIVE URL</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={pageUrl || `https://${page.url}`}
                onChange={(e) => setPageUrl(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: '#282828',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#1db954',
                  fontSize: '13px'
                }}
              />
              <button
                onClick={copyUrl}
                style={{
                  padding: '10px 14px',
                  background: '#282828',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#888',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
              <button
                onClick={() => window.open(pageUrl || `https://${page.url}`, '_blank')}
                style={{
                  padding: '10px 14px',
                  background: '#282828',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#888',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Open ↗
              </button>
            </div>
            <div style={{ fontSize: '10px', color: '#555', marginTop: '6px' }}>
              Edit the URL if incorrect. Changes are saved automatically.
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', color: '#666', letterSpacing: '0.5px' }}>
          PERFORMANCE SUMMARY
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#282828', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>12,847</div>
            <div style={{ fontSize: '11px', color: '#888' }}>Visits</div>
          </div>
          <div style={{ background: '#282828', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1db954' }}>342</div>
            <div style={{ fontSize: '11px', color: '#888' }}>Orders</div>
          </div>
          <div style={{ background: '#282828', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1db954' }}>$28,400</div>
            <div style={{ fontSize: '11px', color: '#888' }}>Revenue</div>
          </div>
          <div style={{ background: '#282828', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1db954' }}>2.4x</div>
            <div style={{ fontSize: '11px', color: '#888' }}>ROAS</div>
          </div>
        </div>

        {/* Page History */}
        <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', color: '#666', letterSpacing: '0.5px' }}>
          PAGE HISTORY
        </h3>
        <div style={{ background: '#282828', borderRadius: '6px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ borderLeft: '2px solid #1db954', paddingLeft: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#1db954', fontWeight: '600' }}>Jan 25, 2026 - Status → Live</div>
            <div style={{ fontSize: '13px', color: '#b3b3b3', marginTop: '4px' }}>URL added by Web Team</div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>By: Dev Team</div>
          </div>
          <div style={{ borderLeft: '2px solid #3b82f6', paddingLeft: '16px' }}>
            <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600' }}>Jan 20, 2026 - Page Requested</div>
            <div style={{ fontSize: '13px', color: '#b3b3b3', marginTop: '4px' }}>
              Campaign: {page.campaign} • Offer: {page.offer} • Hook: {page.name.split('|').slice(-1)[0]}
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>By: Sarah M.</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => alert('Changes saved!')}
            style={{
              padding: '12px 24px',
              background: '#1db954',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
          <button
            style={{
              padding: '12px 24px',
              background: '#282828',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Change Status
          </button>
          <button
            style={{
              padding: '12px 24px',
              background: '#282828',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Add Note
          </button>
          <button
            onClick={() => {
              onClose();
              window.location.href = '/testing';
            }}
            style={{
              marginLeft: 'auto',
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            View in Testing
          </button>
        </div>
      </div>
    </Modal>
  );
}



