'use client';

import { useState } from 'react';
import PageRequestModal from '@/components/PageRequestModal';

interface LandingPage {
  id: string;
  name: string;
  url: string;
  product: string;
  campaign: string;
  campaignColor: string;
  channel: string;
  channelEmoji: string;
  offer: string;
  lpType: string;
  leadAngle: string[];
  painPoint: string;
  status: 'live' | 'dev' | 'ended';
}

export default function PageManagerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const pages: LandingPage[] = [
    {
      id: '1',
      name: 'VDay-26 | Meta Cold | Joint Pain Angle',
      url: 'instapage.com/vday-meta-joint',
      product: 'Collagen 25s',
      campaign: 'VDAY-26',
      campaignColor: '#ec4899',
      channel: 'Meta',
      channelEmoji: '📘',
      offer: 'VDAY-COL25',
      lpType: 'Listicle',
      leadAngle: ['Fear', 'Problem/Solution'],
      painPoint: 'Joint Pain',
      status: 'live'
    },
    {
      id: '2',
      name: 'VDay - Meta Cold - Energy',
      url: 'instapage.com/vday-meta-energy',
      product: 'Collagen 25s',
      campaign: 'VDAY-26',
      campaignColor: '#ec4899',
      channel: 'Meta',
      channelEmoji: '📘',
      offer: 'VDAY-COL25',
      lpType: 'VSL',
      leadAngle: ['Hidden Truth'],
      painPoint: 'Low Energy',
      status: 'live'
    },
    {
      id: '3',
      name: 'Evergreen | Google | Skin Health',
      url: 'instapage.com/evergr-google-skin',
      product: 'Collagen Peptides',
      campaign: 'EVRGN',
      campaignColor: '#1db954',
      channel: 'Google',
      channelEmoji: '🔍',
      offer: 'EVRGN-COL',
      lpType: 'Advertorial',
      leadAngle: ['Problem/Solution'],
      painPoint: 'Aging Skin',
      status: 'live'
    },
    {
      id: '4',
      name: 'Spring - YouTube - Weight Loss',
      url: 'instapage.com/spring-yt-weight',
      product: 'Probiotic 40B',
      campaign: 'SPRNG-26',
      campaignColor: '#f59e0b',
      channel: 'YouTube',
      channelEmoji: '📺',
      offer: 'SPRNG-PRO',
      lpType: 'VSL',
      leadAngle: ['Hidden Cause'],
      painPoint: 'Weight Gain',
      status: 'dev'
    }
  ];

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const liveCount = pages.filter(p => p.status === 'live').length;
  const devCount = pages.filter(p => p.status === 'dev').length;
  const endedCount = pages.filter(p => p.status === 'ended').length;

  return (
    <div className="p-8">
      <div className="content-header">
        <h1 className="header-title">Page Manager</h1>
        <p className="header-subtitle">Track all landing pages • Request new pages • Web team adds URLs when live</p>
      </div>

      <div className="content-body">
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1db954' }}>{liveCount}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Live Pages</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#eab308' }}>{devCount}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>In Development</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#888' }}>{endedCount}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Unpublished</div>
          </div>
        </div>

        {/* Search & Request Button */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search pages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 12px 10px 36px', 
                background: '#282828', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff', 
                borderRadius: '6px', 
                fontSize: '13px' 
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '14px' }}>🔍</span>
          </div>
          <div style={{ color: '#888', fontSize: '12px' }}>
            Showing <strong style={{ color: '#fff' }}>{filteredPages.length}</strong> pages
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            style={{ 
              padding: '10px 20px', 
              background: '#1db954', 
              color: '#000', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1ed760'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1db954'}
          >
            + Request New Page
          </button>
        </div>

        {/* Landing Pages Table */}
        <div style={{ background: '#181818', borderRadius: '6px', overflow: 'hidden', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
            <thead>
              <tr style={{ background: '#282828' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>PAGE NAME</th>
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>PRODUCT</th>
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>CAMPAIGN</th>
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>CHANNEL</th>
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>OFFER</th>
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>LP TYPE</th>
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>LEAD ANGLE</th>
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>PAIN POINT</th>
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>STATUS</th>
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page, index) => (
                <tr 
                  key={page.id} 
                  style={{ 
                    borderBottom: index < filteredPages.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '600' }}>{page.name}</div>
                    <div style={{ fontSize: '11px', color: '#1db954' }}>{page.url}</div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ fontSize: '12px' }}>{page.product}</span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ 
                      color: page.campaignColor, 
                      fontSize: '11px', 
                      fontFamily: 'monospace' 
                    }}>
                      {page.campaign}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ 
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))', 
                      border: '1px solid rgba(59, 130, 246, 0.4)', 
                      color: '#60a5fa', 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '600' 
                    }}>
                      {page.channelEmoji} {page.channel}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '11px', 
                      color: '#1db954', 
                      cursor: 'pointer' 
                    }}>
                      {page.offer}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ 
                      background: 'rgba(255,255,255,0.08)', 
                      color: '#b3b3b3', 
                      padding: '2px 8px', 
                      borderRadius: '3px', 
                      fontSize: '10px' 
                    }}>
                      {page.lpType}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    {page.leadAngle.map((angle, idx) => (
                      <span 
                        key={idx}
                        style={{ 
                          background: 'rgba(29,185,84,0.15)', 
                          color: '#1db954', 
                          padding: '2px 8px', 
                          borderRadius: '3px', 
                          fontSize: '10px',
                          marginRight: '4px'
                        }}
                      >
                        {angle}
                      </span>
                    ))}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ fontSize: '11px', color: '#888' }}>{page.painPoint}</span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ 
                      color: page.status === 'live' ? '#1db954' : page.status === 'dev' ? '#eab308' : '#666', 
                      fontSize: '12px' 
                    }}>
                      ● {page.status === 'live' ? 'Live' : page.status === 'dev' ? 'In Dev' : 'Ended'}
                          </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                        <button
                      style={{ 
                        background: '#282828', 
                        border: 'none', 
                        color: '#888', 
                        padding: '4px 12px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#383838';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#282828';
                        e.currentTarget.style.color = '#888';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`View details for ${page.name}`);
                      }}
                    >
                      View
                        </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                          </div>
                          
        {filteredPages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '14px' }}>No pages found matching "{searchTerm}"</div>
          </div>
        )}

        {/* Page Request Modal */}
        <PageRequestModal 
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      </div>
    </div>
  );
}
