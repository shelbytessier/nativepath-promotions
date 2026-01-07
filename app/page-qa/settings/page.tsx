'use client';

import { useState } from 'react';
import Link from 'next/link';
import { defaultQARules, type QACheckRule } from '@/lib/qa-checks';
import SearchableSelect from '@/components/SearchableSelect';

export default function QASettingsPage() {
  const [rules, setRules] = useState<QACheckRule[]>(defaultQARules);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRules = rules.filter((rule) => {
    const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;
    const matchesChannel = channelFilter === 'all' || 
      rule.channels.length === 0 || 
      rule.channels.includes(channelFilter);
    const matchesSearch = searchTerm === '' || 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesChannel && matchesSearch;
  });

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const updateRuleSeverity = (ruleId: string, severity: 'critical' | 'warning' | 'info') => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, severity } : rule
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#888';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spelling': return '✏️';
      case 'offer': return '💰';
      case 'pricing': return '💵';
      case 'images': return '🖼️';
      case 'links': return '🔗';
      case 'seo': return '🔍';
      case 'compliance': return '⚖️';
      case 'content': return '📝';
      default: return '📋';
    }
  };

  const enabledCount = rules.filter(r => r.enabled).length;
  const criticalCount = rules.filter(r => r.enabled && r.severity === 'critical').length;

  return (
    <div style={{ padding: '48px 56px' }}>
      {/* Header */}
      <div className="content-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Link href="/page-qa" style={{ textDecoration: 'none', color: '#888', fontSize: '13px', marginBottom: '8px', display: 'inline-block' }}>
              ← Back to Page QA
            </Link>
            <h1 className="header-title">
              QA Check Settings
            </h1>
          </div>
          <button
            onClick={() => alert('Settings saved! These rules will be applied to all future QA checks.')}
            style={{
              padding: '12px 24px',
              background: '#1db954',
              border: 'none',
              borderRadius: '6px',
              color: '#000',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            💾 Save Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>TOTAL CHECKS</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{rules.length}</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>ENABLED</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1db954' }}>{enabledCount}</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>CRITICAL</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>{criticalCount}</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>DISABLED</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#666' }}>{rules.length - enabledCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '280px' }}>
          <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>SEARCH</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search checks..."
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

        {/* Category Filter */}
        <SearchableSelect
          label="CATEGORY"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: 'all', label: 'All Categories' },
            { value: 'spelling', label: '✏️ Spelling' },
            { value: 'offer', label: '💰 Offers' },
            { value: 'pricing', label: '💵 Pricing' },
            { value: 'images', label: '🖼️ Images' },
            { value: 'links', label: '🔗 Links' },
            { value: 'seo', label: '🔍 SEO' },
            { value: 'compliance', label: '⚖️ Compliance' },
            { value: 'content', label: '📝 Content' }
          ]}
        />

        {/* Channel Filter */}
        <SearchableSelect
          label="CHANNEL"
          value={channelFilter}
          onChange={setChannelFilter}
          options={[
            { value: 'all', label: 'All Channels' },
            { value: 'Web', label: 'Web' },
            { value: 'Email', label: 'Email' },
            { value: 'Facebook', label: 'Facebook' },
            { value: 'Instagram', label: 'Instagram' },
            { value: 'Twitter', label: 'Twitter' }
          ]}
        />
      </div>

      {/* Rules Table */}
      <div style={{ background: '#1a1a1a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: '600', width: '50px' }}>ENABLED</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: '600' }}>CHECK NAME</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: '600' }}>CATEGORY</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: '600' }}>SEVERITY</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: '600' }}>CHANNELS</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: '600' }}>DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map((rule) => (
              <tr 
                key={rule.id}
                style={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.2s',
                  opacity: rule.enabled ? 1 : 0.5,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => toggleRule(rule.id)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#1db954',
                      }}
                    />
                  </label>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{rule.name}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#b3b3b3',
                  }}>
                    {getCategoryIcon(rule.category)} {rule.category}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <select
                    value={rule.severity}
                    onChange={(e) => updateRuleSeverity(rule.id, e.target.value as any)}
                    disabled={!rule.enabled}
                    style={{
                      padding: '6px 12px',
                      background: `${getSeverityColor(rule.severity)}20`,
                      color: getSeverityColor(rule.severity),
                      border: `1px solid ${getSeverityColor(rule.severity)}40`,
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: rule.enabled ? 'pointer' : 'not-allowed',
                      textTransform: 'uppercase',
                    }}
                  >
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </td>
                <td style={{ padding: '16px', color: '#888', fontSize: '13px' }}>
                  {rule.channels.length === 0 ? (
                    <span style={{ color: '#666' }}>All Channels</span>
                  ) : (
                    rule.channels.join(', ')
                  )}
                </td>
                <td style={{ padding: '16px', color: '#888', fontSize: '13px' }}>
                  {rule.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div style={{
        marginTop: '24px',
        background: 'rgba(29,185,84,0.1)',
        border: '1px solid rgba(29,185,84,0.3)',
        borderRadius: '8px',
        padding: '16px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1db954' }}>
          💡 How QA Checks Work
        </div>
        <ul style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', paddingLeft: '20px' }}>
          <li>Enable/disable checks based on your needs</li>
          <li>Adjust severity levels to control alert priority</li>
          <li>Channel-specific checks only run on applicable channels</li>
          <li>Changes apply to all future QA runs</li>
          <li>Critical issues block page approval, warnings require review</li>
        </ul>
      </div>
    </div>
  );
}

