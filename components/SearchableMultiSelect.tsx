'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  id: string;
  label: string;
  subtitle?: string;
}

interface SearchableMultiSelectProps {
  options: Option[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  label: string;
  required?: boolean;
}

export default function SearchableMultiSelect({
  options,
  selectedIds,
  onChange,
  placeholder = 'Search and select...',
  label,
  required = false,
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

  const toggleOption = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter((id) => id !== optionId));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };

  const removeOption = (optionId: string) => {
    onChange(selectedIds.filter((id) => id !== optionId));
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-semibold text-txt-secondary mb-2">
        {label} {required && <span className="text-ui-red-600">*</span>}
      </label>
      
      {/* Selected Items Display */}
      {selectedOptions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-np-blue-100 text-np-blue-800 rounded-lg text-sm font-medium"
            >
              {option.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option.id);
                }}
                className="hover:text-np-blue-900 focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus-within:ring-2 focus-within:ring-np-blue-500 focus-within:border-transparent cursor-pointer bg-white hover:border-np-blue-300 transition-all"
      >
        <div className="flex items-center justify-between">
          <span className={selectedIds.length === 0 ? 'text-txt-tertiary' : 'text-txt-secondary'}>
            {selectedIds.length === 0 ? placeholder : `${selectedIds.length} selected`}
          </span>
          <svg
            className={`w-5 h-5 text-txt-tertiary transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-border-subtle rounded-xl shadow-2xl max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-border-subtle sticky top-0 bg-white">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                e.stopPropagation();
                setSearchTerm(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-np-blue-500"
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-txt-tertiary text-sm">No products found</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.id);
                    }}
                    className={`px-4 py-3 cursor-pointer hover:bg-bg-subtle transition-colors border-b border-border-subtle last:border-0 ${
                      isSelected ? 'bg-np-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded border-border-default text-np-blue-600 focus:ring-np-blue-500"
                          />
                          <span className="font-medium text-txt-secondary">{option.label}</span>
                        </div>
                        {option.subtitle && (
                          <div className="ml-6 text-sm text-txt-tertiary">{option.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}





