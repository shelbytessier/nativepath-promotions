'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { runQAChecks, defaultQARules } from '@/lib/qa-checks';

interface Comment {
  id: string;
  x: number;
  y: number;
  author: string;
  authorInitials: string;
  text: string;
  taggedUsers: string[];
  timestamp: string;
  resolved: boolean;
  type: 'qa-error' | 'manual';
  severity?: 'critical' | 'warning' | 'info';
  category?: string;
  target: 'email' | 'page';
}

const teamMembers = [
  'Sarah Johnson',
  'Mike Chen',
  'Alex Rivera',
  'Legal Team',
  'Design Team',
  'Copy Team',
  'Dev Team',
];

const mockEmails: any = {
  'email-1': {
    id: 'email-1',
    emailUrl: 'https://health.nativepath.com/7-reasons-everyone-should-be-taking-this-protein-1107-fb-v8',
    emailName: 'VDAY-26 | Save $81 on Collagen',
    campaign: 'VDAY-26',
    channel: 'Email',
    subject: 'Save $81 on Collagen Today!',
    linkedPages: [
      {
        name: 'VDAY-26 | 7 Reasons Collagen LP',
        url: 'https://health.nativepath.com/7-reasons-everyone-should-be-taking-this-protein-1107-fb-v8'
      }
    ]
  }
};

