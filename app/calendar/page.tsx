'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageRequestModal from '@/components/PageRequestModal';
import PageDetailModal from '@/components/PageDetailModal';
import OfferDetailModal from '@/components/OfferDetailModal';
import SearchableSelect from '@/components/SearchableSelect';

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
  qaStatus?: 'ready-for-qa' | 'in-qa' | 'qa-complete' | 'qa-issues';
}

export default function PageManagerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [qaStatusFilter, setQaStatusFilter] = useState('all');
  const [offerFilter, setOfferFilter] = useState('all');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isPageDetailModalOpen, setIsPageDetailModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const pages: LandingPage[] = [
    {
      id: 'qa-1',
      name: '7 Reasons Collagen LP (Facebook)',
      url: 'health.nativepath.com/7-reasons-everyone-should-be-taking-this-protein-1107-fb-v8',
      product: 'Collagen 25s',
      campaign: 'VDAY-26',
      campaignColor: '#ec4899',
      channel: 'Meta',
      channelEmoji: '📘',
      offer: 'VDAY-COL25',
      lpType: 'Listicle',
      leadAngle: ['Fear', 'Problem/Solution'],
      painPoint: 'Joint Pain',
      status: 'live',
      qaStatus: 'in-qa'
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
      status: 'live',
      qaStatus: 'qa-complete'
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
      status: 'live',
      qaStatus: 'qa-complete'
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
      status: 'dev',
      qaStatus: 'ready-for-qa'
    },
    {
      id: '5',
      name: '7 Reasons Collagen LP (Facebook)',
      url: 'health.nativepath.com/7-reasons-everyone-should-be-taking-this-protein-1107-fb-v8',
      product: 'Collagen 25s',
      campaign: 'VDAY-26',
      campaignColor: '#ec4899',
      channel: 'Meta',
      channelEmoji: '📘',
      offer: 'VDAY-COL25',
      lpType: 'Listicle',
      leadAngle: ['Education', 'Problem/Solution'],
      painPoint: 'Aging/Joint Pain',
      status: 'dev',
      qaStatus: 'in-qa'
    },
    {
      id: '6',
      name: 'Hydrate Spring LP',
      url: 'nativepath.com/hydrate-spring',
      product: 'Hydrate',
      campaign: 'SPRNG-26',
      campaignColor: '#f59e0b',
      channel: 'Email',
      channelEmoji: '📧',
      offer: 'SPRNG-HYD',
      lpType: 'Advertorial',
      leadAngle: ['Problem/Solution'],
      painPoint: 'Dehydration',
      status: 'dev',
      qaStatus: 'qa-issues'
    }
  ];

  const filteredPages = pages.filter(page => {
    const matchesSearch = searchTerm === '' || 
      page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCampaign = campaignFilter === 'all' || page.campaign === campaignFilter;
    const matchesChannel = channelFilter === 'all' || page.channel === channelFilter;
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesQaStatus = qaStatusFilter === 'all' || page.qaStatus === qaStatusFilter;
    const matchesOffer = offerFilter === 'all' || page.offer === offerFilter;

    return matchesSearch && matchesCampaign && matchesChannel && matchesStatus && matchesQaStatus && matchesOffer;
  });

  const liveCount = pages.filter(p => p.status === 'live').length;
  const devCount = pages.filter(p => p.status === 'dev').length;
  const endedCount = pages.filter(p => p.status === 'ended').length;

  return (
    <div style={{ padding: '48px 56px' }}>
      <div className="content-header">
        <h1 className="header-title">Page Manager</h1>
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

        {/* Filters Row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <SearchableSelect
            label="CAMPAIGN"
            value={campaignFilter}
            onChange={setCampaignFilter}
            options={[
              { value: 'all', label: 'All Campaigns' },
              { value: 'VDAY-26', label: '💝 VDAY-26' },
              { value: 'EVRGN', label: '🌲 EVRGN - Evergreen' },
              { value: 'SPRNG-26', label: '🌸 SPRNG-26' }
            ]}
          />
          <SearchableSelect
            label="CHANNEL"
            value={channelFilter}
            onChange={setChannelFilter}
            options={[
              { value: 'all', label: 'All Channels' },
              { value: 'Meta', label: '📘 Meta' },
              { value: 'Google', label: '🔍 Google' },
              { value: 'YouTube', label: '📺 YouTube' },
              { value: 'TikTok', label: '🎵 TikTok' }
            ]}
          />
          <SearchableSelect
            label="STATUS"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'live', label: '🟢 Live' },
              { value: 'dev', label: '🟡 In Dev' },
              { value: 'ended', label: '⚫ Ended' }
            ]}
          />
          <SearchableSelect
            label="OFFER"
            value={offerFilter}
            onChange={setOfferFilter}
            options={[
              { value: 'all', label: 'All Offers' },
              { value: 'VDAY-COL25', label: 'VDAY-COL25' },
              { value: 'VDAY-HYD30', label: 'VDAY-HYD30' },
              { value: 'EVRGN-COL', label: 'EVRGN-COL' },
              { value: 'SPRNG-PRO', label: 'SPRNG-PRO' }
            ]}
          />
          <SearchableSelect
            label="QA STATUS"
            value={qaStatusFilter}
            onChange={setQaStatusFilter}
            options={[
              { value: 'all', label: 'All QA Status' },
              { value: 'ready-for-qa', label: '📋 Ready for QA' },
              { value: 'in-qa', label: '🔍 In QA' },
              { value: 'qa-issues', label: '⚠️ QA Issues' },
              { value: 'qa-complete', label: '✅ QA Complete' }
            ]}
          />
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
                <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>QA STATUS</th>
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
                  onClick={() => {
                    setSelectedPage(page);
                    setIsPageDetailModalOpen(true);
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                    <div style={{ 
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {page.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#3b82f6',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '250px'
                    }}>
                      {page.url}
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ 
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      maxWidth: '150px'
                    }}>
                      {page.product}
                    </span>
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
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      display: 'inline-block'
                    }}>
                      {page.channelEmoji} {page.channel}
                    </span>
                  </td>
                  <td 
                    style={{ padding: '14px 12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOffer({
                        id: page.offer,
                        code: page.offer,
                        campaign: page.campaign,
                        product: page.product,
                        productIcon: '🦴',
                        sku: 'COL-25',
                        servings: '25',
                        status: 'active',
                        channels: [
                          { name: 'Web', active: true },
                          { name: 'Amazon', active: false }
                        ],
                        tiers: [
                          { label: 'Single', price: 33.99, shipping: '+$7.95', perServing: '$1.36' },
                          { label: '3-Pack', price: 87.00, originalPrice: 101.97, shipping: 'FREE', gift: 'Frother', save: '30%', perServing: '$1.16' },
                          { label: '6-Pack', price: 132.00, originalPrice: 203.94, shipping: 'FREE', gift: 'Frother', save: '45%', perServing: '$0.88' }
                        ],
                        blendedMargin: '58%',
                        pagesCount: 3
                      });
                      setIsOfferModalOpen(true);
                    }}
                  >
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '11px', 
                      color: '#1db954', 
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      whiteSpace: 'nowrap'
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
                    {page.qaStatus && (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        background: page.qaStatus === 'qa-complete' ? 'rgba(29,185,84,0.15)' : 
                                   page.qaStatus === 'qa-issues' ? 'rgba(239,68,68,0.15)' :
                                   page.qaStatus === 'in-qa' ? 'rgba(59,130,246,0.15)' :
                                   'rgba(245,158,11,0.15)',
                        color: page.qaStatus === 'qa-complete' ? '#1db954' : 
                               page.qaStatus === 'qa-issues' ? '#ef4444' :
                               page.qaStatus === 'in-qa' ? '#3b82f6' :
                               '#f59e0b',
                      }}>
                        {page.qaStatus === 'qa-complete' ? '✅ Complete' :
                         page.qaStatus === 'qa-issues' ? '⚠️ Issues' :
                         page.qaStatus === 'in-qa' ? '🔍 In QA' :
                         '📋 Ready'}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {page.qaStatus && page.qaStatus !== 'qa-complete' && (
                        <Link href={`/page-qa/review/${page.id}`}>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: '4px 12px',
                              background: 'rgba(29,185,84,0.15)',
                              border: '1px solid rgba(29,185,84,0.3)',
                              borderRadius: '4px',
                              color: '#1db954',
                              fontSize: '11px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            📝 Review
                          </button>
                        </Link>
                      )}
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
                    </div>
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

        {/* Page Detail Modal */}
        <PageDetailModal
          isOpen={isPageDetailModalOpen}
          onClose={() => {
            setIsPageDetailModalOpen(false);
            setSelectedPage(null);
          }}
          page={selectedPage}
        />

        {/* Offer Detail Modal */}
        <OfferDetailModal
          isOpen={isOfferModalOpen}
          onClose={() => {
            setIsOfferModalOpen(false);
            setSelectedOffer(null);
          }}
          offer={selectedOffer}
        />
      </div>
    </div>
  );
}
