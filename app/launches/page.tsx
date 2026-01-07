'use client';

import { useState } from 'react';
import LaunchDetailModal from '@/components/LaunchDetailModal';
import DateRangePicker from '@/components/DateRangePicker';
import Sparkline from '@/components/Sparkline';

interface Launch {
  id: string;
  name: string;
  product: string;
  emoji: string;
  launchDate: string;
  status: 'on-track' | 'delayed' | 'planning' | 'launched';
  progress: number;
  launchType: 'new-product' | 'reformulation' | 'new-flavor' | 'relaunch' | 'bundle';
}

const mockLaunches: Launch[] = [
  {
    id: '1',
    name: 'Sleep Support Launch',
    product: 'Sleep Support 30ct',
    emoji: '😴',
    launchDate: '2026-01-15',
    status: 'on-track',
    progress: 85,
    launchType: 'new-product',
  },
  {
    id: '2',
    name: 'Krill Oil Launch',
    product: 'Antarctic Krill Oil',
    emoji: '🦐',
    launchDate: '2026-02-01',
    status: 'planning',
    progress: 45,
    launchType: 'new-product',
  },
  {
    id: '3',
    name: 'Fiber Powder Launch',
    product: 'Fiber Powder 30srv',
    emoji: '🌾',
    launchDate: '2026-02-15',
    status: 'planning',
    progress: 30,
    launchType: 'new-flavor',
  },
  {
    id: '4',
    name: 'Probiotic 40B v3.0',
    product: 'Probiotic 40B Reformulated',
    emoji: '🦠',
    launchDate: '2026-01-22',
    status: 'on-track',
    progress: 90,
    launchType: 'reformulation',
  },
  {
    id: '5',
    name: 'Turmeric Bundle',
    product: 'Turmeric + Black Pepper Bundle',
    emoji: '🌿',
    launchDate: '2026-02-10',
    status: 'planning',
    progress: 40,
    launchType: 'bundle',
  },
];

