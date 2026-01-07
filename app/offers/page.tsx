'use client';

import { useState } from 'react';
import OfferDetailModal from '@/components/OfferDetailModal';
import CreateOfferModal from '@/components/CreateOfferModal';
import SearchableSelect from '@/components/SearchableSelect';

interface Offer {
  id: string;
  productName: string;
  productCode: string;
  servings: number;
  emoji: string;
  status: 'active' | 'pending' | 'expired';
  channels: { name: string; active: boolean }[];
  campaign: string;
  tiers: {
    single: { price: number; shipping: number };
    threePack: { originalPrice: number; price: number; gift?: string; savePercent: number };
    sixPack: { originalPrice: number; price: number; gift?: string; savePercent: number };
  };
  blendedMargin: number;
  pagesCount: number;
}

const mockOffers: Offer[] = [
  {
    id: 'VDAY-COL25',
    productName: 'Collagen 25s',
    productCode: 'COL-25',
    servings: 25,
    emoji: '🦴',
    status: 'active',
    channels: [
      { name: 'Web', active: true },
      { name: 'Amazon', active: true },
      { name: 'Walmart', active: true },
      { name: 'Shopify', active: false },
    ],
    campaign: 'valentines',
    tiers: {
      single: { price: 33.99, shipping: 9.00 },
      threePack: { originalPrice: 110.97, price: 87.00, gift: 'Frother', savePercent: 35 },
      sixPack: { originalPrice: 212.94, price: 132.00, gift: 'Frother', savePercent: 45 },
    },
    blendedMargin: 71,
    pagesCount: 3,
  },
  {
    id: 'VDAY-HYD30',
    productName: 'Hydrate',
    productCode: 'HYD-30',
    servings: 30,
    emoji: '💧',
    status: 'active',
    channels: [
      { name: 'Web', active: true },
      { name: 'Amazon', active: true },
      { name: 'Shopify', active: true },
    ],
    campaign: 'valentines',
    tiers: {
      single: { price: 29.99, shipping: 9.00 },
      threePack: { originalPrice: 89.97, price: 74.97, gift: 'Shaker', savePercent: 28 },
      sixPack: { originalPrice: 179.94, price: 119.94, gift: 'Shaker', savePercent: 39 },
    },
    blendedMargin: 68,
    pagesCount: 2,
  },
];

