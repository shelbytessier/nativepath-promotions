'use client';

import { useState } from 'react';
import TestDetailModal from '@/components/TestDetailModal';
import TestRequestModal from '@/components/TestRequestModal';
import SearchableSelect from '@/components/SearchableSelect';

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState('tests');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [testTypeFilter, setTestTypeFilter] = useState('all');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestRequestModalOpen, setIsTestRequestModalOpen] = useState(false);
  const [aiInsightsChannel, setAiInsightsChannel] = useState('all');
  const [aiInsightsProduct, setAiInsightsProduct] = useState('all');

  const tests = [
    {
      id: 'CID-1317',
      name: 'Free Shipping Threshold Test',
      hypothesis: 'Testing if lowering free shipping threshold from $75 to $50 increases conversion without hurting AOV',
      product: 'Collagen 25s',
      productEmoji: '📦',
      channel: 'TikTok',
      channelEmoji: '📱',
      trafficType: 'Cold Traffic',
      testType: 'Shipping Test',
      status: 'active',
      startDate: 'Thu Dec 19, 2025',
      daysRunning: 18,
      testVariant: {
        name: 'Free Shipping over $50',
        lpid: 'LPID 8077',
        clicks: 2004,
        sales: 159,
        convRate: 7.93,
        epc: 8.37,
        aov: 105.49,
        isWinning: true
      },
      controlVariant: {
        name: 'Free Shipping over $75',
        lpid: 'LPID 8078',
        clicks: 2000,
        sales: 154,
        convRate: 7.70,
        epc: 7.93,
        aov: 103.00
      },
      deltas: {
        convRate: { value: 0.23, percent: 3 },
        epc: { value: 0.44, percent: 6 },
        aov: { value: 2.49, percent: 2 }
      },
      confidence: 38
    },
    {
      id: 'CID-1829',
      name: 'LP Angle Test - Energy vs Joint Pain',
      hypothesis: 'Testing which pain point messaging converts better for Creatine on Meta cold traffic',
      product: 'Creatine',
      productEmoji: '📦',
      channel: 'Meta',
      channelEmoji: '📘',
      trafficType: 'Cold Traffic',
      testType: 'LP Angle Test',
      status: 'active',
      startDate: 'Mon Jan 2, 2026',
      daysRunning: 4,
      testVariant: {
        name: 'Energy Landing Page',
        lpid: 'LPID 8092',
        clicks: 387,
        sales: 29,
        convRate: 7.49,
        epc: 6.78,
        aov: 90.52,
        isWinning: false
      },
      controlVariant: {
        name: 'Joint Pain Landing Page',
        lpid: 'LPID 8093',
        clicks: 401,
        sales: 34,
        convRate: 8.48,
        epc: 7.43,
        aov: 87.65
      },
      deltas: {
        convRate: { value: -0.99, percent: -12 },
        epc: { value: -0.65, percent: -9 },
        aov: { value: 2.87, percent: 3 }
      },
      confidence: 12
    },
    {
      id: 'CID-1544',
      name: 'Upsell Bundle Test',
      hypothesis: 'Testing 4-pack upsell vs 6-pack upsell for Probiotic customers',
      product: 'Probiotic 30B',
      productEmoji: '📦',
      channel: 'Google',
      channelEmoji: '🔍',
      trafficType: 'Warm Traffic',
      testType: 'Upsell',
      status: 'completed',
      startDate: 'Mon Nov 18, 2025',
      daysRunning: 49,
      testVariant: {
        name: '6-Pack Upsell',
        lpid: 'LPID 8023',
        clicks: 1842,
        sales: 201,
        convRate: 10.91,
        epc: 13.24,
        aov: 121.35,
        isWinning: true
      },
      controlVariant: {
        name: '4-Pack Upsell',
        lpid: 'LPID 8024',
        clicks: 1889,
        sales: 189,
        convRate: 10.01,
        epc: 12.01,
        aov: 120.01
      },
      deltas: {
        convRate: { value: 0.90, percent: 9 },
        epc: { value: 1.23, percent: 10 },
        aov: { value: 1.34, percent: 1 }
      },
      confidence: 97
    }
  ];

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.hypothesis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    const matchesProduct = productFilter === 'all' || test.product === productFilter;
    const matchesChannel = channelFilter === 'all' || test.channel === channelFilter;
    const matchesTestType = testTypeFilter === 'all' || test.testType === testTypeFilter;
    
    return matchesSearch && matchesStatus && matchesProduct && matchesChannel && matchesTestType;
  });

  const activeCount = tests.filter(t => t.status === 'active').length;
  const completedCount = tests.filter(t => t.status === 'completed').length;

  const handleTestClick = (test: any) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '48px 56px' }}>
      <div className="content-header">
        <h1 className="header-title">Testing</h1>
      </div>

      <div className="content-body">
        {/* Tabs */}
        <div className="products-tabs" style={{ marginBottom: '24px' }}>
          <button 
            className={`products-tab ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            🧪 Tests
          </button>
          <button 
            className={`products-tab ${activeTab === 'ai-insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-insights')}
          >
            🤖 AI Insights
          </button>
        </div>

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div className="products-tab-content active">
            {/* Filters Row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {/* Search Bar */}
              <div style={{ flex: 1, minWidth: '200px', maxWidth: '320px' }}>
                <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>SEARCH</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search by CID, test name, or hypothesis..." 
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

              {/* Status Filter */}
              <SearchableSelect
                label="STATUS"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'All Tests' },
                  { value: 'active', label: '🟢 Active' },
                  { value: 'completed', label: '✅ Completed' }
                ]}
              />

              {/* Product Filter */}
              <SearchableSelect
                label="PRODUCT"
                value={productFilter}
                onChange={setProductFilter}
                options={[
                  { value: 'all', label: 'All Products' },
                  { value: 'Collagen 25s', label: 'Collagen 25s' },
                  { value: 'Creatine', label: 'Creatine' },
                  { value: 'Probiotic 30B', label: 'Probiotic 30B' }
                ]}
              />

              {/* Channel Filter */}
              <SearchableSelect
                label="CHANNEL"
                value={channelFilter}
                onChange={setChannelFilter}
                options={[
                  { value: 'all', label: 'All Channels' },
                  { value: 'TikTok', label: 'TikTok' },
                  { value: 'Meta', label: 'Meta' },
                  { value: 'Google', label: 'Google' }
                ]}
              />

              {/* Test Type Filter */}
              <SearchableSelect
                label="TEST TYPE"
                value={testTypeFilter}
                onChange={setTestTypeFilter}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'Shipping Test', label: 'Shipping' },
                  { value: 'LP Angle Test', label: 'LP Angle' },
                  { value: 'Upsell', label: 'Upsell' }
                ]}
              />

              <button
                onClick={() => setIsTestRequestModalOpen(true)}
                style={{ 
                  padding: '10px 20px', 
                  background: '#1db954', 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#1ed760'}
                onMouseOut={(e) => e.currentTarget.style.background = '#1db954'}
              >
                🧪 Request New Test
              </button>
            </div>

            {/* Results Summary */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', color: '#888', fontSize: '12px' }}>
              <span>Showing <strong style={{ color: '#fff' }}>{filteredTests.length} tests</strong></span>
              <span>•</span>
              <span><span style={{ color: '#1db954' }}>{activeCount} active</span></span>
              <span>•</span>
              <span><span style={{ color: '#888' }}>{completedCount} completed</span></span>
            </div>

            {/* Tests List - Rich Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredTests.map((test) => (
                <div key={test.id} style={{ background: '#181818', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  {/* Header Section */}
                  <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span style={{ 
                            background: test.status === 'active' ? 'rgba(29,185,84,0.15)' : 'rgba(59,130,246,0.15)', 
                            color: test.status === 'active' ? '#1db954' : '#3b82f6', 
                            padding: '3px 10px', 
                            borderRadius: '4px', 
                            fontSize: '11px', 
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {test.status}
                          </span>
                          <span style={{ fontFamily: 'monospace', color: '#888', fontSize: '12px' }}>{test.id}</span>
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px' }}>{test.name}</h3>
                        <p style={{ fontSize: '13px', color: '#888' }}>{test.hypothesis}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#888' }}>Started</div>
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>{test.startDate}</div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: test.status === 'active' ? (test.daysRunning < 7 ? '#eab308' : '#1db954') : '#888', 
                          marginTop: '4px' 
                        }}>
                          {test.daysRunning} days running
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
                        <span>{test.productEmoji}</span> {test.product}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
                        <span>{test.channelEmoji}</span> {test.channel}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
                        <span>🎯</span> {test.trafficType}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
                        <span>🏷️</span> {test.testType}
                      </div>
                    </div>
                  </div>

                  {/* Winner Summary Banner - Prominent */}
                  {test.testVariant.isWinning && test.status === 'completed' && (
                    <div style={{ 
                      background: 'linear-gradient(135deg, rgba(29,185,84,0.25) 0%, rgba(21,128,61,0.15) 100%)',
                      border: '1px solid rgba(29,185,84,0.4)',
                      borderRadius: '8px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ fontSize: '32px' }}>🏆</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: '#1db954', marginBottom: '4px', letterSpacing: '0.5px' }}>
                          {test.testVariant.name} WON
                        </div>
                        <div style={{ fontSize: '13px', color: '#e0e0e0', lineHeight: '1.4' }}>
                          Outperformed {test.controlVariant.name} by <strong style={{ color: '#1db954', fontSize: '14px' }}>+{test.deltas.convRate.value.toFixed(2)}%</strong> conversion rate with <strong style={{ color: '#fff' }}>{test.confidence}%</strong> confidence
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Variants Section */}
                  <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      {/* Test Variant */}
                      <div style={{ 
                        background: test.testVariant.isWinning ? 'rgba(29,185,84,0.1)' : 'rgba(255,255,255,0.03)', 
                        border: test.testVariant.isWinning ? '1px solid rgba(29,185,84,0.3)' : '1px solid rgba(255,255,255,0.08)', 
                        borderRadius: '8px', 
                        padding: '16px' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>TEST: {test.testVariant.name}</span>
                          {test.testVariant.isWinning && (
                            <span style={{ 
                              background: 'rgba(29,185,84,0.2)', 
                              color: '#1db954', 
                              padding: '2px 8px', 
                              borderRadius: '4px', 
                              fontSize: '10px', 
                              fontWeight: '600' 
                            }}>
                              WINNING
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>{test.testVariant.lpid}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', textAlign: 'center' }}>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>Clicks</div>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>{test.testVariant.clicks.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>Sales</div>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>{test.testVariant.sales}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>Conv %</div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: test.testVariant.isWinning ? '#1db954' : '#fff' }}>
                              {test.testVariant.convRate.toFixed(2)}%
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>EPC</div>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>${test.testVariant.epc.toFixed(2)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>AOV</div>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>${test.testVariant.aov.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Control Variant */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>CONTROL: {test.controlVariant.name}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>{test.controlVariant.lpid}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', textAlign: 'center' }}>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>Clicks</div>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>{test.controlVariant.clicks.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>Sales</div>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>{test.controlVariant.sales}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>Conv %</div>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>{test.controlVariant.convRate.toFixed(2)}%</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>EPC</div>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>${test.controlVariant.epc.toFixed(2)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', color: '#888' }}>AOV</div>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>${test.controlVariant.aov.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deltas & Confidence */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ 
                          background: test.deltas.convRate.value >= 0 ? 'rgba(29,185,84,0.1)' : 'rgba(239,68,68,0.1)', 
                          padding: '8px 14px', 
                          borderRadius: '6px' 
                        }}>
                          <span style={{ fontSize: '11px', color: '#888' }}>Conv Δ</span>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '700', 
                            color: test.deltas.convRate.value >= 0 ? '#1db954' : '#ef4444', 
                            marginLeft: '8px' 
                          }}>
                            {test.deltas.convRate.value >= 0 ? '+' : ''}{test.deltas.convRate.value.toFixed(2)}%
                          </span>
                          <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>
                            ({test.deltas.convRate.percent >= 0 ? '+' : ''}{test.deltas.convRate.percent}%)
                          </span>
                        </div>
                        <div style={{ 
                          background: test.deltas.epc.value >= 0 ? 'rgba(29,185,84,0.1)' : 'rgba(239,68,68,0.1)', 
                          padding: '8px 14px', 
                          borderRadius: '6px' 
                        }}>
                          <span style={{ fontSize: '11px', color: '#888' }}>EPC Δ</span>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '700', 
                            color: test.deltas.epc.value >= 0 ? '#1db954' : '#ef4444', 
                            marginLeft: '8px' 
                          }}>
                            {test.deltas.epc.value >= 0 ? '+' : ''}${Math.abs(test.deltas.epc.value).toFixed(2)}
                          </span>
                          <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>
                            ({test.deltas.epc.percent >= 0 ? '+' : ''}{test.deltas.epc.percent}%)
                          </span>
                        </div>
                        <div style={{ 
                          background: test.deltas.aov.value >= 0 ? 'rgba(29,185,84,0.1)' : 'rgba(239,68,68,0.1)', 
                          padding: '8px 14px', 
                          borderRadius: '6px' 
                        }}>
                          <span style={{ fontSize: '11px', color: '#888' }}>AOV Δ</span>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '700', 
                            color: test.deltas.aov.value >= 0 ? '#1db954' : '#ef4444', 
                            marginLeft: '8px' 
                          }}>
                            {test.deltas.aov.value >= 0 ? '+' : ''}${Math.abs(test.deltas.aov.value).toFixed(2)}
                          </span>
                          <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>
                            ({test.deltas.aov.percent >= 0 ? '+' : ''}{test.deltas.aov.percent}%)
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '10px', color: '#888' }}>Statistical Confidence</div>
                          <div style={{ 
                            fontSize: '20px', 
                            fontWeight: '700', 
                            color: test.confidence >= 95 ? '#1db954' : test.confidence >= 70 ? '#eab308' : '#ef4444' 
                          }}>
                            {test.confidence}%
                          </div>
                        </div>
                        <div style={{ width: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px' }}>
                          <div style={{ 
                            width: `${test.confidence}%`, 
                            background: test.confidence >= 95 ? '#1db954' : 'linear-gradient(90deg, #eab308, #1db954)', 
                            height: '100%', 
                            borderRadius: '4px' 
                          }}></div>
                        </div>
                        <div style={{ fontSize: '10px', color: '#888' }}>Need 95%</div>
                      </div>
                    </div>

                    {/* More Info Button */}
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <button
                        onClick={() => handleTestClick(test)}
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '6px', 
                          color: '#fff', 
                          fontSize: '13px', 
                          fontWeight: '500', 
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      >
                        📊 View Detailed Test Data
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <div style={{ fontSize: '14px' }}>No tests found matching your filters</div>
              </div>
            )}
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && (
          <div className="products-tab-content active">
            {/* Filters for AI Insights */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <SearchableSelect
                label="CHANNEL"
                value={aiInsightsChannel}
                onChange={setAiInsightsChannel}
                options={[
                  { value: 'all', label: 'All Channels' },
                  { value: 'google', label: '🔍 Google' },
                  { value: 'meta', label: '📘 Meta' },
                  { value: 'youtube', label: '📺 YouTube' },
                  { value: 'tiktok', label: '🎵 TikTok' }
                ]}
              />
              <SearchableSelect
                label="PRODUCT"
                value={aiInsightsProduct}
                onChange={setAiInsightsProduct}
                options={[
                  { value: 'all', label: 'All Products' },
                  { value: 'collagen', label: '🦴 Collagen' },
                  { value: 'probiotics', label: '💊 Probiotics 30B' },
                  { value: 'hydrate', label: '💧 Hydrate' },
                  { value: 'mct', label: '🥥 MCT Oil' }
                ]}
              />
            </div>

            {/* AI Insights Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* ALWAYS SHOW: High-Impact Winners */}
              <div style={{ background: 'rgba(29, 185, 84, 0.08)', border: '1px solid rgba(29, 185, 84, 0.3)', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '24px' }}>🏆</div>
                  <div style={{ fontSize: '14px', color: '#1db954', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>High-Impact Winners</div>
                </div>
                <div style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
                  6-Pack Upsell outperformed 4-Pack by +10.9% conversion rate
                </div>
                <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', marginBottom: '12px' }}>
                  Test <span style={{ fontFamily: 'monospace', color: '#1db954' }}>CID-1544</span> on Probiotics 30B (Google) showed strong statistical significance (97%). The 6-pack upsell generated +$1.23 EPC and +$1.34 AOV compared to the 4-pack control.
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  <strong>Recommendation:</strong> Roll out 6-pack upsell to 100% of Probiotics traffic on Google immediately. Potential revenue impact: +$12,400/month.
                </div>
              </div>

              {/* ALWAYS SHOW: Tests Needing Review */}
              <div style={{ background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '24px' }}>⚠️</div>
                  <div style={{ fontSize: '14px', color: '#eab308', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tests Needing Review</div>
                </div>
                <div style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
                  3 tests have been running for 30+ days with inconclusive results
                </div>
                <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', marginBottom: '12px' }}>
                  Tests <span style={{ fontFamily: 'monospace', color: '#eab308' }}>CID-1543</span>, <span style={{ fontFamily: 'monospace', color: '#eab308' }}>CID-1542</span>, and <span style={{ fontFamily: 'monospace', color: '#eab308' }}>CID-1539</span> are showing minimal delta (&lt;2%) and low confidence (&lt;70%). Traffic may be too low or variants too similar.
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  <strong>Recommendation:</strong> Either increase traffic allocation to 50/50 split or end tests and reallocate budget to higher-performing experiments.
                </div>
              </div>

              {/* ALWAYS SHOW: Cross-Product Opportunities */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '24px' }}>💡</div>
                  <div style={{ fontSize: '14px', color: '#b3b3b3', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cross-Product Opportunity</div>
                </div>
                <div style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
                  "Before/After" imagery increased conversions +15% for Collagen
                </div>
                <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', marginBottom: '12px' }}>
                  Visual proof via customer transformation photos significantly outperformed lifestyle product shots for Collagen 25s on YouTube and TikTok. This same pattern could apply to other visible-results products.
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  <strong>Test Idea:</strong> Try before/after imagery for Hydrate (skin hydration) and MCT Oil (energy/weight) on visual channels.
                </div>
              </div>

              {/* FILTERED: Product-Specific Insights */}
              {(aiInsightsProduct === 'all' || aiInsightsProduct === 'collagen') && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '24px' }}>🦴</div>
                    <div style={{ fontSize: '14px', color: '#b3b3b3', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Collagen 25s Insights</div>
                  </div>
                  <div style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
                    Free gift offers consistently outperform discount-only offers
                  </div>
                  <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', marginBottom: '12px' }}>
                    Across 3 completed tests, offers including a frother or shaker performed +8.2% better on conversion vs. percentage discounts alone. This pattern holds true on Meta, Google, and YouTube.
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <strong>Action Item:</strong> Apply this learning to Probiotics 30B and Hydrate. Test free measuring spoon or travel pack as gifts.
                  </div>
                </div>
              )}

              {(aiInsightsProduct === 'all' || aiInsightsProduct === 'probiotics') && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '24px' }}>💊</div>
                    <div style={{ fontSize: '14px', color: '#b3b3b3', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Probiotics 30B Insights</div>
                  </div>
                  <div style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
                    Subscription offers convert better than one-time purchases (+18%)
                  </div>
                  <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', marginBottom: '12px' }}>
                    Tests on Google and Meta show that leading with subscription pricing (with clear "skip or cancel anytime") significantly outperforms one-time purchase CTAs. Customers perceive better value per serving.
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <strong>Action Item:</strong> Make subscription the default selection on all Probiotics landing pages with one-time as secondary option.
                  </div>
                </div>
              )}

              {(aiInsightsProduct === 'all' || aiInsightsProduct === 'hydrate') && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '24px' }}>💧</div>
                    <div style={{ fontSize: '14px', color: '#b3b3b3', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hydrate Insights</div>
                  </div>
                  <div style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
                    Flavor variety messaging increases AOV by +$12
                  </div>
                  <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', marginBottom: '12px' }}>
                    Landing pages emphasizing "try all 3 flavors" and showing flavor variety imagery lead to higher 3-pack purchases. Single-flavor hero images underperform by 14% on TikTok.
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <strong>Action Item:</strong> Update all Hydrate creative to feature multiple flavor bottles in hero section.
                  </div>
                </div>
              )}

              {/* FILTERED: Channel-Specific Insights */}
              {(aiInsightsChannel === 'all' || aiInsightsChannel === 'meta') && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '24px' }}>📘</div>
                    <div style={{ fontSize: '14px', color: '#b3b3b3', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Meta Channel Patterns</div>
                  </div>
                  <div style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
                    Shorter headlines (+25% CTR) but longer landing pages (+12% CR)
                  </div>
                  <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', marginBottom: '12px' }}>
                    Meta traffic responds best to concise, curiosity-driven headlines in ads, but once on-page, they convert better with detailed testimonial sections and ingredient breakdowns (3000+ words).
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <strong>Next Test:</strong> Try this pattern on TikTok traffic, which currently has average page length.
                  </div>
                </div>
              )}

              {(aiInsightsChannel === 'all' || aiInsightsChannel === 'google') && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '24px' }}>🔍</div>
                    <div style={{ fontSize: '14px', color: '#b3b3b3', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Google Channel Patterns</div>
                  </div>
                  <div style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
                    Educational content + FAQ sections increase conversion by +19%
                  </div>
                  <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', marginBottom: '12px' }}>
                    Google search traffic is solution-seeking and converts significantly better with expanded FAQ sections, dosage explanations, and "how it works" content. Benefit-only pages underperform.
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <strong>Action Item:</strong> Expand FAQ sections on all Google landing pages. Add "Science Behind X" sections.
                  </div>
                </div>
              )}

              {(aiInsightsChannel === 'all' || aiInsightsChannel === 'tiktok') && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '24px' }}>🎵</div>
                    <div style={{ fontSize: '14px', color: '#b3b3b3', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TikTok Channel Patterns</div>
                  </div>
                  <div style={{ fontSize: '15px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
                    UGC-style landing pages outperform polished brand pages (+22% CR)
                  </div>
                  <div style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', marginBottom: '12px' }}>
                    TikTok traffic converts best when landing pages mirror the raw, authentic style of the platform. Stock photography and overly-polished design reduces trust and conversion rates.
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <strong>Action Item:</strong> Create TikTok-specific landing page variants with customer photos, casual copy, and mobile-first layouts.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Detail Modal */}
        <TestDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          test={selectedTest}
        />

        {/* Test Request Modal */}
        <TestRequestModal 
          isOpen={isTestRequestModalOpen}
          onClose={() => setIsTestRequestModalOpen(false)}
        />
      </div>
    </div>
  );
}

