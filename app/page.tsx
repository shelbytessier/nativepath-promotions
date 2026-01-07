'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-1px' }}>
            Dashboard
          </h1>
          <p style={{ color: '#b3b3b3', fontSize: '14px', fontWeight: 500 }}>
            3 items need attention • 2 campaigns live
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/testing" style={{ textDecoration: 'none' }}>
            <button 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 20px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '6px', 
                color: '#fff', 
                fontSize: '14px', 
                fontWeight: 500, 
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🧪 View Testing
            </button>
          </Link>
          <Link href="/products" style={{ textDecoration: 'none' }}>
            <button 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 20px', 
                background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)', 
                border: 'none', 
                borderRadius: '6px', 
                color: '#000', 
                fontSize: '14px', 
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(29, 185, 84, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 185, 84, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 185, 84, 0.3)';
              }}
            >
              ➕ Quick Add
            </button>
          </Link>
        </div>
      </div>

      {/* Needs Attention Section */}
      <div className="dashboard-section-title">⚠️ Needs Attention</div>
      <div className="attention-grid">
        <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="attention-card critical">
            <div className="attention-header">
              <div className="attention-icon critical">📦</div>
              <span className="attention-badge critical">CRITICAL</span>
            </div>
            <div className="attention-title">Low Stock Alert</div>
            <div className="attention-desc">Probiotics 30B — Only 142 units remaining</div>
            <div className="attention-action">Review Inventory →</div>
          </div>
        </Link>
        <div 
          className="attention-card warning"
          onClick={() => router.push('/offers')}
          style={{ cursor: 'pointer' }}
        >
          <div className="attention-header">
            <div className="attention-icon warning">💰</div>
            <span className="attention-badge warning">WARNING</span>
          </div>
          <div className="attention-title">Margin Below Target</div>
          <div className="attention-desc">Sleep Support bundle at 47% on Facebook channel</div>
          <div className="attention-action">Adjust Pricing →</div>
        </div>
        <Link href="/calendar" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="attention-card info">
            <div className="attention-header">
              <div className="attention-icon info">📄</div>
              <span className="attention-badge info">REVIEW</span>
            </div>
            <div className="attention-title">Pages Pending Approval</div>
            <div className="attention-desc">3 landing pages waiting for review</div>
            <div className="attention-action">Review Pages →</div>
          </div>
        </Link>
      </div>

      {/* Bottom Layout: Quick Actions + Active Campaigns */}
      <div className="dashboard-bottom-layout">
        {/* Quick Actions */}
        <div className="quick-launch-section">
          <div className="dashboard-section-title">⚡ Quick Actions</div>
          <div className="quick-launch-grid">
            <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-launch-btn">
                <div className="quick-launch-icon">📦</div>
                <span className="quick-launch-text">Add Product</span>
              </div>
            </Link>
            <Link href="/offers" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-launch-btn">
                <div className="quick-launch-icon">🏷️</div>
                <span className="quick-launch-text">Create Offer</span>
              </div>
            </Link>
            <Link href="/promotions" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-launch-btn">
                <div className="quick-launch-icon">📅</div>
                <span className="quick-launch-text">New Campaign</span>
              </div>
            </Link>
            <Link href="/margin-calc" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-launch-btn">
                <div className="quick-launch-icon">🧮</div>
                <span className="quick-launch-text">Calculator</span>
              </div>
            </Link>
            <Link href="/testing" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-launch-btn">
                <div className="quick-launch-icon">🧪</div>
                <span className="quick-launch-text">Testing</span>
              </div>
            </Link>
            <Link href="/calendar" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-launch-btn">
                <div className="quick-launch-icon">📄</div>
                <span className="quick-launch-text">Page Manager</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="campaigns-section">
          <div className="campaigns-header">
            <span style={{ fontSize: '18px' }}>📅</span>
            <span className="campaigns-title">Active Campaigns</span>
          </div>
          <div className="campaign-list-new">
            <Link href="/offers" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="campaign-item-new">
                <div className="campaign-info-new">
                  <span className="campaign-emoji">🎄</span>
                  <div className="campaign-details-new">
                    <span className="campaign-name-new">New Year Sale</span>
                    <span className="campaign-date-new">Ends Jan 15</span>
                  </div>
                </div>
                <span className="campaign-status-new live">Live</span>
              </div>
            </Link>
            <Link href="/offers" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="campaign-item-new">
                <div className="campaign-info-new">
                  <span className="campaign-emoji">💝</span>
                  <div className="campaign-details-new">
                    <span className="campaign-name-new">BOGO Collagen</span>
                    <span className="campaign-date-new">Ends Jan 20</span>
                  </div>
                </div>
                <span className="campaign-status-new live">Live</span>
              </div>
            </Link>
            <Link href="/offers" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="campaign-item-new">
                <div className="campaign-info-new">
                  <span className="campaign-emoji">🚀</span>
                  <div className="campaign-details-new">
                    <span className="campaign-name-new">New Product Launch</span>
                    <span className="campaign-date-new">Starts Feb 1</span>
                  </div>
                </div>
                <span className="campaign-status-new scheduled">Scheduled</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
