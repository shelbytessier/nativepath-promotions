'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password);

    if (result.success && result.user) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '32px' 
    }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ 
          background: '#181818', 
          borderRadius: '16px', 
          border: '1px solid rgba(255,255,255,0.1)', 
          padding: '48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <Image
                src="/nativepath-logo.svg"
                alt="NativePath"
                width={200}
                height={41}
                style={{ height: '40px', width: 'auto' }}
                priority
              />
            </div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#fff', 
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              NativePath
            </h1>
            <p style={{ color: '#888', fontSize: '14px' }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <div style={{ 
                background: 'rgba(239,68,68,0.15)', 
                border: '1px solid rgba(239,68,68,0.3)', 
                color: '#ef4444', 
                padding: '12px 16px', 
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#fff', 
                marginBottom: '8px' 
              }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  background: '#0a0a0a', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#fff', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="you@nativepath.com"
                onFocus={(e) => e.target.style.borderColor = '#1db954'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ 
                display: 'block', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#fff', 
                marginBottom: '8px' 
              }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  background: '#0a0a0a', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#fff', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="Enter your password"
                onFocus={(e) => e.target.style.borderColor = '#1db954'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '14px 24px', 
                background: loading ? '#666' : '#1db954', 
                color: '#000', 
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#1ed760';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(29,185,84,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#1db954';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ 
            marginTop: '32px', 
            paddingTop: '24px', 
            borderTop: '1px solid rgba(255,255,255,0.1)' 
          }}>
            <p style={{ 
              fontSize: '13px', 
              color: '#888', 
              textAlign: 'center', 
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Demo Accounts:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ 
                padding: '10px 14px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <strong style={{ color: '#1db954', marginRight: '8px' }}>Admin:</strong>
                <span style={{ color: '#b3b3b3' }}>admin@nativepath.com / admin123</span>
              </div>
              <div style={{ 
                padding: '10px 14px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <strong style={{ color: '#3b82f6', marginRight: '8px' }}>User:</strong>
                <span style={{ color: '#b3b3b3' }}>user@nativepath.com / user123</span>
              </div>
              <div style={{ 
                padding: '10px 14px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <strong style={{ color: '#888', marginRight: '8px' }}>Viewer:</strong>
                <span style={{ color: '#b3b3b3' }}>viewer@nativepath.com / viewer123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

