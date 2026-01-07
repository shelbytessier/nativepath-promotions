'use client';

import { useState } from 'react';
import Modal from './Modal';

interface CampaignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: {
    id: string;
    emoji: string;
    code: string;
    name: string;
    dates: string;
    offers: number;
    pages: number;
    daysLeft: number | string;
    status: string;
  } | null;
}

// Mock pages data
const mockPages = [
  { id: 1, name: 'VDay - Meta - Joint Pain', offer: 'VDAY-COL25', channel: 'Meta', status: 'live' },
  { id: 2, name: 'VDay - Meta - Energy', offer: 'VDAY-COL25', channel: 'Meta', status: 'live' },
  { id: 3, name: 'VDay - Google - Testimonial', offer: 'VDAY-COL25', channel: 'Google', status: 'live' },
  { id: 4, name: 'VDay - Meta - Hydrate', offer: 'VDAY-HYD30', channel: 'Meta', status: 'live' },
  { id: 5, name: 'VDay - TikTok - Video Testimonials', offer: 'VDAY-HYD30', channel: 'TikTok', status: 'live' },
  { id: 6, name: 'VDay - Meta - Probiotics', offer: 'VDAY-PRO60', channel: 'Meta', status: 'live' },
  { id: 7, name: 'VDay - Meta - Gut Health', offer: 'VDAY-PRO60', channel: 'Meta', status: 'dev' },
  { id: 8, name: 'VDay - Google - Pain Free', offer: 'VDAY-COL25', channel: 'Google', status: 'dev' },
];

export default function CampaignDetailModal({ isOpen, onClose, campaign }: CampaignDetailModalProps) {
  const [pageFilter, setPageFilter] = useState<'all' | 'live' | 'dev'>('all');

  if (!campaign) return null;

  const filteredPages = mockPages.filter(page => {
    if (pageFilter === 'all') return true;
    return page.status === pageFilter;
  });

  const liveCount = mockPages.filter(p => p.status === 'live').length;
  const devCount = mockPages.filter(p => p.status === 'dev').length;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '24px',
        position: 'relative',
      }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{campaign.emoji}</div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#1db954',
            background: 'rgba(29,185,84,0.15)',
            padding: '4px 12px',
            borderRadius: '4px',
            display: 'inline-block',
            marginBottom: '12px',
          }}>
            {campaign.code}
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{campaign.name}</h2>
          <p style={{ fontSize: '14px', color: '#888' }}>{campaign.dates}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1db954', marginBottom: '4px' }}>{campaign.offers}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Offers</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>{campaign.pages}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Pages</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1db954', marginBottom: '4px' }}>{liveCount}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Live</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#eab308', marginBottom: '4px' }}>{devCount}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>In Dev</div>
          </div>
        </div>

        {/* Pages in this Campaign */}
        <div className="campaign-modal-section">
          <div className="campaign-modal-section-title">PAGES IN THIS CAMPAIGN</div>
          
          {/* Filter Chips */}
          <div className="campaign-pages-filter">
            <span 
              className={`campaign-page-filter ${pageFilter === 'all' ? 'active' : ''}`}
              onClick={() => setPageFilter('all')}
            >
              All ({mockPages.length})
            </span>
            <span 
              className={`campaign-page-filter ${pageFilter === 'live' ? 'active' : ''}`}
              onClick={() => setPageFilter('live')}
            >
              Live ({liveCount})
            </span>
            <span 
              className={`campaign-page-filter ${pageFilter === 'dev' ? 'active' : ''}`}
              onClick={() => setPageFilter('dev')}
            >
              In Dev ({devCount})
            </span>
          </div>

          {/* Pages List */}
          <div className="campaign-pages-list">
            {filteredPages.map((page) => (
              <div key={page.id} className="campaign-page-item">
                <div className="campaign-page-left">
                  <div className="campaign-page-name">{page.name}</div>
                  <div className="campaign-page-meta">{page.offer} • {page.channel}</div>
                </div>
                <div className="campaign-page-right">
                  <span className={`campaign-page-status ${page.status}`}>
                    {page.status === 'live' ? '● Live' : 'In Dev'}
                  </span>
                  <span className="campaign-page-view">View →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
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
          Close
        </button>
      </div>
    </Modal>
  );
}

