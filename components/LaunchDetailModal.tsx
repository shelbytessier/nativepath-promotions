'use client';

import Modal from './Modal';

interface LaunchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  launch: {
    id: string;
    name: string;
    icon: string;
    sku: string;
    type: string;
    status: 'on-track' | 'delayed' | 'planning';
    originalDate: string;
    currentDate: string;
    price: string;
    margin: string;
    inventory: string;
    timeline: Array<{
      milestone: string;
      date: string;
      status: 'completed' | 'in-progress' | 'pending';
    }>;
    allocation: {
      retention: number;
      acquisition: number;
    };
    notes: string;
  } | null;
}

export default function LaunchDetailModal({ isOpen, onClose, launch }: LaunchDetailModalProps) {
  if (!launch) return null;

  const statusColors = {
    'on-track': { bg: 'rgba(29,185,84,0.15)', color: '#1db954', label: 'On Track' },
    'delayed': { bg: 'rgba(234,179,8,0.15)', color: '#eab308', label: 'Delayed' },
    'planning': { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', label: 'Planning' },
  };

  const statusStyle = statusColors[launch.status];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        maxWidth: '550px',
        width: '100%',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '6px',
        padding: '24px',
        position: 'relative',
      }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', paddingRight: '30px' }}>
          <div>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{launch.icon}</div>
            <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>{launch.name}</h2>
            <p style={{ fontSize: '13px', color: '#666' }}>SKU: {launch.sku} • {launch.type}</p>
          </div>
          <span style={{ 
            background: statusStyle.bg, 
            color: statusStyle.color, 
            padding: '6px 14px', 
            borderRadius: '8px', 
            fontSize: '12px', 
            fontWeight: '600' 
          }}>
            {statusStyle.label}
          </span>
        </div>

        {/* Key Info Grid - Row 1: Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>ORIGINAL DATE</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{launch.originalDate}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>CURRENT DATE</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{launch.currentDate}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>TARGET PRICE</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{launch.price}</div>
          </div>
        </div>

        {/* Key Info Grid - Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>TARGET MARGIN</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1db954' }}>{launch.margin}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>EXPECTED INVENTORY</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{launch.inventory}</div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '12px', color: '#666', marginBottom: '12px', fontWeight: '600' }}>TIMELINE</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {launch.timeline.map((item, idx) => {
              const timelineStyles = {
                completed: { bg: 'rgba(29,185,84,0.08)', border: '#1db954', icon: '✓', iconColor: '#1db954' },
                'in-progress': { bg: 'rgba(59,130,246,0.08)', border: '#3b82f6', icon: '○', iconColor: '#3b82f6' },
                pending: { bg: 'rgba(255,255,255,0.03)', border: '#444', icon: '○', iconColor: '#666' },
              };
              const style = timelineStyles[item.status];

              return (
                <div key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '10px 14px', 
                  background: style.bg, 
                  borderRadius: '8px', 
                  borderLeft: `3px solid ${style.border}` 
                }}>
                  <span style={{ color: style.iconColor }}>{style.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{item.milestone}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>{item.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory Allocation */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '12px', color: '#666', marginBottom: '12px', fontWeight: '600' }}>INVENTORY ALLOCATION</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>Retention (DTC)</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1db954' }}>{launch.allocation.retention}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>Acquisition</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>{launch.allocation.acquisition}%</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '14px' }}>
          <h4 style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>NOTES</h4>
          <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.5' }}>{launch.notes}</p>
        </div>
      </div>
    </Modal>
  );
}



