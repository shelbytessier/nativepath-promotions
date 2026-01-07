'use client';

import Modal from './Modal';

interface TestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: {
    id: string;
    cid: string;
    name: string;
    product: string;
    status: string;
    visits: number;
    conversions: number;
    conversionRate: number;
    winner: string | null;
  } | null;
}

export default function TestDetailModal({ isOpen, onClose, test }: TestDetailModalProps) {
  if (!test) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        maxWidth: '700px',
        width: '100%',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '24px',
        position: 'relative',
      }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#3b82f6',
            background: 'rgba(59,130,246,0.15)',
            padding: '4px 12px',
            borderRadius: '4px',
            display: 'inline-block',
            marginBottom: '12px',
          }}>
            {test.cid}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{test.name}</h2>
          <p style={{ fontSize: '14px', color: '#888' }}>{test.product}</p>
        </div>

        {/* Summary Stats */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <h3 style={{ fontSize: '14px', color: '#888', fontWeight: '600', marginBottom: '16px' }}>TEST SUMMARY</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                {test.visits.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>Total Visits</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1db954', marginBottom: '4px' }}>
                {test.conversions}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>Conversions</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#eab308', marginBottom: '4px' }}>
                {test.conversionRate}%
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>Conversion Rate</div>
            </div>
          </div>
        </div>

        {/* Winner */}
        {test.winner && (
          <div style={{
            background: 'rgba(29,185,84,0.1)',
            border: '1px solid rgba(29,185,84,0.3)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: '#1db954' }}>Winner Declared!</h3>
            <p style={{ fontSize: '14px', color: '#b3b3b3' }}>{test.winner}</p>
          </div>
        )}

        {/* Details */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '14px', color: '#888', fontWeight: '600', marginBottom: '12px' }}>TEST DETAILS</h3>
          <p style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6' }}>
            Detailed variant comparisons, statistical significance, and performance charts available in full implementation.
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
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

