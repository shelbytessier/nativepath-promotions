'use client';

import { useState } from 'react';
import ProductDetailModal from '@/components/ProductDetailModal';

interface Product {
  id: string;
  name: string;
  code: string;
  servings: number;
  version: string;
  emoji: string;
  status: 'active' | 'low-stock' | 'discontinued';
  category: string;
  price: number;
  cogs: number;
  margin: number;
  stock: number;
  channels: string[];
  isGift?: boolean;
}

const mockProducts: Product[] = [
  {
    id: 'col-25',
    name: 'Collagen Peptides',
    code: 'COL-25',
    servings: 25,
    version: 'v2.0',
    emoji: '🥛',
    status: 'active',
    category: 'collagen',
    price: 33.99,
    cogs: 11.90,
    margin: 65,
    stock: 1247,
    channels: ['Web', 'Amazon', 'Shopify'],
  },
  {
    id: 'col-56',
    name: 'Collagen Peptides',
    code: 'COL-56',
    servings: 56,
    version: 'v2.0',
    emoji: '🥛',
    status: 'active',
    category: 'collagen',
    price: 49.99,
    cogs: 18.00,
    margin: 64,
    stock: 892,
    channels: ['Web', 'Amazon'],
  },
  {
    id: 'hyd-30',
    name: 'Hydrate',
    code: 'HYD-30',
    servings: 30,
    version: 'v1.5',
    emoji: '💧',
    status: 'active',
    category: 'supplements',
    price: 29.99,
    cogs: 9.50,
    margin: 68,
    stock: 1583,
    channels: ['Web', 'Amazon', 'Shopify'],
  },
  {
    id: 'prob-30',
    name: 'Probiotics 30B',
    code: 'PROB-30',
    servings: 30,
    version: 'v2.1',
    emoji: '🦠',
    status: 'low-stock',
    category: 'supplements',
    price: 34.99,
    cogs: 12.20,
    margin: 65,
    stock: 142,
    channels: ['Web', 'Amazon'],
  },
  {
    id: 'mct-30',
    name: 'MCT Oil Powder',
    code: 'MCT-30',
    servings: 30,
    version: 'v1.0',
    emoji: '🥥',
    status: 'active',
    category: 'supplements',
    price: 32.99,
    cogs: 10.80,
    margin: 67,
    stock: 756,
    channels: ['Web', 'Shopify'],
  },
  {
    id: 'frother',
    name: 'Mini Frother',
    code: 'GIFT-FR',
    servings: 0,
    version: 'v1.0',
    emoji: '🥄',
    status: 'active',
    category: 'gifts',
    price: 0,
    cogs: 2.50,
    margin: 0,
    stock: 3420,
    channels: ['Web'],
    isGift: true,
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showGiftsOnly, setShowGiftsOnly] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || product.category === typeFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesGift = !showGiftsOnly || product.isGift;

    return matchesSearch && matchesType && matchesStatus && matchesGift;
  });

  const hasActiveFilters = searchTerm !== '' || typeFilter !== 'all' || statusFilter !== 'all' || showGiftsOnly;

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setShowGiftsOnly(false);
  };

  const handleProductClick = (product: Product) => {
    // Convert product to modal format
    const modalProduct = {
      id: product.id,
      name: product.name,
      icon: product.emoji,
      sku: product.code,
      version: product.version,
      launched: 'Jan 2021',
      tags: [product.category, `${product.servings} Servings`],
      status: product.status,
      basePrice: product.price,
      cogs: product.cogs,
      margin: product.margin,
      stock: product.stock,
      activeOffers: 3,
      unitsSold: 47832,
      revenue: '$1.62M',
      thisMonth: 2147,
      growth: '↑ 13.5%',
      variants: [
        { sku: product.code, name: 'Single', price: product.price },
        { sku: `${product.code}-3PK`, name: '3 Pack', price: product.price * 3 },
        { sku: `${product.code}-6PK`, name: '6 Pack', price: product.price * 6 },
      ],
      offers: [
        { code: 'VDAY-' + product.code, campaign: 'VDAY-26', status: 'active' },
        { code: 'EG-' + product.code, campaign: '🌲 Evergreen', status: 'active' },
      ],
      sellingPoints: [
        '✨ #1 Best-Selling Product on NativePath',
        '🏆 Over 47,000 units sold',
        '⭐ 4.8/5 average customer rating (2,340 reviews)',
        '🔄 68% repeat purchase rate',
      ],
      features: [
        { icon: '🌿', text: 'Natural Ingredients' },
        { icon: '🇺🇸', text: 'Made in USA' },
        { icon: '🔬', text: 'Third-Party Tested' },
        { icon: '✅', text: 'Non-GMO' },
      ],
      hooks: [
        'Transform your health in just 30 days',
        'Clinically proven ingredients for maximum results',
        'Join thousands of satisfied customers',
      ],
    };
    setSelectedProduct(modalProduct);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-1px' }}>
          Products
        </h1>
        <p style={{ color: '#b3b3b3', fontSize: '14px', fontWeight: 500 }}>
          Product catalog & launch calendar
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '280px' }}>
          <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>SEARCH</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
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

        {/* Type Filter */}
        <div style={{ minWidth: '140px' }}>
          <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>TYPE</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              background: '#282828', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: '#fff', 
              borderRadius: '6px', 
              fontSize: '13px',
              outline: 'none'
            }}
          >
            <option value="all">All Types</option>
            <option value="collagen">Collagen</option>
            <option value="supplements">Supplements</option>
            <option value="gifts">Gifts</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ minWidth: '140px' }}>
          <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>STATUS</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              background: '#282828', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: '#fff', 
              borderRadius: '6px', 
              fontSize: '13px',
              outline: 'none'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">🟢 Active</option>
            <option value="low-stock">🟡 Low Stock</option>
            <option value="discontinued">⚫ Discontinued</option>
          </select>
      </div>

        {/* Special Filter */}
        <div style={{ minWidth: '150px' }}>
          <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>SPECIAL</label>
          <select
            value={showGiftsOnly ? 'gifts' : 'all'}
            onChange={(e) => setShowGiftsOnly(e.target.value === 'gifts')}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              background: '#282828', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: '#fff', 
              borderRadius: '6px', 
              fontSize: '13px',
              outline: 'none'
            }}
          >
            <option value="all">All Products</option>
            <option value="gifts">🎁 Free Gift Items</option>
          </select>
        </div>

        {/* Clear Filters Button */}
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
              alignSelf: 'flex-end',
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

        {/* Add Product Button */}
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
            fontSize: '13px',
            alignSelf: 'flex-end',
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
          + Add Product
        </button>
      </div>

      {/* Results Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', color: '#888', fontSize: '12px' }}>
        <span>Showing <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> of {mockProducts.length} products</span>
        {hasActiveFilters && (
          <span style={{ color: '#1db954', fontSize: '11px' }}>
            • Filters active
          </span>
        )}
      </div>

      {/* Products Grid */}
      <div className="products-card-grid">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="product-card-new"
            onClick={() => handleProductClick(product)}
            style={{ cursor: 'pointer' }}
          >
            <div className="product-card-image-area">
              {product.emoji}
              <span className={`product-card-badge ${product.status}`}>
                {product.status === 'active' ? 'Active' : product.status === 'low-stock' ? 'Low Stock' : 'Discontinued'}
              </span>
                  </div>
            <div className="product-card-body">
              <div className="product-card-name">{product.name}</div>
              <div className="product-card-meta">
                {product.code} • {product.servings > 0 ? `${product.servings} Servings` : 'Gift Item'} • {product.version}
                  </div>
              <div className="product-card-tags">
                {product.isGift ? (
                  <span className="product-card-tag gift">🎁 Free Gift</span>
                ) : (
                  <span className="product-card-tag">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                )}
                </div>
              <div className="product-card-stats-box">
                <div className="product-card-stats">
                  <div className="product-card-stat">
                    <div className="product-card-stat-value">${product.price.toFixed(2)}</div>
                    <div className="product-card-stat-label">Price</div>
                  </div>
                  <div className="product-card-stat">
                    <div className="product-card-stat-value">${product.cogs.toFixed(2)}</div>
                    <div className="product-card-stat-label">COGS</div>
                  </div>
                  <div className="product-card-stat">
                    <div className={`product-card-stat-value margin ${product.margin < 50 ? 'warning' : ''}`}>
                      {product.margin}%
                </div>
                    <div className="product-card-stat-label">Margin</div>
                  </div>
                  <div className="product-card-stat">
                    <div className={`product-card-stat-value ${product.stock < 200 ? 'stock low' : ''}`}>
                      {product.stock.toLocaleString()}
                  </div>
                    <div className="product-card-stat-label">Stock</div>
                  </div>
                </div>
              </div>
              <div className="product-card-channels">
                {product.channels.map((channel) => (
                  <span key={channel} className="channel-badge">
                    <span className="channel-icon">
                      {channel === 'Web' ? '🌐' : channel === 'Amazon' ? '📦' : '🛒'}
                    </span>
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
          No products found matching your filters.
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '20px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>

            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
              Add New Product
            </h2>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
              Create a new product in the catalog.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>PRODUCT NAME</label>
                <input
                  type="text"
                  placeholder="e.g., Collagen Peptides"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>PRODUCT CODE</label>
                  <input
                    type="text"
                    placeholder="e.g., COL-25"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#282828',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>SERVINGS</label>
                  <input
                    type="number"
                    placeholder="25"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#282828',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>BASE PRICE</label>
                  <input
                    type="number"
                    placeholder="33.99"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#282828',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>COGS</label>
                  <input
                    type="number"
                    placeholder="15.34"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#282828',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#282828',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="collagen">Collagen</option>
                  <option value="supplements">Supplements</option>
                  <option value="gifts">Gifts</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  alert('Product created successfully!');
                  setIsCreateModalOpen(false);
                }}
                style={{
                  flex: 1,
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
                Create Product
              </button>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
