'use client';

import { useState } from 'react';
import Modal from './Modal';

interface Offer {
  id: string;
  code: string;
  campaign: string;
  product: string;
  productIcon: string;
  sku: string;
  servings: string;
  status: string;
  channels: Array<{ name: string; active: boolean }>;
  tiers: Array<{
    label: string;
    price: number;
    originalPrice?: number;
    shipping: string;
    gift?: string;
    save?: string;
    perServing: string;
  }>;
  blendedMargin: string;
  pagesCount: number;
}

interface OfferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
}

export default function OfferDetailModal({ isOpen, onClose, offer }: OfferDetailModalProps) {
  const [metricsCollapsed, setMetricsCollapsed] = useState(true);
  const [pageFilter, setPageFilter] = useState('all');

  if (!offer) return null;

  // Mock data for internal metrics
  const internalMetrics = [
    { tier: 'Single', pricePerUnit: 33.99, cogs: 15.34, margin: 64.32, takeRate: 30, orders: 30, revenue: 1019.70, totalCogs: 460.20 },
    { tier: '3-Pack', pricePerUnit: 87.00, cogs: 23.76, margin: 72.69, takeRate: 30, orders: 30, revenue: 2610.00, totalCogs: 712.80 },
    { tier: '6-Pack', pricePerUnit: 132.00, cogs: 36.39, margin: 72.43, takeRate: 40, orders: 40, revenue: 5280.00, totalCogs: 1455.60 },
  ];

  // Mock data for pricing details
  const pricingDetails = [
    { tier: 'Single', servings: 25, original: null, price: 33.99, shipping: '+$9.00', total: 42.99, savings: null, perServing: 1.36 },
    { tier: '3-Pack', servings: 75, original: 110.97, price: 87.00, shipping: 'FREE', total: 87.00, savings: '$38.92 (35%)', perServing: 1.16 },
    { tier: '6-Pack', servings: 150, original: 212.94, price: 132.00, shipping: 'FREE', total: 132.00, savings: '$95.89 (45%)', perServing: 0.88 },
  ];

  // Mock data for pages using this offer
  const pages = [
    { name: 'VDay - Meta - Joint Pain', channel: 'Meta', channelType: 'web', status: 'Live' },
    { name: 'VDay - Meta - Energy', channel: 'Meta', channelType: 'web', status: 'Live' },
    { name: 'Amazon Collagen Listing', channel: 'Amazon', channelType: 'amazon', status: 'Live' },
    { name: 'Walmart Marketplace Listing', channel: 'Walmart', channelType: 'walmart', status: 'In Dev' },
  ];

  const filteredPages = pageFilter === 'all' ? pages : pages.filter(p => p.channelType === pageFilter);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="offer-modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div className="offer-modal-header" style={{ padding: '16px 24px', borderBottom: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="offer-modal-id">{offer.code}</div>
            <div className="offer-modal-campaign">{offer.campaign}</div>
          </div>
        </div>

        {/* Offer Card Preview */}
        <div className="offer-modal-card-preview">
          <div className="offer-modal-card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {offer.sku === 'COL-25' || offer.product.toLowerCase().includes('collagen') ? (
              <img 
                src="/images/products/collagen.png" 
                alt={offer.product}
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  objectFit: 'contain'
                }}
              />
            ) : (
              offer.productIcon
            )}
          </div>
          <div className="offer-modal-card-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="offer-modal-card-id">{offer.code}</span>
              <span className="offer-modal-card-status">{offer.status}</span>
            </div>
            <div className="offer-modal-card-title">{offer.product}</div>
            <div className="offer-modal-card-meta">{offer.sku} • {offer.servings}</div>
            <div className="offer-modal-card-channels">
              {offer.channels.map((channel, idx) => (
                <span key={idx} className={`offer-modal-channel ${channel.active ? 'active' : ''}`}>
                  {channel.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tier Pricing Preview */}
        <div className="offer-modal-tiers-preview">
          {offer.tiers.map((tier, idx) => (
            <div key={idx} className="offer-modal-tier">
              <div className="offer-modal-tier-label">{tier.label}</div>
              {tier.originalPrice ? (
                <div className="offer-modal-tier-price-row">
                  <span className="offer-modal-tier-original">${tier.originalPrice.toFixed(2)}</span>
                  <span className="offer-modal-tier-price">${tier.price.toFixed(2)}</span>
                </div>
              ) : (
                <div className="offer-modal-tier-price">${tier.price.toFixed(2)}</div>
              )}
              <div className={`offer-modal-tier-shipping ${tier.shipping === 'FREE ship' ? 'free' : 'paid'}`}>
                {tier.shipping}
              </div>
              {tier.gift && <div className="offer-modal-tier-gift">{tier.gift}</div>}
              <div className="offer-modal-tier-totals">
                {tier.save ? (
                  <div className="offer-modal-tier-save">{tier.save}</div>
                ) : (
                  <div className="offer-modal-tier-total">
                    Total: ${tier.price.toFixed(2)}{tier.shipping !== 'FREE ship' ? ' + shipping' : ''}
                  </div>
                )}
                <div className="offer-modal-tier-per">{tier.perServing}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Blended Stats */}
        <div className="offer-modal-blended-row">
          <span className="offer-modal-blended">Blended Margin: <strong>{offer.blendedMargin}</strong></span>
          <span className="offer-modal-pages">📄 {offer.pagesCount} Pages</span>
        </div>

        <div className="offer-modal-body">
          {/* Internal Metrics - Collapsible */}
          <div className={`offer-modal-section collapsible`}>
            <div 
              className="offer-modal-section-header" 
              onClick={() => setMetricsCollapsed(!metricsCollapsed)}
              style={{ cursor: 'pointer' }}
            >
              <div className="offer-modal-section-title">
                INTERNAL METRICS
                <span className="offer-edit-indicator">EDITABLE</span>
              </div>
              <span className="offer-collapse-icon" style={{ 
                transform: metricsCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                transition: 'transform 0.2s'
              }}>▶</span>
            </div>
            <div className={`offer-modal-section-content ${metricsCollapsed ? 'collapsed' : ''}`}>
              <table className="offer-metrics-table">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Price per Unit</th>
                    <th>COGS</th>
                    <th>Margin</th>
                    <th>Take Rate</th>
                    <th># Orders</th>
                    <th>Revenue</th>
                    <th>Total COGS</th>
                  </tr>
                </thead>
                <tbody>
                  {internalMetrics.map((row, idx) => (
                    <tr key={idx}>
                      <td className="offer-tier-name">{row.tier}</td>
                      <td>${row.pricePerUnit.toFixed(2)}</td>
                      <td>${row.cogs.toFixed(2)}</td>
                      <td className="offer-margin">{row.margin.toFixed(2)}%</td>
                      <td>{row.takeRate}%</td>
                      <td>{row.orders}</td>
                      <td>${row.revenue.toFixed(2)}</td>
                      <td>${row.totalCogs.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="offer-blended-row">
                    <td className="offer-tier-name">Blended</td>
                    <td>—</td>
                    <td>—</td>
                    <td className="offer-margin">71.37%</td>
                    <td>—</td>
                    <td>100</td>
                    <td>$8,909.70</td>
                    <td>$2,628.60</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="offer-modal-section">
            <div className="offer-modal-section-title">PRICING DETAILS</div>
            <table className="offer-metrics-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Servings</th>
                  <th>Original</th>
                  <th>Price</th>
                  <th>Shipping</th>
                  <th>Total</th>
                  <th>Savings</th>
                  <th>$/Serving</th>
                </tr>
              </thead>
              <tbody>
                {pricingDetails.map((row, idx) => (
                  <tr key={idx}>
                    <td className="offer-tier-name">{row.tier}</td>
                    <td>{row.servings}</td>
                    <td className={row.original ? 'offer-original-price' : ''}>
                      {row.original ? `$${row.original.toFixed(2)}` : '—'}
                    </td>
                    <td>${row.price.toFixed(2)}</td>
                    <td className={row.shipping === 'FREE' ? 'offer-shipping-free' : 'offer-shipping-paid'}>
                      {row.shipping}
                    </td>
                    <td>${row.total.toFixed(2)}</td>
                    <td className={row.savings ? 'offer-savings' : ''}>
                      {row.savings || '—'}
                    </td>
                    <td>${row.perServing.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pages Using This Offer */}
          <div className="offer-modal-section">
            <div className="offer-modal-section-title">PAGES USING THIS OFFER ({filteredPages.length})</div>
            <div className="offer-pages-filter">
              <span 
                className={`offer-page-filter-chip ${pageFilter === 'all' ? 'active' : ''}`}
                onClick={() => setPageFilter('all')}
              >
                All
              </span>
              <span 
                className={`offer-page-filter-chip ${pageFilter === 'web' ? 'active' : ''}`}
                onClick={() => setPageFilter('web')}
              >
                Web
              </span>
              <span 
                className={`offer-page-filter-chip ${pageFilter === 'amazon' ? 'active' : ''}`}
                onClick={() => setPageFilter('amazon')}
              >
                Amazon
              </span>
              <span 
                className={`offer-page-filter-chip ${pageFilter === 'walmart' ? 'active' : ''}`}
                onClick={() => setPageFilter('walmart')}
              >
                Walmart
              </span>
            </div>
            <div className="offer-pages-list">
              {filteredPages.map((page, idx) => (
                <div key={idx} className="offer-page-item" data-channel={page.channelType}>
                  <div>
                    <div className="offer-page-name">{page.name}</div>
                    <div className="offer-page-channel">{page.channel}</div>
                  </div>
                  <div className="offer-page-right">
                    <span className={`offer-page-status ${page.status === 'Live' ? 'live' : 'dev'}`}>
                      {page.status}
                    </span>
                    <span className="offer-page-view">View →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="offer-modal-footer">
          <button className="offer-modal-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="offer-modal-btn-primary" onClick={() => alert('Save Changes clicked')}>
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}

