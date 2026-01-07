'use client';

import { useState, useRef, useEffect } from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onApply: (start: string, end: string) => void;
  onClose: () => void;
}

export default function DateRangePicker({ startDate, endDate, onApply, onClose }: DateRangePickerProps) {
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleApply = () => {
    onApply(tempStartDate, tempEndDate);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '8px',
        background: '#282828',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '20px',
        zIndex: 1000,
        minWidth: '320px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#fff' }}>
        Select Date Range
      </div>

      {/* Start Date */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '6px' }}>
          START DATE
        </label>
        <input
          type="date"
          value={tempStartDate}
          onChange={(e) => setTempStartDate(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none'
          }}
        />
      </div>

      {/* End Date */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '6px' }}>
          END DATE
        </label>
        <input
          type="date"
          value={tempEndDate}
          onChange={(e) => setTempEndDate(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none'
          }}
        />
      </div>

      {/* Quick Presets */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '8px', 
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <button
          onClick={() => {
            const today = new Date();
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 7);
            setTempStartDate(lastWeek.toISOString().split('T')[0]);
            setTempEndDate(today.toISOString().split('T')[0]);
          }}
          style={{
            padding: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: '#b3b3b3',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#b3b3b3';
          }}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const lastMonth = new Date(today);
            lastMonth.setDate(today.getDate() - 30);
            setTempStartDate(lastMonth.toISOString().split('T')[0]);
            setTempEndDate(today.toISOString().split('T')[0]);
          }}
          style={{
            padding: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: '#b3b3b3',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#b3b3b3';
          }}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const lastQuarter = new Date(today);
            lastQuarter.setDate(today.getDate() - 90);
            setTempStartDate(lastQuarter.toISOString().split('T')[0]);
            setTempEndDate(today.toISOString().split('T')[0]);
          }}
          style={{
            padding: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: '#b3b3b3',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#b3b3b3';
          }}
        >
          Last 90 Days
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const lastYear = new Date(today);
            lastYear.setFullYear(today.getFullYear() - 1);
            setTempStartDate(lastYear.toISOString().split('T')[0]);
            setTempEndDate(today.toISOString().split('T')[0]);
          }}
          style={{
            padding: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: '#b3b3b3',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#b3b3b3';
          }}
        >
          Last Year
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: '#b3b3b3',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          style={{
            flex: 1,
            padding: '10px',
            background: '#1db954',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}


