'use client';

import { useState } from 'react';
import CampaignDetailModal from '@/components/CampaignDetailModal';

export default function CampaignsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // January 2026
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const campaigns = [
    {
      id: 'valentines',
      emoji: '💝',
      code: 'VDAY-26',
      codeColor: '#ec4899',
      name: "Valentine's Day 2026",
      dates: 'Jan 25 - Feb 14, 2026',
      offers: 3,
      pages: 12,
      daysLeft: 9,
      status: 'active',
      statusLabel: '● Live'
    },
    {
      id: 'evergreen',
      emoji: '🌲',
      code: 'EVRGN',
      codeColor: '#1db954',
      name: 'Evergreen',
      dates: 'Always active • Base pricing',
      offers: 5,
      pages: 28,
      daysLeft: '∞',
      status: 'active',
      statusLabel: '● Active'
    },
    {
      id: 'spring',
      emoji: '🌸',
      code: 'SPRNG-26',
      codeColor: '#f59e0b',
      name: 'Spring Renewal',
      dates: 'Mar 1 - Mar 20, 2026',
      offers: 4,
      pages: 0,
      daysLeft: 54,
      status: 'upcoming',
      statusLabel: 'Upcoming'
    },
    {
      id: 'summer',
      emoji: '☀️',
      code: 'SUMR-26',
      codeColor: '#3b82f6',
      name: 'Summer Wellness',
      dates: 'Jun 1 - Jun 21, 2026',
      offers: 0,
      pages: 0,
      daysLeft: 146,
      status: 'planning',
      statusLabel: 'Planning'
    }
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentMonth(newDate);
  };

  const jumpToToday = () => {
    setCurrentMonth(new Date(2026, 0, 1)); // January 2026
  };

  // Generate calendar days
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonthDays - i, isOtherMonth: true, isToday: false });
    }

    // Current month days
    const today = new Date(2026, 0, 6); // Jan 6, 2026
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = year === today.getFullYear() && month === today.getMonth() && i === today.getDate();
      days.push({ date: i, isOtherMonth: false, isToday });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: i, isOtherMonth: true, isToday: false });
    }

    return days;
  };

  const calendarDays = generateCalendar();

  const handleCampaignClick = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="content-header">
        <h1 className="header-title">Campaigns</h1>
        <p className="header-subtitle">Campaign calendar & timeline</p>
      </div>

      <div className="content-body">
        {/* Campaign Calendar */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', 
          border: '1px solid rgba(255,255,255,0.06)', 
          borderRadius: '12px', 
          padding: '24px', 
          marginBottom: '32px' 
        }}>
          {/* Calendar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => changeMonth(-1)}
                style={{ 
                  background: 'rgba(255,255,255,0.06)', 
                  border: 'none', 
                  color: '#fff', 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontSize: '16px', 
                  transition: 'all 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                ←
              </button>
              <span style={{ fontSize: '20px', fontWeight: '700', minWidth: '180px', textAlign: 'center' }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button 
                onClick={() => changeMonth(1)}
                style={{ 
                  background: 'rgba(255,255,255,0.06)', 
                  border: 'none', 
                  color: '#fff', 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontSize: '16px', 
                  transition: 'all 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                →
              </button>
              <button 
                onClick={jumpToToday}
                style={{ 
                  background: 'rgba(29, 185, 84, 0.15)', 
                  border: '1px solid rgba(29, 185, 84, 0.3)', 
                  color: '#1db954', 
                  padding: '8px 16px', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  transition: 'all 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(29, 185, 84, 0.25)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(29, 185, 84, 0.15)'}
              >
                Today
              </button>
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '8px', background: 'linear-gradient(90deg, #1db954, #15803d)', borderRadius: '4px' }}></div>
                <span style={{ color: '#b3b3b3' }}>Live</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '8px', background: 'linear-gradient(90deg, #eab308, #a16207)', borderRadius: '4px' }}></div>
                <span style={{ color: '#b3b3b3' }}>Prep</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '8px', background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)', borderRadius: '4px' }}></div>
                <span style={{ color: '#b3b3b3' }}>Upcoming</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'rgba(255,255,255,0.02)' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ padding: '14px', textAlign: 'center', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {day}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {calendarDays.map((day, index) => (
                <div 
                  key={index}
                  className={`campaign-cal-day ${day.isOtherMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
                >
                  <div className="campaign-cal-date">{day.date}</div>
                  {/* Show campaign bars on specific dates */}
                  {!day.isOtherMonth && day.date >= 25 && day.date <= 31 && currentMonth.getMonth() === 0 && (
                    <div className="campaign-bar prep" title="Valentine's Day Prep">VDAY-26</div>
                  )}
                  {!day.isOtherMonth && day.date >= 1 && day.date <= 14 && currentMonth.getMonth() === 1 && (
                    <div className="campaign-bar live" title="Valentine's Day Live">VDAY-26</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Stats */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: '12px', color: '#888' }}>
              <span style={{ color: '#1db954', fontWeight: '600' }}>1</span> campaign live this month
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              <span style={{ color: '#eab308', fontWeight: '600' }}>12</span> prep days
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              <span style={{ color: '#3b82f6', fontWeight: '600' }}>7</span> live days
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#888', marginBottom: '16px', letterSpacing: '0.5px' }}>CAMPAIGNS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {campaigns.map(campaign => (
            <div 
              key={campaign.id} 
              className={`campaign-row ${campaign.status}`}
              onClick={() => handleCampaignClick(campaign)}
            >
              <div className="campaign-row-icon">{campaign.emoji}</div>
              <div className="campaign-row-info">
                <div className="campaign-row-name">
                  <span style={{ 
                    fontFamily: 'monospace', 
                    color: campaign.codeColor, 
                    background: `${campaign.codeColor}26`, 
                    padding: '2px 6px', 
                    borderRadius: '3px', 
                    fontSize: '10px', 
                    marginRight: '8px' 
                  }}>
                    {campaign.code}
                  </span>
                  {campaign.name}
                </div>
                <div className="campaign-row-dates">{campaign.dates}</div>
              </div>
              <div className="campaign-row-stats">
                <div className="campaign-stat">
                  <span className="campaign-stat-val">{campaign.offers}</span>
                  <span className="campaign-stat-lbl">Offers</span>
                </div>
                <div className="campaign-stat">
                  <span className="campaign-stat-val">{campaign.pages}</span>
                  <span className="campaign-stat-lbl">Pages</span>
                </div>
                <div className="campaign-stat">
                  <span className={`campaign-stat-val ${typeof campaign.daysLeft === 'number' && campaign.daysLeft < 30 ? 'green' : ''}`}>
                    {campaign.daysLeft}
                  </span>
                  <span className="campaign-stat-lbl">{typeof campaign.daysLeft === 'number' ? 'Days Left' : 'Ongoing'}</span>
                </div>
              </div>
              <div className={`campaign-row-status ${campaign.status}`}>{campaign.statusLabel}</div>
            </div>
          ))}
        </div>

        {/* Campaign Detail Modal */}
        <CampaignDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          campaign={selectedCampaign}
        />
      </div>
    </div>
  );
}
