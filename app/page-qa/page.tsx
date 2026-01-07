'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchableSelect from '@/components/SearchableSelect';
import { runQAChecks, getRulesForChannel, defaultQARules } from '@/lib/qa-checks';

interface QACheck {
  id: string;
  category: 'general' | 'email' | 'sms' | 'landing-page' | 'product-specific' | 'compliance' | 'content' | 'spelling' | 'offer' | 'pricing' | 'images' | 'links' | 'seo';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  location: string;
  autoDetected: boolean;
}

interface QAComment {
  id: string;
  checkId: string;
  author: string;
  authorInitials: string;
  text: string;
  taggedUsers: string[];
  timestamp: string;
}

interface PageQA {
  id: string;
  pageUrl: string;
  pageName: string;
  product: string;
  campaign: string;
  channel: string;
  lastChecked: string;
  status: 'passed' | 'issues' | 'critical';
  checksRun: number;
  issuesFound: number;
  checks: QACheck[];
  comments: QAComment[];
}

const mockPageQAs: PageQA[] = [
  {
    id: 'qa-1',
    pageUrl: 'health.nativepath.com/7-reasons-everyone-should-be-taking-this-protein-1107-fb-v8',
    pageName: "7 Reasons Collagen LP (Facebook)",
    product: 'Collagen 25s',
    campaign: 'VDAY-26',
    channel: 'Web',
    lastChecked: '2 hours ago',
    status: 'issues',
    checksRun: 12,
    issuesFound: 3,
    checks: [
      {
        id: 'check-1',
        category: 'spelling',
        severity: 'warning',
        message: 'Potential spelling error: "recieve" should be "receive"',
        location: 'Section 2, Paragraph 3',
        autoDetected: true,
      },
      {
        id: 'check-2',
        category: 'offer',
        severity: 'critical',
        message: 'Offer price mismatch: Page shows $29.99 but offer COL-VDAY is set to $33.99',
        location: 'Pricing Section',
        autoDetected: true,
      },
      {
        id: 'check-3',
        category: 'images',
        severity: 'info',
        message: 'Image alt text missing for product hero image',
        location: 'Hero Section',
        autoDetected: true,
      },
    ],
    comments: [
      {
        id: 'comment-1',
        checkId: 'check-2',
        author: 'Sarah Johnson',
        authorInitials: 'SJ',
        text: '@Mike can you update the pricing? This needs to go live today.',
        taggedUsers: ['Mike Chen'],
        timestamp: '1 hour ago',
      },
    ],
  },
  {
    id: 'qa-2',
    pageUrl: 'nativepath.com/collagen-evergreen',
    pageName: 'Evergreen Collagen LP',
    product: 'Collagen 25s',
    campaign: 'Evergreen',
    channel: 'Web',
    lastChecked: '5 minutes ago',
    status: 'passed',
    checksRun: 12,
    issuesFound: 0,
    checks: [],
    comments: [],
  },
  {
    id: 'qa-3',
    pageUrl: 'nativepath.com/hydrate-spring',
    pageName: 'Spring Hydrate LP',
    product: 'Hydrate',
    campaign: 'SPRNG-26',
    channel: 'Email',
    lastChecked: '1 day ago',
    status: 'critical',
    checksRun: 12,
    issuesFound: 5,
    checks: [
      {
        id: 'check-4',
        category: 'compliance',
        severity: 'critical',
        message: 'Missing FDA disclaimer on health claims',
        location: 'Benefits Section',
        autoDetected: true,
      },
      {
        id: 'check-5',
        category: 'links',
        severity: 'critical',
        message: 'Broken checkout link - returns 404',
        location: 'CTA Button',
        autoDetected: true,
      },
      {
        id: 'check-6',
        category: 'pricing',
        severity: 'warning',
        message: 'COGS margin below 60% threshold (58.2%)',
        location: 'Pricing Calculator',
        autoDetected: true,
      },
      {
        id: 'check-7',
        category: 'seo',
        severity: 'warning',
        message: 'Meta description exceeds 160 characters (currently 187)',
        location: 'Page Head',
        autoDetected: true,
      },
      {
        id: 'check-8',
        category: 'spelling',
        severity: 'info',
        message: 'Repeated word: "the the"',
        location: 'Section 4',
        autoDetected: true,
      },
    ],
    comments: [
      {
        id: 'comment-2',
        checkId: 'check-4',
        author: 'Mike Chen',
        authorInitials: 'MC',
        text: '@Legal can you review this ASAP? Page is blocked from going live.',
        taggedUsers: ['Legal Team'],
        timestamp: '3 hours ago',
      },
      {
        id: 'comment-3',
        checkId: 'check-5',
        author: 'Alex Rivera',
        authorInitials: 'AR',
        text: 'Fixed the link. Running QA again now.',
        taggedUsers: [],
        timestamp: '30 minutes ago',
      },
    ],
  },
];

