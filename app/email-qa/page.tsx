'use client';

import { useState } from 'react';
import Link from 'next/link';
import { runQAChecks, defaultQARules } from '@/lib/qa-checks';

interface LinkCheck {
  url: string;
  status: 'checking' | 'passed' | 'failed';
  statusCode?: number;
  error?: string;
  qaIssues?: any[];
}

interface EmailQAResult {
  campaignName: string;
  subject: string;
  preheader: string;
  links: LinkCheck[];
  totalLinks: number;
  passedLinks: number;
  failedLinks: number;
  timestamp: string;
}

export default function EmailQAPage() {
  const [emailHTML, setEmailHTML] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<EmailQAResult | null>(null);

  const extractLinksFromHTML = (html: string): string[] => {
    const linkRegex = /href=["']([^"']+)["']/gi;
    const links: string[] = [];
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const url = match[1];
      // Filter out mailto, tel, and anchor links
      if (!url.startsWith('mailto:') && !url.startsWith('tel:') && !url.startsWith('#')) {
        links.push(url);
      }
    }

    return [...new Set(links)]; // Remove duplicates
  };

  const checkLink = async (url: string): Promise<LinkCheck> => {
    try {
      // First check if link is accessible
      const response = await fetch('/api/scrape-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const result = await response.json();

      if (!result.success) {
        return {
          url,
          status: 'failed',
          error: result.error || 'Failed to fetch page',
        };
      }

      // Run QA checks on the page
      const qaResults = runQAChecks(result.data.textContent, 'Email');
      
      // Add additional checks
      const additionalIssues: any[] = [];

      // Check meta description
      if (result.data.metaDescription && result.data.metaDescription.length > 160) {
        additionalIssues.push({
          message: `Meta description too long: ${result.data.metaDescription.length} chars`,
          severity: 'warning'
        });
      }

      // Check H1 tags
      if (result.data.h1Tags.length === 0) {
        additionalIssues.push({
          message: 'No H1 tag found',
          severity: 'warning'
        });
      } else if (result.data.h1Tags.length > 1) {
        additionalIssues.push({
          message: `Multiple H1 tags (${result.data.h1Tags.length})`,
          severity: 'warning'
        });
      }

      // Check images without alt text
      const imagesWithoutAlt = result.data.images.filter((img: any) => !img.hasAlt);
      if (imagesWithoutAlt.length > 0) {
        additionalIssues.push({
          message: `${imagesWithoutAlt.length} images missing alt text`,
          severity: 'warning'
        });
      }

      const allIssues = [...qaResults, ...additionalIssues];

      return {
        url,
        status: allIssues.length === 0 ? 'passed' : 'failed',
        statusCode: 200,
        qaIssues: allIssues.length > 0 ? allIssues : undefined,
      };

    } catch (error: any) {
      return {
        url,
        status: 'failed',
        error: error.message || 'Unknown error',
      };
    }
  };

  const handleRunEmailQA = async () => {
    if (!emailHTML.trim()) {
      alert('Please paste your email HTML');
      return;
    }

    setIsChecking(true);
    setResults(null);

    try {
      // Extract all links from email
      const links = extractLinksFromHTML(emailHTML);

      if (links.length === 0) {
        alert('No links found in email HTML');
        setIsChecking(false);
        return;
      }

      // Initialize results
      const linkChecks: LinkCheck[] = links.map(url => ({
        url,
        status: 'checking'
      }));

      setResults({
        campaignName: campaignName || 'Untitled Campaign',
        subject: subject || 'No subject',
        preheader: preheader || 'No preheader',
        links: linkChecks,
        totalLinks: links.length,
        passedLinks: 0,
        failedLinks: 0,
        timestamp: new Date().toLocaleString(),
      });

      // Check each link
      const checkedLinks: LinkCheck[] = [];
      let passed = 0;
      let failed = 0;

      for (let i = 0; i < links.length; i++) {
        const result = await checkLink(links[i]);
        checkedLinks.push(result);

        if (result.status === 'passed') {
          passed++;
        } else {
          failed++;
        }

        // Update results in real-time
        setResults({
          campaignName: campaignName || 'Untitled Campaign',
          subject: subject || 'No subject',
          preheader: preheader || 'No preheader',
          links: checkedLinks,
          totalLinks: links.length,
          passedLinks: passed,
          failedLinks: failed,
          timestamp: new Date().toLocaleString(),
        });
      }

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#888';
    }
  };

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
              Email Campaign QA
            </h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
              Test email links before sending to customers
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        marginBottom: '24px',
        background: 'rgba(59,130,246,0.1)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: '8px',
        padding: '16px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#3b82f6' }}>
          📧 How Email QA Works
        </div>
        <ul style={{ fontSize: '13px', color: '#b3b3b3', lineHeight: '1.6', paddingLeft: '20px', margin: 0 }}>
          <li>Paste your email HTML or send yourself a test email and copy the source</li>
          <li>System extracts all links from the email</li>
          <li>Each link is checked: accessibility, QA issues, broken links</li>
          <li>Get instant feedback before sending to customers</li>
          <li>Catch pricing errors, broken pages, and compliance issues</li>
        </ul>
      </div>

      {/* Input Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left Column - Email Details */}
        <div style={{ background: '#1a1a1a', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Campaign Details</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>CAMPAIGN NAME</label>
            <input
              type="text"
              placeholder="e.g., Valentine's Day Sale"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>SUBJECT LINE</label>
            <input
              type="text"
              placeholder="e.g., Save $81 on Collagen Today!"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>PREHEADER TEXT</label>
            <input
              type="text"
              placeholder="e.g., Limited time offer - don't miss out!"
              value={preheader}
              onChange={(e) => setPreheader(e.target.value)}
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

        {/* Right Column - Email HTML */}
        <div style={{ background: '#1a1a1a', padding: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Email HTML</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '6px' }}>PASTE EMAIL HTML</label>
            <textarea
              placeholder="Paste your email HTML here... or send yourself a test email and copy the source code"
              value={emailHTML}
              onChange={(e) => setEmailHTML(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                minHeight: '200px',
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
            />
          </div>

          <button
            onClick={handleRunEmailQA}
            disabled={isChecking || !emailHTML.trim()}
            style={{
              width: '100%',
              padding: '12px',
              background: isChecking ? '#666' : '#1db954',
              border: 'none',
              borderRadius: '6px',
              color: isChecking ? '#ccc' : '#000',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isChecking ? 'not-allowed' : 'pointer',
            }}
          >
            {isChecking ? '🔄 Checking Links...' : '▶️ Run Email QA'}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div style={{ background: '#1a1a1a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              QA Results: {results.campaignName}
            </h2>
            <div style={{ fontSize: '13px', color: '#888' }}>
              Subject: {results.subject} • Checked: {results.timestamp}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#0f0f0f', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>TOTAL LINKS</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{results.totalLinks}</div>
            </div>
            <div style={{ background: '#0f0f0f', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>PASSED</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1db954' }}>{results.passedLinks}</div>
            </div>
            <div style={{ background: '#0f0f0f', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontWeight: '600' }}>FAILED</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{results.failedLinks}</div>
            </div>
          </div>

          {/* Link Results */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Link Check Results</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {results.links.map((link, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#0f0f0f',
                    border: `1px solid ${link.status === 'passed' ? 'rgba(29,185,84,0.3)' : link.status === 'failed' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>
                      {link.status === 'checking' ? '🔄' : link.status === 'passed' ? '✅' : '❌'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', wordBreak: 'break-all' }}>
                        {link.url}
                      </div>
                      {link.status === 'checking' && (
                        <div style={{ fontSize: '12px', color: '#888' }}>Checking...</div>
                      )}
                      {link.status === 'passed' && (
                        <div style={{ fontSize: '12px', color: '#1db954' }}>✓ Link accessible, no issues found</div>
                      )}
                      {link.status === 'failed' && link.error && (
                        <div style={{ fontSize: '12px', color: '#ef4444' }}>✗ {link.error}</div>
                      )}
                      {link.qaIssues && link.qaIssues.length > 0 && (
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', fontWeight: '600' }}>
                            {link.qaIssues.length} ISSUE{link.qaIssues.length !== 1 ? 'S' : ''} FOUND:
                          </div>
                          {link.qaIssues.map((issue: any, issueIdx: number) => (
                            <div key={issueIdx} style={{ fontSize: '12px', color: '#b3b3b3', marginBottom: '4px' }}>
                              <span style={{ 
                                color: getSeverityColor(issue.severity || 'warning'),
                                marginRight: '6px'
                              }}>
                                •
                              </span>
                              {issue.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {!isChecking && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: results.failedLinks === 0 ? 'rgba(29,185,84,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${results.failedLinks === 0 ? 'rgba(29,185,84,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: results.failedLinks === 0 ? '#1db954' : '#ef4444' }}>
                {results.failedLinks === 0 ? '✅ All Links Passed!' : `⚠️ ${results.failedLinks} Link${results.failedLinks !== 1 ? 's' : ''} Failed`}
              </div>
              <div style={{ fontSize: '13px', color: '#b3b3b3' }}>
                {results.failedLinks === 0 
                  ? 'Your email is ready to send. All links are working and pages passed QA checks.'
                  : 'Please fix the failed links before sending this email to customers.'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

