'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Comment {
  id: string;
  x: number; // Position on page (percentage)
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

const mockPages: any = {
  'qa-1': {
    id: 'qa-1',
    pageUrl: 'health.nativepath.com/7-reasons-everyone-should-be-taking-this-protein-1107-fb-v8',
    pageName: "7 Reasons Collagen LP (Facebook)",
    product: 'Collagen 25s',
    campaign: 'VDAY-26',
    channel: 'Web',
  }
};

export default function PageReviewPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const page = mockPages[pageId];

  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentPosition, setNewCommentPosition] = useState<{ x: number; y: number } | null>(null);
  const [commentText, setCommentText] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isRunningQA, setIsRunningQA] = useState(false);

  useEffect(() => {
    // Load any existing comments from localStorage
    const savedComments = localStorage.getItem(`page-comments-${pageId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [pageId]);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem(`page-comments-${pageId}`, JSON.stringify(newComments));
  };

  const handleIframeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingComment) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewCommentPosition({ x, y });
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
      // Fetch and analyze the page
      const response = await fetch('/api/scrape-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `https://${page.pageUrl}` })
      });

      const result = await response.json();

      if (result.success) {
        // Create QA error comments at random positions (in real implementation, would be based on actual element positions)
        const qaComments: Comment[] = [];

        // Example QA issues
        if (result.data.metaDescription && result.data.metaDescription.length > 160) {
          qaComments.push({
            id: `qa-${Date.now()}-1`,
            x: 50,
            y: 5,
            author: 'QA System',
            authorInitials: 'QA',
            text: `Meta description too long: ${result.data.metaDescription.length} characters (recommended: 150-160)`,
            taggedUsers: [],
            timestamp: new Date().toLocaleString(),
            resolved: false,
            type: 'qa-error',
            severity: 'warning',
            category: 'SEO',
          });
        }

        if (result.data.h1Tags.length > 1) {
          qaComments.push({
            id: `qa-${Date.now()}-2`,
            x: 50,
            y: 15,
            author: 'QA System',
            authorInitials: 'QA',
            text: `Multiple H1 tags found (${result.data.h1Tags.length}). Should only have one.`,
            taggedUsers: [],
            timestamp: new Date().toLocaleString(),
            resolved: false,
            type: 'qa-error',
            severity: 'warning',
            category: 'SEO',
          });
        }

        const imagesWithoutAlt = result.data.images.filter((img: any) => !img.hasAlt);
        if (imagesWithoutAlt.length > 0) {
          qaComments.push({
            id: `qa-${Date.now()}-3`,
            x: 50,
            y: 40,
            author: 'QA System',
            authorInitials: 'QA',
            text: `${imagesWithoutAlt.length} image(s) missing alt text`,
            taggedUsers: [],
            timestamp: new Date().toLocaleString(),
            resolved: false,
            type: 'qa-error',
            severity: 'warning',
            category: 'Accessibility',
          });
        }

        // Add QA comments to existing comments
        saveComments([...comments, ...qaComments]);
        alert(`✅ QA Complete! Found ${qaComments.length} issues.`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
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

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#888';
    }
  };

  if (!page) {
    return (
      <div style={{ padding: '48px 56px' }}>
        <h1>Page not found</h1>
        <Link href="/page-qa">← Back to Page QA</Link>
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
          <Link href="/page-qa" style={{ textDecoration: 'none', color: '#888', fontSize: '13px', marginBottom: '12px', display: 'inline-block' }}>
            ← Back to Page QA
          </Link>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{page.pageName}</h2>
          <div style={{ fontSize: '12px', color: '#3b82f6' }}>{page.pageUrl}</div>
        </div>

        {/* Actions */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleRunQA}
            disabled={isRunningQA}
            style={{
              padding: '10px 16px',
              background: isRunningQA ? '#666' : '#1db954',
              border: 'none',
              borderRadius: '6px',
              color: isRunningQA ? '#ccc' : '#000',
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
              background: isAddingComment ? 'rgba(29,185,84,0.2)' : 'rgba(255,255,255,0.1)',
              border: isAddingComment ? '1px solid #1db954' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: isAddingComment ? '#1db954' : '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {isAddingComment ? '✓ Click Page to Add Comment' : '💬 Add Comment'}
          </button>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#b3b3b3', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#1db954' }}
            />
            Show Resolved ({comments.filter(c => c.resolved).length})
          </label>
        </div>

        {/* Comments List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '12px', fontWeight: '600' }}>
            {visibleComments.length} COMMENT{visibleComments.length !== 1 ? 'S' : ''}
          </div>
          
          {visibleComments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
              <div style={{ fontSize: '13px' }}>No comments yet</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {isAddingComment ? 'Click on the page to add one' : 'Click "Add Comment" to get started'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {visibleComments.map((comment) => (
                <div
                  key={comment.id}
                  onClick={() => setSelectedComment(comment.id)}
                  style={{
                    background: selectedComment === comment.id ? 'rgba(29,185,84,0.1)' : '#0f0f0f',
                    border: `1px solid ${selectedComment === comment.id ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    opacity: comment.resolved ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: comment.type === 'qa-error' ? '#f59e0b' : '#1db954',
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
                        {comment.type === 'qa-error' && comment.category && (
                          <span style={{ 
                            marginLeft: '8px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            background: `${getSeverityColor(comment.severity)}20`,
                            color: getSeverityColor(comment.severity),
                          }}>
                            {comment.category}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '13px', color: '#b3b3b3', marginBottom: '6px' }}>
                        {comment.text}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        {comment.timestamp}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolveComment(comment.id);
                      }}
                      style={{
                        padding: '4px 10px',
                        background: comment.resolved ? 'rgba(29,185,84,0.2)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
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
                        padding: '4px 10px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        {newCommentPosition && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: '#0f0f0f',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>
              Add Comment
            </div>
            
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Describe the issue..."
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
                marginBottom: '8px',
              }}
            />

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
                @ Tag
              </button>
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
                onClick={handleAddComment}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#1db954',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#000',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
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

      {/* Right Side - Page Preview with Markers */}
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        {/* Iframe Container */}
        <div
          onClick={handleIframeClick}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            cursor: isAddingComment ? 'crosshair' : 'default',
          }}
        >
          {!iframeLoaded && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#888',
              fontSize: '14px',
            }}>
              Loading page...
            </div>
          )}
          
          <iframe
            src={`https://${page.pageUrl}`}
            onLoad={() => setIframeLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: isAddingComment ? 'none' : 'auto',
            }}
          />

          {/* Comment Markers */}
          {visibleComments.map((comment) => (
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#fff',
                zIndex: selectedComment === comment.id ? 1000 : 100,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              {comment.type === 'qa-error' ? '!' : '💬'}
            </div>
          ))}

          {/* New Comment Position Marker */}
          {newCommentPosition && (
            <div
              style={{
                position: 'absolute',
                left: `${newCommentPosition.x}%`,
                top: `${newCommentPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#1db954',
                border: '3px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#fff',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                animation: 'pulse 1s infinite',
              }}
            >
              +
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