export default function LaunchesPage() {
  const [timePeriod, setTimePeriod] = useState('month');
  const [selectedLaunch, setSelectedLaunch] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [launchCalendarMonth, setLaunchCalendarMonth] = useState(new Date(2026, 0, 1)); // January 2026
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [perfView, setPerfView] = useState<'aggregated' | 'by-channel' | 'by-product'>('aggregated');
  const [perfTimeFilter, setPerfTimeFilter] = useState('30d');
  const [perfCompareFilter, setPerfCompareFilter] = useState('last-week');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2025-12-01');
  const [customEndDate, setCustomEndDate] = useState('2026-01-06');

  const filteredLaunches = mockLaunches.filter((launch) =>
    launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    launch.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingCount = mockLaunches.filter(l => l.status !== 'launched').length;
  const inDevCount = mockLaunches.filter(l => l.status === 'planning').length;
  const launchedThisYear = 4;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const changeMonth = (delta: number) => {
    const newDate = new Date(launchCalendarMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setLaunchCalendarMonth(newDate);
  };

  const jumpToToday = () => {
    setLaunchCalendarMonth(new Date(2026, 0, 1)); // January 2026
  };

  // Generate calendar days
  const generateCalendar = () => {
    const year = launchCalendarMonth.getFullYear();
    const month = launchCalendarMonth.getMonth();
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

  const getLaunchTypeLabel = (type: Launch['launchType']) => {
    const types = {
      'new-product': { label: 'New Product', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
      'reformulation': { label: 'Reformulation', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
      'new-flavor': { label: 'New Flavor', color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
      'relaunch': { label: 'Relaunch', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
      'bundle': { label: 'Bundle', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    };
    return types[type];
  };

  const handleLaunchClick = (launch: Launch) => {
    const modalData = {
      id: launch.id,
      name: launch.name,
      icon: launch.emoji,
      sku: 'SKU-' + launch.id,
      type: 'New Product',
      status: launch.status,
      originalDate: launch.launchDate,
      currentDate: launch.launchDate,
      price: '$39.99',
      margin: '68%',
      inventory: '5,000 units',
      timeline: [
        { milestone: 'Formulation Complete', date: 'Dec 15, 2025', status: 'completed' as const },
        { milestone: 'Packaging Approved', date: 'Dec 28, 2025', status: 'completed' as const },
        { milestone: 'Production Run', date: 'Jan 5-12, 2026', status: 'in-progress' as const },
        { milestone: 'Launch', date: launch.launchDate, status: 'pending' as const },
      ],
      allocation: { retention: 60, acquisition: 40 },
      notes: `New ${launch.product} launching ${launch.launchDate}. Expected to drive significant customer interest.`,
    };
    setSelectedLaunch(modalData);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '48px 56px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div className="content-header" style={{ marginBottom: 0 }}>
          <h1 className="header-title">
            Launches
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '4px' }}>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                padding: '6px 16px',
                background: viewMode === 'calendar' ? 'rgba(29,185,84,0.2)' : 'transparent',
                border: viewMode === 'calendar' ? '1px solid rgba(29,185,84,0.4)' : '1px solid transparent',
                color: viewMode === 'calendar' ? '#1db954' : '#888',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              📅 Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 16px',
                background: viewMode === 'list' ? 'rgba(29,185,84,0.2)' : 'transparent',
                border: viewMode === 'list' ? '1px solid rgba(29,185,84,0.4)' : '1px solid transparent',
                color: viewMode === 'list' ? '#1db954' : '#888',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              📋 List
            </button>
          </div>

          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 500,
              outline: 'none'
            }}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Row - Green Theme */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          background: 'rgba(29, 185, 84, 0.08)',
          border: '1px solid rgba(29, 185, 84, 0.3)',
          padding: '20px',
          borderRadius: '6px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{upcomingCount}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Upcoming Launches</div>
        </div>
        <div style={{
          background: 'rgba(29, 185, 84, 0.08)',
          border: '1px solid rgba(29, 185, 84, 0.3)',
          padding: '20px',
          borderRadius: '6px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{inDevCount}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>In Development</div>
        </div>
        <div style={{
          background: 'rgba(29, 185, 84, 0.08)',
          border: '1px solid rgba(29, 185, 84, 0.3)',
          padding: '20px',
          borderRadius: '6px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>Jan 15</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Next Launch</div>
        </div>
        <div style={{
          background: 'rgba(29, 185, 84, 0.08)',
          border: '1px solid rgba(29, 185, 84, 0.3)',
          padding: '20px',
          borderRadius: '6px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{launchedThisYear}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Launched This Year</div>
          <Sparkline data={[2, 2, 3, 3, 4]} />
        </div>
      </div>

      {/* Launch Calendar - Only show in calendar view */}
      {viewMode === 'calendar' && (
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', 
        border: '1px solid rgba(255,255,255,0.06)', 
        borderRadius: '12px', 
        padding: '16px', 
        marginBottom: '32px' 
      }}>
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
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
              {monthNames[launchCalendarMonth.getMonth()]} {launchCalendarMonth.getFullYear()}
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
              <span style={{ color: '#b3b3b3' }}>On Track</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '8px', background: 'linear-gradient(90deg, #eab308, #a16207)', borderRadius: '4px' }}></div>
              <span style={{ color: '#b3b3b3' }}>Delayed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '8px', background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)', borderRadius: '4px' }}></div>
              <span style={{ color: '#b3b3b3' }}>Planning</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ borderRadius: '10px', overflow: 'auto', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'rgba(255,255,255,0.02)', minWidth: '600px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ padding: '12px 8px', textAlign: 'center', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {day}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minWidth: '600px' }}>
            {calendarDays.map((day, index) => {
              const dayLaunches = mockLaunches.filter(launch => {
                const launchDate = new Date(launch.launchDate);
                return !day.isOtherMonth && 
                       launchDate.getDate() === day.date && 
                       launchDate.getMonth() === launchCalendarMonth.getMonth() &&
                       launchDate.getFullYear() === launchCalendarMonth.getFullYear();
              });

              return (
                <div 
                  key={index}
                  className={`campaign-cal-day ${day.isOtherMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
                >
                  <div className="campaign-cal-date">
                    {day.date}
                  </div>
                  {dayLaunches.map((launch, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleLaunchClick(launch)}
                      className="campaign-bar"
                      style={{
                        background: launch.status === 'on-track' ? 'linear-gradient(90deg, #1db954, #15803d)' :
                                   launch.status === 'delayed' ? 'linear-gradient(90deg, #eab308, #a16207)' :
                                   'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                      }}
                      title={launch.name}
                    >
                      {launch.emoji} {launch.name}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Stats */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '12px', color: '#888' }}>
            <span style={{ color: '#1db954', fontWeight: '600' }}>{mockLaunches.filter(l => l.status !== 'launched').length}</span> launches this month
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            <span style={{ color: '#3b82f6', fontWeight: '600' }}>{mockLaunches.filter(l => l.status === 'planning').length}</span> in planning
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            <span style={{ color: '#1db954', fontWeight: '600' }}>{mockLaunches.filter(l => l.status === 'on-track').length}</span> on track
          </div>
        </div>
      </div>
      )}

      {/* List View - Only show in list mode */}
      {viewMode === 'list' && (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '14px', color: '#888', fontWeight: 600, letterSpacing: '0.5px' }}>
            ALL LAUNCHES
          </h3>
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search launches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                background: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '14px' }}>🔍</span>
          </div>
        </div>

        {/* Launches Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))', 
          gap: '16px' 
        }}>
          {filteredLaunches.map((launch) => (
            <div
              key={launch.id}
              onClick={() => handleLaunchClick(launch)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Launch Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '48px' }}>{launch.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{launch.name}</h4>
                    <span style={{
                      fontSize: '10px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      background: launch.status === 'on-track' ? 'rgba(29,185,84,0.15)' :
                        launch.status === 'delayed' ? 'rgba(234,179,8,0.15)' :
                          'rgba(59,130,246,0.15)',
                      color: launch.status === 'on-track' ? '#1db954' :
                        launch.status === 'delayed' ? '#eab308' :
                          '#3b82f6'
                    }}>
                      {launch.status === 'on-track' ? 'On Track' :
                        launch.status === 'delayed' ? 'Delayed' :
                          launch.status === 'planning' ? 'Planning' : 'Launched'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{launch.product}</div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '10px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      background: getLaunchTypeLabel(launch.launchType).bg,
                      color: getLaunchTypeLabel(launch.launchType).color,
                    }}>
                      {getLaunchTypeLabel(launch.launchType).label}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    Launch Date: <span style={{ color: '#1db954', fontWeight: 600 }}>
                      {new Date(launch.launchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '6px' }}>
                  <span>Progress</span>
                  <span style={{ fontWeight: 600, color: '#1db954' }}>{launch.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${launch.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #1db954, #15803d)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLaunches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
            No launches found matching your search.
          </div>
        )}
      </div>
      )}

      {/* Launch Performance Section */}
      <div style={{ marginTop: '48px' }}>
        {/* Top Row: Title and Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Launch Performance</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <select
                value={perfTimeFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setPerfTimeFilter(val);
                  if (val === 'custom') {
                    setShowDatePicker(true);
                  }
                }}
                style={{
                  padding: '7px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="30d">Last 30 Days</option>
                <option value="q4-2025">Q4 2025</option>
                <option value="q1-2026">Q1 2026</option>
                <option value="2025">Year 2025</option>
                <option value="custom">
                  {perfTimeFilter === 'custom' ? `${customStartDate} to ${customEndDate}` : 'Custom Range'}
                </option>
              </select>
              {showDatePicker && (
                <DateRangePicker
                  startDate={customStartDate}
                  endDate={customEndDate}
                  onApply={(start, end) => {
                    setCustomStartDate(start);
                    setCustomEndDate(end);
                  }}
                  onClose={() => setShowDatePicker(false)}
                />
              )}
            </div>
            <select
              value={perfCompareFilter}
              onChange={(e) => setPerfCompareFilter(e.target.value)}
              style={{
                padding: '7px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="target">vs Target</option>
              <option value="last-week">vs Last Week</option>
              <option value="last-month">vs Last Month</option>
              <option value="last-year">vs Last Year</option>
            </select>
            <button
              style={{
                padding: '7px 16px',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '6px',
                color: '#3b82f6',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)')}
            >
              📈 View Trends
            </button>
          </div>
        </div>

        {/* Bottom Row: View Switcher */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', width: 'fit-content', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPerfView('aggregated')}
            style={{
              padding: '8px 16px',
              background: perfView === 'aggregated' ? '#1db954' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: perfView === 'aggregated' ? '#000' : '#888',
              fontSize: '13px',
              fontWeight: perfView === 'aggregated' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Aggregated
          </button>
          <button
            onClick={() => setPerfView('by-channel')}
            style={{
              padding: '8px 16px',
              background: perfView === 'by-channel' ? '#1db954' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: perfView === 'by-channel' ? '#000' : '#888',
              fontSize: '13px',
              fontWeight: perfView === 'by-channel' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            By Channel
          </button>
          <button
            onClick={() => setPerfView('by-product')}
            style={{
              padding: '8px 16px',
              background: perfView === 'by-product' ? '#1db954' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: perfView === 'by-product' ? '#000' : '#888',
              fontSize: '13px',
              fontWeight: perfView === 'by-product' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            By Product
          </button>
        </div>

        {/* Aggregated View */}
        {perfView === 'aggregated' && (
          <div>
            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ background: '#0a0a0a', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1db954' }}>67%</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Avg Margin</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>3</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Products Launched</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1db954' }}>+18%</div>
                <div style={{ fontSize: '11px', color: '#666' }}>vs Target</div>
              </div>
              <div style={{ background: '#0a0a0a', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>2</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Top Performers</div>
              </div>
            </div>

            {/* Product Table */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#666', fontWeight: 600 }}>PRODUCT</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#666', fontWeight: 600 }}>LAUNCH DATE</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#666', fontWeight: 600 }}>PRICE</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#666', fontWeight: 600 }}>30-DAY SALES</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#666', fontWeight: 600 }}>UNITS</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#666', fontWeight: 600 }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontWeight: 600 }}>💪 Creatine Monohydrate</span></td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>Nov 15, 2025</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>$34.00</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#1db954' }}>$127,000</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>3,735</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ background: 'rgba(29,185,84,0.15)', color: '#1db954', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>Performing Well</span></td>
                  </tr>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontWeight: 600 }}>🥛 Colostrum</span></td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>Sep 20, 2025</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>$49.99</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#1db954' }}>$89,000</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>1,780</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ background: 'rgba(29,185,84,0.15)', color: '#1db954', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>Performing Well</span></td>
                  </tr>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontWeight: 600 }}>🧪 NAC</span></td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>Aug 10, 2025</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>$29.99</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#eab308' }}>$42,000</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>1,400</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>Needs Attention</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* By Channel View */}
        {perfView === 'by-channel' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#666', fontWeight: 600 }}>CHANNEL</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#666', fontWeight: 600 }}>REVENUE</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#666', fontWeight: 600 }}>% OF TOTAL</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#666', fontWeight: 600 }}>UNITS</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}><span style={{ fontWeight: 600 }}>Retention (DTC)</span></td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600, color: '#1db954' }}>$154,800</td>
                  <td style={{ padding: '16px', fontSize: '18px', textAlign: 'right', fontWeight: 700 }}>60%</td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>4,705</td>
                </tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}><span style={{ fontWeight: 600 }}>Acquisition</span></td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600, color: '#1db954' }}>$51,600</td>
                  <td style={{ padding: '16px', fontSize: '18px', textAlign: 'right', fontWeight: 700 }}>20%</td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>1,568</td>
                </tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}><span style={{ fontWeight: 600 }}>Amazon</span></td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>$25,800</td>
                  <td style={{ padding: '16px', fontSize: '18px', textAlign: 'right', fontWeight: 700 }}>10%</td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>784</td>
                </tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}><span style={{ fontWeight: 600 }}>Walmart</span></td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>$12,900</td>
                  <td style={{ padding: '16px', fontSize: '18px', textAlign: 'right', fontWeight: 700 }}>5%</td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>392</td>
                </tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}><span style={{ fontWeight: 600 }}>TikTok Shop</span></td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>$7,740</td>
                  <td style={{ padding: '16px', fontSize: '18px', textAlign: 'right', fontWeight: 700 }}>3%</td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>245</td>
                </tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}><span style={{ fontWeight: 600 }}>Wholesale</span></td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>$5,160</td>
                  <td style={{ padding: '16px', fontSize: '18px', textAlign: 'right', fontWeight: 700 }}>2%</td>
                  <td style={{ padding: '16px', fontSize: '15px', textAlign: 'right', fontWeight: 600 }}>148</td>
                </tr>
                <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '16px' }}><span style={{ fontWeight: 700 }}>Total</span></td>
                  <td style={{ padding: '16px', fontSize: '16px', textAlign: 'right', fontWeight: 700, color: '#1db954' }}>$258,000</td>
                  <td style={{ padding: '16px', fontSize: '18px', textAlign: 'right', fontWeight: 700 }}>100%</td>
                  <td style={{ padding: '16px', fontSize: '16px', textAlign: 'right', fontWeight: 700 }}>7,842</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* By Product View */}
        {perfView === 'by-product' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#666', fontWeight: 600 }}>PRODUCT</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#666', fontWeight: 600 }}>RETENTION</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#666', fontWeight: 600 }}>ACQUISITION</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#666', fontWeight: 600 }}>AMAZON</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#666', fontWeight: 600 }}>OTHER</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#666', fontWeight: 600 }}>TOTAL</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', color: '#666', fontWeight: 600 }}>UNITS</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', color: '#666', fontWeight: 600 }}>VS TARGET</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600 }}>💪 Creatine Monohydrate</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Nov 15, 2025 • $34.00</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right' }}>$76.2K</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right' }}>$25.4K</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right' }}>$12.7K</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right', color: '#888' }}>$12.7K</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', textAlign: 'right', fontWeight: 700, color: '#1db954' }}>$127K</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', textAlign: 'right', fontWeight: 600 }}>3,735</td>
                  <td style={{ padding: '14px 16px' }}><span style={{ color: '#1db954', fontWeight: 600 }}>+27%</span></td>
                </tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600 }}>🥛 Colostrum</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Sep 20, 2025 • $49.99</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right' }}>$53.4K</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right' }}>$17.8K</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right' }}>$8.9K</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right', color: '#888' }}>$8.9K</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', textAlign: 'right', fontWeight: 700, color: '#1db954' }}>$89K</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', textAlign: 'right', fontWeight: 600 }}>1,780</td>
                  <td style={{ padding: '14px 16px' }}><span style={{ color: '#1db954', fontWeight: 600 }}>+12%</span></td>
                </tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600 }}>🧪 NAC</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Aug 10, 2025 • $29.99</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right' }}>$25.2K</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right' }}>$8.4K</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right' }}>$4.2K</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'right', color: '#888' }}>$4.2K</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', textAlign: 'right', fontWeight: 700, color: '#eab308' }}>$42K</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', textAlign: 'right', fontWeight: 600 }}>1,400</td>
                  <td style={{ padding: '14px 16px' }}><span style={{ color: '#ef4444', fontWeight: 600 }}>-16%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Launch Detail Modal */}
      <LaunchDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        launch={selectedLaunch}
      />
    </div>
  );
}

