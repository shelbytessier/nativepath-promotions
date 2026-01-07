'use client';

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

export default function CampaignDetailModal({ isOpen, onClose, campaign }: CampaignDetailModalProps) {
  if (!campaign) return null;

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1db954', marginBottom: '4px' }}>{campaign.offers}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Offers</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>{campaign.pages}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Pages</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#eab308', marginBottom: '4px' }}>{campaign.daysLeft}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Days Left</div>
          </div>
        </div>

        {/* Details */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '14px', color: '#888', fontWeight: '600', marginBottom: '12px' }}>CAMPAIGN DETAILS</h3>
          <p style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6' }}>
            Campaign information, channel strategies, and performance metrics will be displayed here.
          </p>
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

