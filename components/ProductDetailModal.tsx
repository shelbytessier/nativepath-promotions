'use client';

import { useState } from 'react';
import Modal from './Modal';

interface Product {
  id: string;
  name: string;
  icon: string;
  sku: string;
  version: string;
  launched: string;
  tags: string[];
  status: 'active' | 'low-stock' | 'discontinued';
  basePrice: number;
  cogs: number;
  margin: number;
  stock: number;
  activeOffers: number;
  unitsSold: number;
  revenue: string;
  thisMonth: number;
  growth: string;
  variants: Array<{ sku: string; name: string; price: number }>;
  offers: Array<{ code: string; campaign: string; status: string }>;
  sellingPoints: string[];
  features: Array<{ icon: string; text: string }>;
  hooks: string[];
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="product-modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div className="product-modal-header">
          <div className="product-modal-icon">
            {product.name.toLowerCase().includes('collagen') ? (
              <img 
                src="/images/products/collagen.png" 
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span>{product.icon}</span>
            )}
          </div>
          <div className="product-modal-title">
            <h2>{product.name}</h2>
            <p>{product.sku} • {product.version} • Launched {product.launched}</p>
            <div className="product-modal-tags">
              {product.tags.map((tag, idx) => (
                <span key={idx} className="modal-tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className={`product-modal-status ${product.status}`}>
            {product.status === 'active' ? 'Active' : product.status === 'low-stock' ? 'Low Stock' : 'Discontinued'}
          </div>
        </div>

        {/* Tabs */}
        <div className="product-modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`modal-tab ${activeTab === 'marketing' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketing')}
          >
            Marketing Info
          </button>
          <button 
            className={`modal-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {/* Overview Tab */}
        <div className={`modal-tab-content ${activeTab === 'overview' ? 'active' : ''}`}>
          {/* Key Stats */}
          <div className="product-modal-stats">
            <div className="modal-stat-box">
              <span className="modal-stat-value">${product.basePrice.toFixed(2)}</span>
              <span className="modal-stat-label">Base Price</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-value">${product.cogs.toFixed(2)}</span>
              <span className="modal-stat-label">COGS</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-value green">{product.margin}%</span>
              <span className="modal-stat-label">Margin</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-value">{product.stock.toLocaleString()}</span>
              <span className="modal-stat-label">In Stock</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-value blue">{product.activeOffers}</span>
              <span className="modal-stat-label">Offers</span>
            </div>
          </div>

          {/* Sales Performance */}
          <div className="product-modal-section">
            <h4>SALES PERFORMANCE</h4>
            <div className="sales-stats-grid">
              <div className="sales-stat">
                <span className="sales-stat-value green">{product.unitsSold.toLocaleString()}</span>
                <span className="sales-stat-label">Units Sold</span>
              </div>
              <div className="sales-stat">
                <span className="sales-stat-value">{product.revenue}</span>
                <span className="sales-stat-label">Revenue</span>
              </div>
              <div className="sales-stat">
                <span className="sales-stat-value">{product.thisMonth.toLocaleString()}</span>
                <span className="sales-stat-label">This Month</span>
              </div>
              <div className="sales-stat">
                <span className="sales-stat-value green">{product.growth}</span>
                <span className="sales-stat-label">vs Last Month</span>
              </div>
            </div>
          </div>

          {/* SKU Variants */}
          <div className="product-modal-section">
            <h4>SKU VARIANTS</h4>
            <div className="variants-list">
              {product.variants.map((variant, idx) => (
                <div key={idx} className="variant-row">
                  <span className="variant-sku">{variant.sku}</span>
                  <span className="variant-name">{variant.name}</span>
                  <span className="variant-price">${variant.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Offers */}
          <div className="product-modal-section">
            <h4>ACTIVE OFFERS</h4>
            <div className="offers-list">
              {product.offers.map((offer, idx) => (
                <div key={idx} className="offer-row">
                  <span className="offer-code">{offer.code}</span>
                  <span className="offer-campaign">{offer.campaign}</span>
                  <span className={`offer-status ${offer.status}`}>● {offer.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="product-modal-section">
            <h4>QUICK LINKS</h4>
            <div className="quick-links-row">
              <a href="#" className="quick-link-btn" onClick={(e) => e.preventDefault()}>🌐 Product Page</a>
              <a href="#" className="quick-link-btn" onClick={(e) => e.preventDefault()}>📦 Amazon</a>
              <a href="#" className="quick-link-btn" onClick={(e) => e.preventDefault()}>🛒 Shopify</a>
              <a href="#" className="quick-link-btn" onClick={(e) => e.preventDefault()}>🎨 Assets</a>
            </div>
          </div>
        </div>

        {/* Marketing Info Tab */}
        <div className={`modal-tab-content ${activeTab === 'marketing' ? 'active' : ''}`}>
          {/* Key Selling Points */}
          <div className="product-modal-section">
            <h4>KEY SELLING POINTS</h4>
            <div className="marketing-list">
              {product.sellingPoints.map((point, idx) => (
                <div key={idx} className="marketing-item">{point}</div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="product-modal-section">
            <h4>FEATURES</h4>
            <div className="features-grid">
              {product.features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-text">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Hooks */}
          <div className="product-modal-section">
            <h4>MARKETING HOOKS</h4>
            <div className="hooks-list">
              {product.hooks.map((hook, idx) => (
                <div key={idx} className="marketing-item">{hook}</div>
              ))}
            </div>
          </div>
        </div>

        {/* History Tab */}
        <div className={`modal-tab-content ${activeTab === 'history' ? 'active' : ''}`}>
          {/* Price History */}
          <div className="product-modal-section">
            <h4>PRICE HISTORY</h4>
            <div className="history-list">
              <div className="history-item">
                <span className="history-date">Jan 2026</span>
                <span className="history-event">Price: ${product.basePrice.toFixed(2)}</span>
                <span className="history-badge current">Current</span>
              </div>
              <div className="history-item">
                <span className="history-date">Jun 2025</span>
                <span className="history-event">Price increased to $31.99</span>
                <span className="history-change up">+$2.00</span>
              </div>
              <div className="history-item">
                <span className="history-date">Jan 2024</span>
                <span className="history-event">Price: $29.99</span>
                <span className="history-change">Launch</span>
              </div>
            </div>
          </div>

          {/* Version History */}
          <div className="product-modal-section">
            <h4>VERSION HISTORY</h4>
            <div className="history-list">
              <div className="history-item">
                <span className="history-date">Mar 2024</span>
                <span className="history-event">v2.0 - Updated formula, better solubility</span>
                <span className="history-badge">Reformulation</span>
              </div>
              <div className="history-item">
                <span className="history-date">Jan 2021</span>
                <span className="history-event">v1.0 - Initial launch</span>
                <span className="history-badge">Launch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