const teamMembers = [
  'Sarah Johnson',
  'Mike Chen',
  'Alex Rivera',
  'Legal Team',
  'Design Team',
  'Copy Team',
  'Dev Team',
];

export default function PageQAPage() {
  const [pageQAs, setPageQAs] = useState<PageQA[]>(mockPageQAs);
  const [selectedPage, setSelectedPage] = useState<PageQA | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  
  // Comment form state
  const [commentText, setCommentText] = useState('');
  const [selectedCheckForComment, setSelectedCheckForComment] = useState<string | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  const filteredPages = pageQAs.filter((page) => {
    const matchesSearch = searchTerm === '' || 
      page.pageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.pageUrl.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesProduct = productFilter === 'all' || page.product === productFilter;
    const matchesCampaign = campaignFilter === 'all' || page.campaign === campaignFilter;
    const matchesChannel = channelFilter === 'all' || page.channel === channelFilter;

    return matchesSearch && matchesStatus && matchesProduct && matchesCampaign && matchesChannel;
  });

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || productFilter !== 'all' || campaignFilter !== 'all' || channelFilter !== 'all';

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setProductFilter('all');
    setCampaignFilter('all');
    setChannelFilter('all');
  };

  const handleRunQA = async (pageId: string) => {
    const page = pageQAs.find(p => p.id === pageId);
    if (!page) return;

    try {
      // Show loading state
      const loadingAlert = alert('🔄 Fetching and analyzing page...');

      // Fetch the actual page content
      const response = await fetch('/api/scrape-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `https://${page.pageUrl}` })
      });

      const result = await response.json();

      if (!result.success) {
        alert(`❌ Error: ${result.error}`);
        return;
      }

      const { data } = result;
      
      // Run actual QA checks on the scraped content
      const checkResults = runQAChecks(data.textContent, page.channel);
      
      // Add additional checks based on scraped data
      const additionalChecks: any[] = [];

      // Check meta description length
      if (data.metaDescription) {
        const length = data.metaDescription.length;
        if (length > 160) {
          additionalChecks.push({
            ruleId: 'seo-meta-description',
            passed: false,
            message: `Meta description too long: ${length} characters (recommended: 150-160)`,
            location: 'Page head'
          });
        }
      } else {
        additionalChecks.push({
          ruleId: 'seo-meta-description',
          passed: false,
          message: 'Meta description missing',
          location: 'Page head'
        });
      }

      // Check H1 tags
      if (data.h1Tags.length === 0) {
        additionalChecks.push({
          ruleId: 'seo-h1-tag',
          passed: false,
          message: 'No H1 tag found on page',
          location: 'Page structure'
        });
      } else if (data.h1Tags.length > 1) {
        additionalChecks.push({
          ruleId: 'seo-h1-tag',
          passed: false,
          message: `Multiple H1 tags found (${data.h1Tags.length}). Should only have one.`,
          location: 'Page structure'
        });
      }

      // Check images for alt text
      const imagesWithoutAlt = data.images.filter((img: any) => !img.hasAlt);
      if (imagesWithoutAlt.length > 0) {
        additionalChecks.push({
          ruleId: 'img-alt-text',
          passed: false,
          message: `${imagesWithoutAlt.length} image(s) missing alt text`,
          location: 'Images'
        });
      }

      // Check for broken links (http instead of https)
      const httpLinks = data.links.filter((link: string) => link.startsWith('http://'));
      if (httpLinks.length > 0) {
        additionalChecks.push({
          ruleId: 'link-external-https',
          passed: false,
          message: `${httpLinks.length} non-HTTPS link(s) found`,
          location: 'External links'
        });
      }

      // Combine all check results
      const allCheckResults = [...checkResults, ...additionalChecks];
      
      // Convert results to QACheck format
      const newChecks: QACheck[] = allCheckResults.map((result, idx) => {
        const rule = defaultQARules.find(r => r.id === result.ruleId);
        return {
          id: `check-${Date.now()}-${idx}`,
          category: rule?.category || 'content',
          severity: rule?.severity || 'warning',
          message: result.message || 'Check completed',
          location: result.location || 'Unknown',
          autoDetected: true,
        };
      });

      // Update page with new checks
      const updatedPages = pageQAs.map(p => {
        if (p.id === pageId) {
          const criticalIssues = newChecks.filter(c => c.severity === 'critical').length;
          const hasIssues = newChecks.length > 0;
          
          return {
            ...p,
            checks: newChecks,
            checksRun: defaultQARules.filter(r => r.enabled).length,
            issuesFound: newChecks.length,
            status: (criticalIssues > 0 ? 'critical' : hasIssues ? 'issues' : 'passed') as 'passed' | 'issues' | 'critical',
            lastChecked: 'Just now',
          };
        }
        return p;
      });

      setPageQAs(updatedPages);
      
      // Update selected page if it's open
      const updatedPage = updatedPages.find(p => p.id === pageId);
      if (updatedPage) {
        setSelectedPage(updatedPage);
        setIsDetailOpen(true); // Open the detail modal to show results
      }

      // Show success message
      alert(`✅ QA checks complete!\n\n${defaultQARules.filter(r => r.enabled).length} checks run\n${newChecks.length} issues found\n\nOpening detailed results...`);

    } catch (error: any) {
      console.error('QA check error:', error);
      alert(`❌ Error running QA checks: ${error.message}`);
    }
  };

  const handleAddComment = (checkId: string) => {
    if (!commentText.trim() || !selectedPage) return;

    const newComment: QAComment = {
      id: `comment-${Date.now()}`,
      checkId: checkId,
      author: 'Current User',
      authorInitials: 'CU',
      text: commentText,
      taggedUsers: taggedUsers,
      timestamp: 'Just now',
    };

    const updatedPages = pageQAs.map(page => {
      if (page.id === selectedPage.id) {
        return {
          ...page,
          comments: [...page.comments, newComment],
        };
      }
      return page;
    });

    setPageQAs(updatedPages);
    setSelectedPage({
      ...selectedPage,
      comments: [...selectedPage.comments, newComment],
    });
    
    setCommentText('');
    setTaggedUsers([]);
    setSelectedCheckForComment(null);
  };

  const handleTagUser = (user: string) => {
    if (!taggedUsers.includes(user)) {
      setTaggedUsers([...taggedUsers, user]);
      setCommentText(commentText + `@${user} `);
    }
    setShowTagDropdown(false);
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
      default: return '📋';
    }
  };

  return (
    <div style={{ padding: '48px 56px' }}>
      {/* Header */}
      <div className="content-header" style={{ marginBottom: '24px' }}>
        <h1 className="header-title">
          Page QA
        </h1>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '280px' }}>
          <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>SEARCH</label>
          <div style={{ position: 'relative' }}>
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
            { value: 'all', label: 'All Status' },
            { value: 'passed', label: '✅ Passed' },
            { value: 'issues', label: '⚠️ Issues' },
            { value: 'critical', label: '🚨 Critical' }
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
            { value: 'Hydrate', label: 'Hydrate' },
            { value: 'Probiotics', label: 'Probiotics' }
          ]}
        />

        {/* Campaign Filter */}
        <SearchableSelect
          label="CAMPAIGN"
          value={campaignFilter}
          onChange={setCampaignFilter}
          options={[
            { value: 'all', label: 'All Campaigns' },
            { value: 'VDAY-26', label: 'VDAY-26' },
            { value: 'Evergreen', label: 'Evergreen' },
            { value: 'SPRNG-26', label: 'SPRNG-26' }
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
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
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
          onClick={() => alert('Running QA on all pages...')}
          style={{
            padding: '10px 20px',
            background: '#1db954',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ▶️ Run All QA Checks
        </button>
      </div>

      {/* Active Checks Info */}
      <div style={{
        marginBottom: '16px',
        background: 'rgba(29,185,84,0.1)',
        border: '1px solid rgba(29,185,84,0.3)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1db954', marginBottom: '2px' }}>
              {defaultQARules.filter(r => r.enabled).length} Active QA Checks
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {defaultQARules.filter(r => r.enabled && r.severity === 'critical').length} critical • {' '}
              {defaultQARules.filter(r => r.enabled && r.severity === 'warning').length} warnings • {' '}
              {defaultQARules.filter(r => r.enabled && r.severity === 'info').length} info
            </div>
          </div>
        </div>
        <Link href="/page-qa/settings">
          <button style={{
            padding: '6px 12px',
            background: 'rgba(29,185,84,0.2)',
            border: '1px solid rgba(29,185,84,0.4)',
            borderRadius: '6px',
            color: '#1db954',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            Customize Checks →
          </button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>TOTAL PAGES</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{pageQAs.length}</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>PASSED</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1db954' }}>
            {pageQAs.filter(p => p.status === 'passed').length}
          </div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>ISSUES</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>
            {pageQAs.filter(p => p.status === 'issues').length}
          </div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>CRITICAL</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>
            {pageQAs.filter(p => p.status === 'critical').length}
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div style={{ background: '#1a1a1a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
          <thead>
            <tr style={{ background: '#282828' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>STATUS</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>PAGE NAME</th>
              <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>PRODUCT</th>
              <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>CAMPAIGN</th>
              <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>CHANNEL</th>
              <th style={{ padding: '14px 12px', textAlign: 'center', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>CHECKS</th>
              <th style={{ padding: '14px 12px', textAlign: 'center', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>ISSUES</th>
              <th style={{ padding: '14px 12px', textAlign: 'left', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>LAST CHECKED</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#b3b3b3', fontWeight: '700' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredPages.map((page) => (
              <tr 
                key={page.id}
                style={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => {
                  setSelectedPage(page);
                  setIsDetailOpen(true);
                }}
              >
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: page.status === 'passed' ? 'rgba(29,185,84,0.15)' : page.status === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: page.status === 'passed' ? '#1db954' : page.status === 'critical' ? '#ef4444' : '#f59e0b',
                  }}>
                    {page.status === 'passed' ? '✅ Passed' : page.status === 'critical' ? '🚨 Critical' : '⚠️ Issues'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                  <div style={{ 
                    fontWeight: '600', 
                    marginBottom: '4px', 
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {page.pageName}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#3b82f6',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '250px'
                  }}>
                    {page.pageUrl}
                  </div>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{ 
                    color: '#b3b3b3', 
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    maxWidth: '150px'
                  }}>
                    {page.product}
                  </span>
                </td>
                <td style={{ padding: '14px 12px', color: '#b3b3b3', fontSize: '13px' }}>{page.campaign}</td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: 'rgba(59,130,246,0.15)',
                    color: '#3b82f6',
                  }}>
                    {page.channel}
                  </span>
                </td>
                <td style={{ padding: '14px 12px', color: '#b3b3b3', fontSize: '13px', textAlign: 'center' }}>{page.checksRun}</td>
                <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                  <span style={{ 
                    color: page.issuesFound === 0 ? '#1db954' : page.status === 'critical' ? '#ef4444' : '#f59e0b',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {page.issuesFound}
                  </span>
                </td>
                <td style={{ padding: '14px 12px', color: '#666', fontSize: '12px' }}>{page.lastChecked}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <Link href={`/page-qa/review/${page.id}`}>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(29,185,84,0.15)',
                        border: '1px solid rgba(29,185,84,0.3)',
                        borderRadius: '6px',
                        color: '#1db954',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📝 Review Page
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedPage && (
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
          onClick={() => setIsDetailOpen(false)}
        >
          <div 
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsDetailOpen(false)}
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

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                {selectedPage.pageName}
              </h2>
              <div style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '16px' }}>
                {selectedPage.pageUrl}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: selectedPage.status === 'passed' ? 'rgba(29,185,84,0.15)' : selectedPage.status === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                  color: selectedPage.status === 'passed' ? '#1db954' : selectedPage.status === 'critical' ? '#ef4444' : '#f59e0b',
                }}>
                  {selectedPage.status === 'passed' ? '✅ Passed' : selectedPage.status === 'critical' ? '🚨 Critical' : '⚠️ Issues'}
                </span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: 'rgba(59,130,246,0.15)',
                  color: '#3b82f6',
                }}>
                  {selectedPage.channel}
                </span>
                <span style={{ fontSize: '13px', color: '#888' }}>
                  {selectedPage.checksRun} checks • {selectedPage.issuesFound} issues • Last checked {selectedPage.lastChecked}
                </span>
              </div>
            </div>

            {/* QA Checks */}
            {selectedPage.checks.length > 0 ? (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>QA Results</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedPage.checks.map((check) => (
                    <div 
                      key={check.id}
                      style={{
                        background: '#0f0f0f',
                        border: `1px solid ${getSeverityColor(check.severity)}40`,
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{getCategoryIcon(check.category)}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '10px',
                              fontWeight: '600',
                              background: `${getSeverityColor(check.severity)}20`,
                              color: getSeverityColor(check.severity),
                              textTransform: 'uppercase',
                            }}>
                              {check.severity}
                            </span>
                            <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>
                              {check.category}
                            </span>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                            {check.message}
                          </div>
                          <div style={{ fontSize: '12px', color: '#888' }}>
                            📍 {check.location}
                          </div>
                        </div>
                      </div>

                      {/* Comments for this check */}
                      {selectedPage.comments.filter(c => c.checkId === check.id).length > 0 && (
                        <div style={{ 
                          marginTop: '12px', 
                          paddingTop: '12px', 
                          borderTop: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          {selectedPage.comments.filter(c => c.checkId === check.id).map((comment) => (
                            <div key={comment.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: '#1db954',
                                color: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: '700',
                                flexShrink: 0,
                              }}>
                                {comment.authorInitials}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>
                                  {comment.author}
                                </div>
                                <div style={{ fontSize: '13px', color: '#b3b3b3', marginBottom: '4px' }}>
                                  {comment.text}
                                </div>
                                <div style={{ fontSize: '11px', color: '#666' }}>
                                  {comment.timestamp}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      {selectedCheckForComment === check.id ? (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ position: 'relative', marginBottom: '8px' }}>
                            <textarea
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Add a comment... Use @ to tag someone"
                              style={{
                                width: '100%',
                                padding: '10px',
                                background: '#282828',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '13px',
                                minHeight: '80px',
                                resize: 'vertical',
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <button
                              onClick={() => setShowTagDropdown(!showTagDropdown)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              @ Tag Someone
                            </button>
                            {taggedUsers.length > 0 && (
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {taggedUsers.map((user, idx) => (
                                  <span key={idx} style={{
                                    padding: '4px 8px',
                                    background: 'rgba(29,185,84,0.15)',
                                    color: '#1db954',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                  }}>
                                    @{user}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {showTagDropdown && (
                            <div style={{
                              background: '#282828',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '6px',
                              padding: '8px',
                              marginBottom: '8px',
                              maxHeight: '150px',
                              overflow: 'auto',
                            }}>
                              {teamMembers.map((member) => (
                                <div
                                  key={member}
                                  onClick={() => handleTagUser(member)}
                                  style={{
                                    padding: '8px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    transition: 'background 0.2s',
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  {member}
                                </div>
                              ))}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleAddComment(check.id)}
                              style={{
                                padding: '8px 16px',
                                background: '#1db954',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#000',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              Post Comment
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCheckForComment(null);
                                setCommentText('');
                                setTaggedUsers([]);
                              }}
                              style={{
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '13px',
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedCheckForComment(check.id)}
                          style={{
                            marginTop: '12px',
                            padding: '6px 12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            color: '#888',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          💬 Add Comment
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(29,185,84,0.1)',
                border: '1px solid rgba(29,185,84,0.3)',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '24px',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1db954', marginBottom: '4px' }}>
                  All Checks Passed!
                </div>
                <div style={{ fontSize: '13px', color: '#888' }}>
                  No issues found on this page
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => handleRunQA(selectedPage.id)}
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
                ▶️ Re-run QA Checks
              </button>
              <button
                onClick={() => window.open(`https://${selectedPage.pageUrl}`, '_blank')}
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
                🔗 View Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

