'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser, initializeUsers } from '@/lib/auth';
import type { User } from '@/types/auth';

const mainNavItems = [
  { href: '/', label: 'Dashboard', emoji: '📊' },
  { href: '/products', label: 'Products', emoji: '📦' },
  { href: '/offers', label: 'Offers', emoji: '🏷️' },
];

const campaignHubItems = [
  { href: '/promotions', label: 'Campaigns', emoji: '📅' },
  { href: '/launches', label: 'Launches', emoji: '🚀' },
  { href: '/calendar', label: 'Page Manager', emoji: '📄' },
  { href: '/testing', label: 'Testing', emoji: '🧪' },
];

const toolsItems = [
  { href: '/page-qa', label: 'Page QA', emoji: '✅' },
  { href: '/margin-calc', label: 'Margin Calc', emoji: '🧮' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeUsers();
    setUser(getCurrentUser());
  }, [pathname]);

  // Don't show sidebar on login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0
          }}>
            🌿
          </div>
          <span className="logo-text">NativePath</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/products' && pathname?.startsWith('/products')) ||
            (item.href === '/offers' && pathname?.startsWith('/offers'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Campaign Hub Section */}
      <div className="sidebar-section">
        <div className="section-title">CAMPAIGN HUB</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {campaignHubItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/promotions' && pathname?.startsWith('/promotions')) ||
              (item.href === '/launches' && pathname?.startsWith('/launches')) ||
              (item.href === '/calendar' && pathname?.startsWith('/calendar')) ||
              (item.href === '/testing' && pathname?.startsWith('/testing'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tools Section */}
      <div className="sidebar-section">
        <div className="section-title">TOOLS</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {toolsItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
