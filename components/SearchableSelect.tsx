'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
}

export default function SearchableSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select...',
  label 
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', minWidth: '140px' }}>
      {label && (
        <label style={{ fontSize: '11px', color: '#b3b3b3', display: 'block', marginBottom: '4px' }}>
          {label}
        </label>
      )}
      
      {/* Selected Value Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '10px 12px',
          background: '#282828',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '13px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <span style={{ fontSize: '10px', color: '#666' }}>▼</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: '#282828',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px',
          zIndex: 1000,
          maxHeight: '300px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        }}>
          {/* Search Input */}
          <div style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              autoFocus
              style={{
                width: '100%',
                padding: '6px 8px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          {/* Options List */}
          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: option.value === value ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
                    color: option.value === value ? '#1db954' : '#fff',
                    fontSize: '13px',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (option.value !== value) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (option.value !== value) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {option.value === value && <span style={{ marginRight: '8px' }}>✓</span>}
                  {option.label}
                </div>
              ))
            ) : (
              <div style={{ padding: '10px 12px', color: '#666', fontSize: '12px', textAlign: 'center' }}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

