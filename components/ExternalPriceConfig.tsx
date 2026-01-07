'use client';

import { useState } from 'react';
import type { ExternalPrice } from '@/types';

interface ExternalPriceConfigProps {
  externalPrices: ExternalPrice[];
  onChange: (prices: ExternalPrice[]) => void;
}

export default function ExternalPriceConfig({ externalPrices, onChange }: ExternalPriceConfigProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    channel: 'amazon' as 'amazon' | 'website' | 'landing-page',
    url: '',
    asin: '',
  });

  const handleAdd = () => {
    if ((formData.channel === 'amazon' && !formData.asin) || 
        ((formData.channel === 'website' || formData.channel === 'landing-page') && !formData.url)) {
      return;
    }

    const newPrice: ExternalPrice = {
      channel: formData.channel,
      url: formData.url || undefined,
      asin: formData.asin || undefined,
      isMatch: false,
    };

    onChange([...externalPrices, newPrice]);
    setFormData({ channel: 'amazon', url: '', asin: '' });
    setShowAddForm(false);
  };

  const handleRemove = (index: number) => {
    onChange(externalPrices.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-white mb-2">
          External Price Sources (Amazon, Website, Landing Pages)
        </label>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="px-3 py-1 text-xs bg-np-blue-600 hover:bg-np-blue-500 text-white rounded-full transition-all"
        >
          + Add Source
        </button>
      </div>

      {/* Existing Sources */}
      {externalPrices.length > 0 && (
        <div className="space-y-2">
          {externalPrices.map((ep, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white uppercase">
                    {ep.channel === 'amazon' ? '🛒 Amazon' : ep.channel === 'website' ? '🌐 Website' : '📄 Landing Page'}
                  </span>
                  {ep.asin && (
                    <span className="text-xs text-[#b3b3b3]">ASIN: {ep.asin}</span>
                  )}
                  {ep.url && (
                    <span className="text-xs text-[#b3b3b3] truncate max-w-xs">{ep.url}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-xs px-2 py-1 text-[#e22134] hover:bg-[#e22134] hover:bg-opacity-10 rounded transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg space-y-3">
          <div>
            <label className="block text-xs font-medium text-white mb-1">
              Source Type
            </label>
            <select
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value as any, url: '', asin: '' })}
              className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
            >
              <option value="amazon">Amazon</option>
              <option value="website">Website</option>
              <option value="landing-page">Landing Page</option>
            </select>
          </div>

          {formData.channel === 'amazon' ? (
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Amazon ASIN <span className="text-[#e22134]">*</span>
              </label>
              <input
                type="text"
                value={formData.asin}
                onChange={(e) => setFormData({ ...formData, asin: e.target.value })}
                placeholder="B08XYZ1234"
                className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                URL <span className="text-[#e22134]">*</span>
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/product"
                className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 bg-np-blue-600 hover:bg-np-blue-500 text-white rounded-lg text-sm font-semibold transition-all"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setFormData({ channel: 'amazon', url: '', asin: '' });
              }}
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