export default function EmailReviewPage() {
  const params = useParams();
  const router = useRouter();
  const emailId = params.id as string;
  
  // Load email data from localStorage or use mock data
  const [email, setEmail] = useState<any>(null);
  
  useEffect(() => {
    const storedData = localStorage.getItem(`email-data-${emailId}`);
    if (storedData) {
      setEmail(JSON.parse(storedData));
    } else {
      setEmail(mockEmails[emailId]);
    }
  }, [emailId]);

  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentPosition, setNewCommentPosition] = useState<{ x: number; y: number; target: 'email' | 'page' } | null>(null);
  const [commentText, setCommentText] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const [emailLoaded, setEmailLoaded] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isRunningQA, setIsRunningQA] = useState(false);
  const [activeView, setActiveView] = useState<'split' | 'email' | 'page'>('split');

  useEffect(() => {
    const savedComments = localStorage.getItem(`email-comments-${emailId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    
    // Auto-run QA checks on load
    const hasAutoRun = localStorage.getItem(`email-qa-autorun-${emailId}`);
    if (!hasAutoRun && email) {
      setTimeout(() => {
        handleRunQA();
        localStorage.setItem(`email-qa-autorun-${emailId}`, 'true');
      }, 1000);
    }
  }, [emailId]);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem(`email-comments-${emailId}`, JSON.stringify(newComments));
  };

  const handleIframeClick = (e: React.MouseEvent<HTMLDivElement>, target: 'email' | 'page') => {
    if (!isAddingComment) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewCommentPosition({ x, y, target });
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !newCommentPosition) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      x: newCommentPosition.x,
      y: newCommentPosition.y,
      author: 'Current User',
      authorInitials: 'CU',
      text: commentText,
      taggedUsers: taggedUsers,
      timestamp: new Date().toLocaleString(),
      resolved: false,
      type: 'manual',
      target: newCommentPosition.target,
    };

    saveComments([...comments, newComment]);
    setCommentText('');
    setTaggedUsers([]);
    setNewCommentPosition(null);
    setIsAddingComment(false);
  };

  const handleResolveComment = (commentId: string) => {
    const updatedComments = comments.map(c =>
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    );
    saveComments(updatedComments);
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Delete this comment?')) {
      saveComments(comments.filter(c => c.id !== commentId));
      setSelectedComment(null);
    }
  };

  const handleRunQA = async () => {
    setIsRunningQA(true);

    try {
      // Fetch email content
      const emailResponse = await fetch('/api/scrape-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: email.emailUrl })
      });

      const emailResult = await emailResponse.json();
      const qaComments: Comment[] = [];

      if (emailResult.success) {
        // Run RTN (Email) QA checks
        const qaIssues = runQAChecks(emailResult.data.textContent, 'RTN');
        
        qaIssues.forEach((issue, index) => {
          if (!issue.message || issue.passed) return;
          
          const rule = defaultQARules.find(r => r.id === issue.ruleId);
          const yPosition = 10 + (index * 12);
          
          qaComments.push({
            id: `qa-email-${Date.now()}-${index}`,
            x: 50,
            y: Math.min(yPosition, 90),
            author: 'QA System',
            authorInitials: 'QA',
            text: `[EMAIL] ${issue.message}`,
            taggedUsers: [],
            timestamp: new Date().toLocaleString(),
            resolved: false,
            type: 'qa-error',
            severity: (rule?.severity || 'warning') as 'critical' | 'warning' | 'info',
            category: rule?.category || 'general',
            target: 'email',
          });
        });
      }

      // Check linked pages
      if (email.linkedPages && email.linkedPages.length > 0) {
        for (const linkedPage of email.linkedPages) {
          const pageResponse = await fetch('/api/scrape-page', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: linkedPage.url })
          });

          const pageResult = await pageResponse.json();

          if (pageResult.success) {
            const pageQAIssues = runQAChecks(pageResult.data.textContent, 'ACQ');
            
            pageQAIssues.forEach((issue, index) => {
              if (!issue.message || issue.passed) return;
              
              const rule = defaultQARules.find(r => r.id === issue.ruleId);
              const yPosition = 10 + (index * 12);
              
              qaComments.push({
                id: `qa-page-${Date.now()}-${index}`,
                x: 50,
                y: Math.min(yPosition, 90),
                author: 'QA System',
                authorInitials: 'QA',
                text: `[PAGE] ${issue.message}`,
                taggedUsers: [],
                timestamp: new Date().toLocaleString(),
                resolved: false,
                type: 'qa-error',
                severity: (rule?.severity || 'warning') as 'critical' | 'warning' | 'info',
                category: rule?.category || 'general',
                target: 'page',
              });
            });
          }
        }
      }

      // Only add new QA comments
      const existingCommentTexts = comments.map(c => c.text);
      const newQAComments = qaComments.filter(qc => !existingCommentTexts.includes(qc.text));
      
      if (newQAComments.length > 0) {
        saveComments([...comments, ...newQAComments]);
      }
    } catch (error: any) {
      console.error('QA Check Error:', error);
    } finally {
      setIsRunningQA(false);
    }
  };

  const handleTagUser = (user: string) => {
    if (!taggedUsers.includes(user)) {
      setTaggedUsers([...taggedUsers, user]);
      setCommentText(commentText + `@${user} `);
    }
    setShowTagDropdown(false);
  };

  const visibleComments = showResolved ? comments : comments.filter(c => !c.resolved);
  const emailComments = visibleComments.filter(c => c.target === 'email');
  const pageComments = visibleComments.filter(c => c.target === 'page');

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#888';
    }
  };

  if (!email) {
    return (
      <div style={{ padding: '48px 56px' }}>
        <h1>Email not found</h1>
        <Link href="/email-qa">← Back to Email QA</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left Sidebar - Comments Panel */}
      <div style={{
        width: '360px',
        background: '#1a1a1a',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/email-qa" style={{ textDecoration: 'none', color: '#888', fontSize: '13px', marginBottom: '12px', display: 'inline-block' }}>
            ← Back to Email QA
          </Link>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{email.emailName}</h2>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Subject: {email.subject}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{email.campaign} • {email.channel}</div>
        </div>

        {/* Actions */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => handleRunQA()}
            disabled={isRunningQA}
            style={{
              padding: '10px 16px',
              background: isRunningQA ? '#666' : 'rgba(29,185,84,0.15)',
              border: '1px solid rgba(29,185,84,0.3)',
              borderRadius: '6px',
              color: isRunningQA ? '#ccc' : '#1db954',
              fontSize: '13px',
              fontWeight: '600',
              cursor: isRunningQA ? 'not-allowed' : 'pointer',
            }}
          >
            {isRunningQA ? '🔄 Running QA...' : '▶️ Run QA Checks'}
          </button>
          <button
            onClick={() => setIsAddingComment(!isAddingComment)}
            style={{
              padding: '10px 16px',
              background: isAddingComment ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isAddingComment ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '6px',
              color: isAddingComment ? '#3b82f6' : '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            💬 {isAddingComment ? 'Cancel Comment' : 'Add Comment'}
          </button>
        </div>

        {/* View Toggle */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveView('split')}
            style={{
              flex: 1,
              padding: '6px 12px',
              background: activeView === 'split' ? 'rgba(29,185,84,0.15)' : 'transparent',
              border: `1px solid ${activeView === 'split' ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '4px',
              color: activeView === 'split' ? '#1db954' : '#888',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveView('email')}
            style={{
              flex: 1,
              padding: '6px 12px',
              background: activeView === 'email' ? 'rgba(29,185,84,0.15)' : 'transparent',
              border: `1px solid ${activeView === 'email' ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '4px',
              color: activeView === 'email' ? '#1db954' : '#888',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Email Only
          </button>
          <button
            onClick={() => setActiveView('page')}
            style={{
              flex: 1,
              padding: '6px 12px',
              background: activeView === 'page' ? 'rgba(29,185,84,0.15)' : 'transparent',
              border: `1px solid ${activeView === 'page' ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '4px',
              color: activeView === 'page' ? '#1db954' : '#888',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Page Only
          </button>
        </div>

        {/* Comments List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>
              {visibleComments.length} COMMENT{visibleComments.length !== 1 ? 'S' : ''}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#888', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
              />
              Show Resolved ({comments.filter(c => c.resolved).length})
            </label>
          </div>

          {visibleComments.map((comment) => (
            <div
              key={comment.id}
              onClick={() => setSelectedComment(comment.id)}
              style={{
                background: selectedComment === comment.id ? '#282828' : '#0f0f0f',
                border: `1px solid ${selectedComment === comment.id ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px',
                cursor: 'pointer',
                opacity: comment.resolved ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: comment.type === 'qa-error' ? getSeverityColor(comment.severity) : '#1db954',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#000',
                  flexShrink: 0,
                }}>
                  {comment.authorInitials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>
                    {comment.author}
                    {comment.type === 'qa-error' && (
                      <span style={{
                        marginLeft: '6px',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: getSeverityColor(comment.severity),
                        color: '#000',
                      }}>
                        {comment.severity?.toUpperCase()}
                      </span>
                    )}
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: comment.target === 'email' ? 'rgba(59,130,246,0.2)' : 'rgba(251,191,36,0.2)',
                      color: comment.target === 'email' ? '#3b82f6' : '#fbbf24',
                    }}>
                      {comment.target.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>
                    {comment.timestamp}
                  </div>
                  <div style={{ fontSize: '13px', color: '#e0e0e0', wordBreak: 'break-word' }}>
                    {comment.text}
                  </div>
                  {comment.taggedUsers.length > 0 && (
                    <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {comment.taggedUsers.map((user, idx) => (
                        <span key={idx} style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          background: 'rgba(59,130,246,0.2)',
                          color: '#3b82f6',
                          borderRadius: '3px',
                        }}>
                          @{user}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {selectedComment === comment.id && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveComment(comment.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      background: comment.resolved ? 'rgba(29,185,84,0.15)' : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      borderRadius: '4px',
                      color: comment.resolved ? '#1db954' : '#888',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {comment.resolved ? '✓ Resolved' : 'Resolve'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteComment(comment.id);
                    }}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(239,68,68,0.15)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#ef4444',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* New Comment Form */}
        {isAddingComment && newCommentPosition && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: '#0f0f0f',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#888' }}>
              Add Comment on {newCommentPosition.target === 'email' ? 'Email' : 'Page'}
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Type your comment... Use @ to tag team members"
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '10px',
                background: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                resize: 'vertical',
                marginBottom: '8px',
              }}
            />
            {commentText.includes('@') && (
              <div style={{
                background: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                marginBottom: '8px',
                maxHeight: '120px',
                overflowY: 'auto',
              }}>
                {teamMembers.map((member) => (
                  <div
                    key={member}
                    onClick={() => handleTagUser(member)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#383838'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    @{member}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: commentText.trim() ? '#1db954' : '#666',
                  border: 'none',
                  borderRadius: '6px',
                  color: commentText.trim() ? '#000' : '#ccc',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Add Comment
              </button>
              <button
                onClick={() => {
                  setNewCommentPosition(null);
                  setCommentText('');
                  setTaggedUsers([]);
                  setIsAddingComment(false);
                }}
                style={{
                  padding: '10px 16px',
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
        )}
      </div>

      {/* Right Side - Email & Page Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: activeView === 'split' ? 'row' : 'column', background: '#000' }}>
        {/* Email Preview */}
        {(activeView === 'split' || activeView === 'email') && (
          <div style={{ 
            flex: 1, 
            position: 'relative', 
            borderRight: activeView === 'split' ? '1px solid rgba(255,255,255,0.08)' : 'none' 
          }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(59,130,246,0.9)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              zIndex: 10,
            }}>
              📧 EMAIL
            </div>
            <div
              onClick={(e) => handleIframeClick(e, 'email')}
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                cursor: isAddingComment ? 'crosshair' : 'default',
              }}
            >
              {!emailLoaded && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#888',
                  fontSize: '14px',
                  textAlign: 'center',
                  zIndex: 10,
                }}>
                  <div style={{ marginBottom: '16px' }}>Loading email...</div>
                </div>
              )}
              
              <iframe
                src={email.emailUrl}
                onLoad={() => setEmailLoaded(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  pointerEvents: isAddingComment ? 'none' : 'auto',
                }}
              />

              {/* Email Comment Markers */}
              {emailComments.map((comment) => (
                <div
                  key={comment.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComment(comment.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${comment.x}%`,
                    top: `${comment.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: comment.type === 'qa-error' 
                      ? getSeverityColor(comment.severity)
                      : '#1db954',
                    border: selectedComment === comment.id ? '3px solid #fff' : '2px solid rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#000',
                    cursor: 'pointer',
                    zIndex: 5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {comment.authorInitials}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Preview */}
        {(activeView === 'split' || activeView === 'page') && email.linkedPages && email.linkedPages.length > 0 && (
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(251,191,36,0.9)',
              color: '#000',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              zIndex: 10,
            }}>
              🌐 LANDING PAGE
            </div>
            <div
              onClick={(e) => handleIframeClick(e, 'page')}
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                cursor: isAddingComment ? 'crosshair' : 'default',
              }}
            >
              {!pageLoaded && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#888',
                  fontSize: '14px',
                  textAlign: 'center',
                  zIndex: 10,
                }}>
                  <div style={{ marginBottom: '16px' }}>Loading page...</div>
                </div>
              )}
              
              <iframe
                src={email.linkedPages[0].url}
                onLoad={() => setPageLoaded(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  pointerEvents: isAddingComment ? 'none' : 'auto',
                }}
              />

              {/* Page Comment Markers */}
              {pageComments.map((comment) => (
                <div
                  key={comment.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComment(comment.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${comment.x}%`,
                    top: `${comment.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: comment.type === 'qa-error' 
                      ? getSeverityColor(comment.severity)
                      : '#1db954',
                    border: selectedComment === comment.id ? '3px solid #fff' : '2px solid rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#000',
                    cursor: 'pointer',
                    zIndex: 5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {comment.authorInitials}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

