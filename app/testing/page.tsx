'use client';

import { useState } from 'react';
import TestDetailModal from '@/components/TestDetailModal';

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState('tests');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [testTypeFilter, setTestTypeFilter] = useState('all');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="p-8">
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
                  <option value="all">All Tests</option>
                  <option value="active">🟢 Active</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              {/* Product Filter */}
              <div style={{ minWidth: '150px' }}>
                <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>PRODUCT</label>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
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
                  <option value="Collagen 25s">Collagen 25s</option>
                  <option value="Creatine">Creatine</option>
                  <option value="Probiotic 30B">Probiotic 30B</option>
                </select>
              </div>

              {/* Channel Filter */}
              <div style={{ minWidth: '140px' }}>
                <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>CHANNEL</label>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
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
                  <option value="all">All Channels</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Meta">Meta</option>
                  <option value="Google">Google</option>
                </select>
              </div>

              {/* Test Type Filter */}
              <div style={{ minWidth: '150px' }}>
                <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>TEST TYPE</label>
                <select
                  value={testTypeFilter}
                  onChange={(e) => setTestTypeFilter(e.target.value)}
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
                  <option value="Shipping Test">Shipping</option>
                  <option value="LP Angle Test">LP Angle</option>
                  <option value="Upsell">Upsell</option>
                </select>
              </div>

              <button
                onClick={() => alert('Test added successfully!')}
                style={{ 
                  padding: '10px 20px', 
                  background: '#1db954', 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                + New Test
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
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', 
              border: '1px solid rgba(147, 51, 234, 0.3)', 
              borderRadius: '12px', 
              padding: '32px', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤖</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>AI-Powered Test Analysis</h3>
              <p style={{ fontSize: '14px', color: '#b3b3b3', maxWidth: '500px', margin: '0 auto 24px' }}>
                AI-generated insights based on your test results and performance data.
              </p>
              
              {/* Sample AI Insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
                <div style={{ background: 'rgba(29, 185, 84, 0.1)', border: '1px solid rgba(29, 185, 84, 0.3)', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#1db954', fontWeight: '600', marginBottom: '8px' }}>✓ STRONG PERFORMANCE</div>
                  <div style={{ fontSize: '13px', color: '#b3b3b3' }}>
                    The 6-Pack upsell test is performing 10.9% better on conversion rate with 97% confidence. Consider rolling out to all traffic.
                  </div>
                </div>
                
                <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#eab308', fontWeight: '600', marginBottom: '8px' }}>⚠ NEEDS ATTENTION</div>
                  <div style={{ fontSize: '13px', color: '#b3b3b3' }}>
                    Headline test CID-1543 showing inconclusive results. Consider running longer or increasing traffic allocation.
                  </div>
                </div>
                
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600', marginBottom: '8px' }}>💡 RECOMMENDATION</div>
                  <div style={{ fontSize: '13px', color: '#b3b3b3' }}>
                    Based on successful tests, try testing free gift offers on Probiotics 30B. Similar offers performed well on Collagen.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Detail Modal */}
        <TestDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          test={selectedTest}
        />
      </div>
    </div>
  );
}

