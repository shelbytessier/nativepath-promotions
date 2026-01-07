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
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your Testing AI Assistant. I can help you analyze test data, find specific tests, suggest new experiments, and identify patterns across your testing history. Try asking me:\n\n• "Have we tested free shipping on TikTok?"\n• "What tests are currently running for Collagen?"\n• "Show me all tests with confidence above 90%"\n• "What\'s our best performing upsell test?"\n• "Suggest a test for improving Meta conversion rates"',
      timestamp: new Date()
    }
  ]);

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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setChatInput('');

    // Generate AI response based on query
    setTimeout(() => {
      const response = generateAIResponse(userMessage, tests);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
    }, 500);
  };

  const generateAIResponse = (query: string, testsData: any[]): string => {
    const lowerQuery = query.toLowerCase();
    
    // Check for specific test queries
    if (lowerQuery.includes('free shipping') || lowerQuery.includes('shipping threshold')) {
      const shippingTests = testsData.filter(t => t.testType === 'Shipping Test');
      if (shippingTests.length > 0) {
        const test = shippingTests[0];
        return `Yes! We've tested free shipping thresholds:\n\n**${test.name}** (${test.id})\n• Product: ${test.product}\n• Channel: ${test.channel}\n• Status: ${test.status}\n• Result: ${test.testVariant.name} ${test.testVariant.isWinning ? 'WON' : 'is being tested'} with ${test.testVariant.convRate.toFixed(2)}% conversion rate (+${test.deltas.convRate.value.toFixed(2)}% vs control)\n• Confidence: ${test.confidence}%\n\n${test.confidence >= 95 ? '✅ Ready to scale!' : '⏳ Still gathering data...'}`;
      }
    }

    // Check for channel-specific queries
    const channels = ['tiktok', 'meta', 'google', 'youtube'];
    const mentionedChannel = channels.find(ch => lowerQuery.includes(ch));
    if (mentionedChannel && (lowerQuery.includes('test') || lowerQuery.includes('running') || lowerQuery.includes('active'))) {
      const channelTests = testsData.filter(t => t.channel.toLowerCase() === mentionedChannel);
      if (channelTests.length > 0) {
        const activeTests = channelTests.filter(t => t.status === 'active');
        const completedTests = channelTests.filter(t => t.status === 'completed');
        
        let response = `Here's what we've tested on **${mentionedChannel.charAt(0).toUpperCase() + mentionedChannel.slice(1)}**:\n\n`;
        
        if (activeTests.length > 0) {
          response += `**🟢 Active Tests (${activeTests.length}):**\n`;
          activeTests.forEach(t => {
            response += `• ${t.name} - ${t.product} (${t.daysRunning} days running, ${t.confidence}% confidence)\n`;
          });
          response += '\n';
        }
        
        if (completedTests.length > 0) {
          response += `**✅ Completed Tests (${completedTests.length}):**\n`;
          completedTests.forEach(t => {
            response += `• ${t.name} - ${t.product} ${t.testVariant.isWinning ? '(Winner: ' + t.testVariant.name + ')' : ''}\n`;
          });
        }
        
        return response;
      } else {
        return `I don't see any tests specifically for ${mentionedChannel.charAt(0).toUpperCase() + mentionedChannel.slice(1)} in our current data. Would you like me to suggest some test ideas for that channel?`;
      }
    }

    // Check for product-specific queries
    const products = ['collagen', 'creatine', 'probiotic', 'hydrate', 'mct'];
    const mentionedProduct = products.find(p => lowerQuery.includes(p));
    if (mentionedProduct) {
      const productTests = testsData.filter(t => t.product.toLowerCase().includes(mentionedProduct));
      if (productTests.length > 0) {
        const winners = productTests.filter(t => t.testVariant.isWinning && t.status === 'completed');
        let response = `Here's what we've learned about **${productTests[0].product}**:\n\n`;
        
        response += `**Total Tests:** ${productTests.length}\n`;
        response += `**Active:** ${productTests.filter(t => t.status === 'active').length}\n`;
        response += `**Completed:** ${productTests.filter(t => t.status === 'completed').length}\n\n`;
        
        if (winners.length > 0) {
          response += `**🏆 Winning Strategies:**\n`;
          winners.forEach(t => {
            response += `• ${t.name} on ${t.channel}: ${t.testVariant.name} increased conversion by +${Math.abs(t.deltas.convRate.value).toFixed(2)}%\n`;
          });
        }
        
        return response;
      }
    }

    // Check for confidence/statistical significance queries
    if (lowerQuery.includes('confidence') || lowerQuery.includes('significant') || lowerQuery.includes('ready to scale')) {
      const highConfidence = testsData.filter(t => t.confidence >= 95);
      if (highConfidence.length > 0) {
        let response = `**Tests Ready to Scale** (95%+ confidence):\n\n`;
        highConfidence.forEach(t => {
          response += `✅ **${t.name}** (${t.id})\n`;
          response += `   • Winner: ${t.testVariant.name}\n`;
          response += `   • Lift: +${Math.abs(t.deltas.convRate.value).toFixed(2)}% conversion, +$${Math.abs(t.deltas.epc.value).toFixed(2)} EPC\n`;
          response += `   • ${t.product} on ${t.channel}\n\n`;
        });
        return response;
      } else {
        return `Currently, we have ${testsData.filter(t => t.confidence >= 70 && t.confidence < 95).length} tests approaching significance (70-94% confidence). The highest confidence test is at ${Math.max(...testsData.map(t => t.confidence))}%. These tests need more time or traffic to reach 95% confidence.`;
      }
    }

    // Check for "best" or "top performing" queries
    if (lowerQuery.includes('best') || lowerQuery.includes('top') || lowerQuery.includes('highest') || lowerQuery.includes('winning')) {
      const completedWinners = testsData.filter(t => t.status === 'completed' && t.testVariant.isWinning);
      if (completedWinners.length > 0) {
        const sorted = completedWinners.sort((a, b) => Math.abs(b.deltas.convRate.percent) - Math.abs(a.deltas.convRate.percent));
        const best = sorted[0];
        
        return `**🏆 Our Top Performing Test:**\n\n**${best.name}** (${best.id})\n• Product: ${best.product}\n• Channel: ${best.channel}\n• Winner: ${best.testVariant.name}\n• Performance: +${Math.abs(best.deltas.convRate.value).toFixed(2)}% conversion (${best.deltas.convRate.percent >= 0 ? '+' : ''}${best.deltas.convRate.percent}%)\n• Revenue Impact: +$${Math.abs(best.deltas.epc.value).toFixed(2)} EPC\n• Confidence: ${best.confidence}%\n\n💡 This insight could be applied to similar products or channels!`;
      }
    }

    // Check for upsell queries
    if (lowerQuery.includes('upsell') || lowerQuery.includes('bundle')) {
      const upsellTests = testsData.filter(t => t.testType === 'Upsell');
      if (upsellTests.length > 0) {
        const test = upsellTests[0];
        return `**Upsell Testing Results:**\n\n${test.name} (${test.id})\n• Tested: ${test.testVariant.name} vs ${test.controlVariant.name}\n• Product: ${test.product}\n• Channel: ${test.channel}\n• Winner: ${test.testVariant.name}\n• Results:\n  - Conversion: ${test.testVariant.convRate.toFixed(2)}% (${test.deltas.convRate.percent >= 0 ? '+' : ''}${test.deltas.convRate.percent}%)\n  - EPC: $${test.testVariant.epc.toFixed(2)} (${test.deltas.epc.percent >= 0 ? '+' : ''}${test.deltas.epc.percent}%)\n  - AOV: $${test.testVariant.aov.toFixed(2)} (${test.deltas.aov.percent >= 0 ? '+' : ''}${test.deltas.aov.percent}%)\n• Confidence: ${test.confidence}%\n\n💰 Estimated monthly impact: +$12,400`;
      }
    }

    // Check for suggestion/recommendation queries
    if (lowerQuery.includes('suggest') || lowerQuery.includes('recommend') || lowerQuery.includes('should i test') || lowerQuery.includes('test idea')) {
      const suggestions = [
        `Based on our winning tests, here are some test ideas:\n\n1. **Cross-Product Upsell Opportunity**\n   Since 6-pack upsells won for Probiotics (+10.9% CR), test similar bundle sizes for Collagen and Hydrate.\n\n2. **Free Gift Testing**\n   Collagen tests show free gifts outperform discounts. Test this on Creatine and MCT Oil.\n\n3. **Shipping Threshold Optimization**\n   Our TikTok shipping test is promising. Expand to Meta and Google to see if the $50 threshold works across channels.\n\n4. **Landing Page Angle Tests**\n   Test problem-solution angles (energy, joint pain, gut health) across products that haven't been tested yet.`,
        
        `💡 **High-Priority Test Recommendations:**\n\n**For Meta:**\n• Test longer landing pages (3000+ words) with detailed testimonials - our data shows +12% CR\n• Try before/after imagery for visual products like Hydrate and MCT Oil\n\n**For TikTok:**\n• Create UGC-style landing pages with authentic customer photos\n• Test the $50 free shipping threshold that's working on other channels\n\n**For Google:**\n• Expand FAQ sections on all landing pages (+19% CR opportunity)\n• Add "Science Behind X" educational content sections`,
        
        `🎯 **Strategic Test Ideas by Goal:**\n\n**Increase AOV:**\n• Test 6-pack vs 4-pack upsells across remaining products\n• Try combo bundles (Collagen + Probiotics)\n\n**Improve Conversion:**\n• Test subscription-first messaging (works for Probiotics)\n• Add social proof sections with customer reviews\n\n**Reduce CAC:**\n• Test free gift offers vs discounts\n• Optimize free shipping thresholds by channel`
      ];
      
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }

    // Check for status queries
    if (lowerQuery.includes('active') || lowerQuery.includes('running') || lowerQuery.includes('current')) {
      const activeTests = testsData.filter(t => t.status === 'active');
      let response = `**🟢 Currently Active Tests (${activeTests.length}):**\n\n`;
      activeTests.forEach(t => {
        response += `**${t.name}** (${t.id})\n`;
        response += `• ${t.product} on ${t.channel}\n`;
        response += `• Running for ${t.daysRunning} days\n`;
        response += `• Current confidence: ${t.confidence}%\n`;
        response += `• Leading variant: ${t.testVariant.isWinning ? t.testVariant.name : t.controlVariant.name}\n\n`;
      });
      return response;
    }

    // Default helpful response
    return `I can help you with that! Here are some things you can ask me:\n\n**Find Tests:**\n• "Show me all TikTok tests"\n• "What tests are running for Collagen?"\n• "Tests with high confidence"\n\n**Analyze Performance:**\n• "What's our best performing test?"\n• "Show me winning upsell strategies"\n• "Tests ready to scale"\n\n**Get Recommendations:**\n• "Suggest a test for Meta"\n• "What should I test next for Probiotics?"\n• "Test ideas to improve conversion"\n\nTry rephrasing your question or ask something specific about your testing data!`;
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
            💡 AI Insights
          </button>
          <button 
            className={`products-tab ${activeTab === 'ai-chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-chat')}
          >
            🤖 AI Chat Assistant
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

        {/* AI Chat Assistant Tab */}
        {activeTab === 'ai-chat' && (
          <div className="products-tab-content active">
            <div style={{ 
              background: '#181818', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px', 
              height: '600px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Chat Header */}
              <div style={{ 
                padding: '20px 24px', 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'linear-gradient(135deg, rgba(29,185,84,0.1) 0%, rgba(59,130,246,0.1) 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '28px' }}>🤖</div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>AI Testing Assistant</h3>
                    <p style={{ fontSize: '12px', color: '#888' }}>Ask me anything about your test data, patterns, and recommendations</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    gap: '12px',
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                  }}>
                    {/* Avatar */}
                    <div style={{ 
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #1db954 0%, #15803d 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </div>

                    {/* Message Bubble */}
                    <div style={{ 
                      maxWidth: '75%',
                      background: msg.role === 'user' ? 'rgba(102,126,234,0.15)' : 'rgba(29,185,84,0.08)',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(102,126,234,0.3)' : 'rgba(29,185,84,0.2)'}`,
                      borderRadius: '12px',
                      padding: '12px 16px'
                    }}>
                      <div style={{ 
                        fontSize: '13px', 
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        color: '#fff'
                      }}>
                        {msg.content}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#666', 
                        marginTop: '6px',
                        textAlign: msg.role === 'user' ? 'right' : 'left'
                      }}>
                        {msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} style={{ 
                padding: '20px 24px', 
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.2)'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me anything... e.g., 'Have we tested free shipping on TikTok?' or 'What's our best upsell test?'"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSubmit(e as any);
                        }
                      }}
                      style={{ 
                        width: '100%',
                        minHeight: '44px',
                        maxHeight: '120px',
                        padding: '12px 16px',
                        background: '#282828',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '13px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>
                      Press Enter to send, Shift+Enter for new line
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    style={{ 
                      padding: '12px 24px',
                      background: chatInput.trim() ? '#1db954' : '#333',
                      color: chatInput.trim() ? '#000' : '#666',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      height: '44px'
                    }}
                    onMouseOver={(e) => {
                      if (chatInput.trim()) e.currentTarget.style.background = '#1ed760';
                    }}
                    onMouseOut={(e) => {
                      if (chatInput.trim()) e.currentTarget.style.background = '#1db954';
                    }}
                  >
                    Send 🚀
                  </button>
                </div>

                {/* Quick Prompts */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setChatInput('Show me all active tests')}
                    style={{ 
                      padding: '6px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#999',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = '#999';
                    }}
                  >
                    Active tests
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatInput('What\'s our best performing test?')}
                    style={{ 
                      padding: '6px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#999',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = '#999';
                    }}
                  >
                    Best test
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatInput('Suggest test ideas for improving Meta conversion')}
                    style={{ 
                      padding: '6px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#999',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = '#999';
                    }}
                  >
                    Test ideas
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatInput('Show me tests with 95%+ confidence')}
                    style={{ 
                      padding: '6px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#999',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = '#999';
                    }}
                  >
                    Ready to scale
                  </button>
                </div>
              </form>
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