export default function OffersLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredOffers = mockOffers.filter((offer) => {
    const matchesSearch = searchTerm === '' || 
      offer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCampaign = campaignFilter === 'all' || offer.campaign === campaignFilter;
    const matchesProduct = productFilter === 'all' || offer.productCode.toLowerCase().includes(productFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;

    return matchesSearch && matchesCampaign && matchesProduct && matchesStatus;
  });

  const activeCount = mockOffers.filter(o => o.status === 'active').length;
  const pendingCount = mockOffers.filter(o => o.status === 'pending').length;
  const expiredCount = mockOffers.filter(o => o.status === 'expired').length;
  const pagesUsingCount = mockOffers.reduce((sum, o) => sum + o.pagesCount, 0);

  const hasActiveFilters = searchTerm !== '' || campaignFilter !== 'all' || productFilter !== 'all' || statusFilter !== 'all';

  const clearAllFilters = () => {
    setSearchTerm('');
    setCampaignFilter('all');
    setProductFilter('all');
    setStatusFilter('all');
  };

  const handleOfferClick = (offer: Offer) => {
    const modalData = {
      id: offer.id,
      code: offer.id,
      campaign: offer.campaign,
      product: offer.productName,
      productIcon: offer.emoji,
      sku: offer.productCode,
      servings: `${offer.servings} Servings`,
      status: offer.status.charAt(0).toUpperCase() + offer.status.slice(1),
      channels: offer.channels,
      tiers: [
        {
          label: 'SINGLE',
          price: offer.tiers.single.price,
          shipping: offer.tiers.single.shipping > 0 ? `+$${offer.tiers.single.shipping.toFixed(2)} ship` : 'FREE ship',
          perServing: `$${(offer.tiers.single.price / offer.servings).toFixed(2)}/srv`,
        },
        {
          label: '3-PACK',
          price: offer.tiers.threePack.price,
          originalPrice: offer.tiers.threePack.originalPrice,
          shipping: 'FREE ship',
          gift: offer.tiers.threePack.gift,
          save: `Save $${(offer.tiers.threePack.originalPrice - offer.tiers.threePack.price).toFixed(2)} (${offer.tiers.threePack.savePercent}%)`,
          perServing: `$${(offer.tiers.threePack.price / (offer.servings * 3)).toFixed(2)}/srv`,
        },
        {
          label: '6-PACK',
          price: offer.tiers.sixPack.price,
          originalPrice: offer.tiers.sixPack.originalPrice,
          shipping: 'FREE ship',
          gift: offer.tiers.sixPack.gift,
          save: `Save $${(offer.tiers.sixPack.originalPrice - offer.tiers.sixPack.price).toFixed(2)} (${offer.tiers.sixPack.savePercent}%)`,
          perServing: `$${(offer.tiers.sixPack.price / (offer.servings * 6)).toFixed(2)}/srv`,
        },
      ],
      blendedMargin: `${offer.blendedMargin}%`,
      pagesCount: offer.pagesCount,
    };
    setSelectedOffer(modalData);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '48px 56px' }}>
      {/* Header */}
      <div className="content-header">
        <h1 className="header-title">
          Offers Library
        </h1>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#181818', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#1db954' }}>{activeCount}</div>
          <div style={{ fontSize: '12px', color: '#b3b3b3' }}>Active Offers</div>
        </div>
        <div style={{ background: '#181818', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffc107' }}>{pendingCount}</div>
          <div style={{ fontSize: '12px', color: '#b3b3b3' }}>Pending Approval</div>
        </div>
        <div style={{ background: '#181818', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#3b82f6' }}>{pagesUsingCount}</div>
          <div style={{ fontSize: '12px', color: '#b3b3b3' }}>Pages Using Offers</div>
        </div>
        <div style={{ background: '#181818', padding: '20px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#888' }}>{expiredCount}</div>
          <div style={{ fontSize: '12px', color: '#b3b3b3' }}>Expired Offers</div>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '280px' }}>
          <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>SEARCH</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by ID, price, % off..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 12px 10px 36px', 
                background: '#282828', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff', 
                borderRadius: '6px', 
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '14px' }}>🔍</span>
          </div>
        </div>

        {/* Campaign Filter */}
        <SearchableSelect
          label="CAMPAIGN"
          value={campaignFilter}
          onChange={setCampaignFilter}
          options={[
            { value: 'all', label: 'All Campaigns' },
            { value: 'valentines', label: '💝 Valentine\'s Day' },
            { value: 'evergreen', label: '🌲 Evergreen' },
            { value: 'christmas', label: '🎄 Christmas' }
          ]}
        />

        {/* Product Filter */}
        <SearchableSelect
          label="PRODUCT"
          value={productFilter}
          onChange={setProductFilter}
          options={[
            { value: 'all', label: 'All Products' },
            { value: 'collagen', label: 'Collagen 25s' },
            { value: 'hydrate', label: 'Hydrate' },
            { value: 'probiotics', label: 'Probiotics 30B' },
            { value: 'mct', label: 'MCT Oil Powder' }
          ]}
        />

        {/* Status Filter */}
        <SearchableSelect
          label="STATUS"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: '🟢 Active' },
            { value: 'pending', label: '🟡 Pending' },
            { value: 'expired', label: '⚫ Expired' }
          ]}
        />

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.05)',
              color: '#888',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = '#888';
            }}
          >
            ✕ Clear Filters
          </button>
        )}

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          style={{ 
            padding: '10px 20px', 
            background: '#1db954', 
            color: '#000', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: 600, 
            cursor: 'pointer', 
            marginLeft: hasActiveFilters ? '12px' : 'auto',
            transition: 'all 0.2s',
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
          + Create Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="offers-grid-new">
        {filteredOffers.map((offer) => (
          <div 
            key={offer.id} 
            className="offer-card-new"
            onClick={() => handleOfferClick(offer)}
            style={{ cursor: 'pointer' }}
          >
            {/* Image/Icon Header */}
            <div className="offer-card-image" style={offer.productCode === 'COL-25' ? { height: '150px' } : {}}>
              {offer.productCode === 'COL-25' ? (
                <img 
                  src="/images/products/collagen-lifestyle-1.jpeg" 
                  alt={offer.productName}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: 'center 65%'
                  }}
                />
              ) : (
                <span className="emoji-placeholder">{offer.emoji}</span>
              )}
              <span className={`offer-card-status ${offer.status}`}>
                {offer.status === 'active' ? 'Active' : offer.status === 'pending' ? 'Pending' : 'Expired'}
              </span>
            </div>

            {/* Card Body */}
            <div className="offer-card-body">
              {/* Header */}
              <div className="offer-card-header-row">
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    <div className="offer-card-id">{offer.id}</div>
                  </div>
                  <div className="offer-card-title">{offer.productName}</div>
                  <div className="offer-card-meta">{offer.productCode} • {offer.servings} Servings</div>
                </div>
              </div>

              {/* Channels */}
              <div className="offer-channels-wrapper">
                <div className="offer-channels-list">
                  {offer.channels.map((channel) => (
                    <span
                      key={channel.name}
                      className={`offer-channel-tag ${channel.active ? 'active' : ''}`}
                    >
                      {channel.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing Tiers */}
              <div className="offer-tiers-grid">
                {/* Single */}
                <div className="offer-tier-box">
                  <div className="offer-tier-label">Single</div>
                  <div className="offer-tier-price-row">
                    <span className="offer-tier-price">${offer.tiers.single.price}</span>
                  </div>
                  <div className="offer-tier-shipping">+${offer.tiers.single.shipping.toFixed(2)} ship</div>
                  <div className="offer-tier-totals">
                    <div className="offer-tier-total">Total: ${(offer.tiers.single.price + offer.tiers.single.shipping).toFixed(2)}</div>
                    <div className="offer-tier-per-unit">
                      ${((offer.tiers.single.price + offer.tiers.single.shipping) / offer.servings).toFixed(2)}/srv
                    </div>
                  </div>
                </div>

                {/* 3-Pack */}
                <div className="offer-tier-box">
                  <div className="offer-tier-label">3-Pack</div>
                  <div className="offer-tier-price-row">
                    <span className="offer-tier-original">${offer.tiers.threePack.originalPrice}</span>
                    <span className="offer-tier-price">${offer.tiers.threePack.price}</span>
                  </div>
                  <div className="offer-tier-shipping">FREE ship</div>
                  {offer.tiers.threePack.gift && (
                    <div className="offer-tier-gift">🎁 {offer.tiers.threePack.gift}</div>
                  )}
                  <div className="offer-tier-totals">
                    <div className="offer-tier-save">Save {offer.tiers.threePack.savePercent}%</div>
                    <div className="offer-tier-per-unit">
                      ${(offer.tiers.threePack.price / (offer.servings * 3)).toFixed(2)}/srv
                    </div>
                  </div>
                </div>

                {/* 6-Pack */}
                <div className="offer-tier-box">
                  <div className="offer-tier-label">6-Pack</div>
                  <div className="offer-tier-price-row">
                    <span className="offer-tier-original">${offer.tiers.sixPack.originalPrice}</span>
                    <span className="offer-tier-price">${offer.tiers.sixPack.price}</span>
                  </div>
                  <div className="offer-tier-shipping">FREE ship</div>
                  {offer.tiers.sixPack.gift && (
                    <div className="offer-tier-gift">🎁 {offer.tiers.sixPack.gift}</div>
                  )}
                  <div className="offer-tier-totals">
                    <div className="offer-tier-save">Save {offer.tiers.sixPack.savePercent}%</div>
                    <div className="offer-tier-per-unit">
                      ${(offer.tiers.sixPack.price / (offer.servings * 6)).toFixed(2)}/srv
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="offer-card-footer">
                <div className="offer-card-footer-left">
                  <span className="offer-blended-margin">
                    Blended Margin: <span>{offer.blendedMargin}%</span>
                  </span>
                  <span className="offer-pages-count">📄 {offer.pagesCount} Pages</span>
                </div>
                <span className="offer-view-details">View details →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
          No offers found matching your filters.
        </div>
      )}

      {/* Offer Detail Modal */}
      <OfferDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offer={selectedOffer}
      />

      {/* Create Offer Modal */}
      {/* Create Offer Modal */}
      <CreateOfferModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
