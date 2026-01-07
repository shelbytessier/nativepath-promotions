'use client';

import { useState } from 'react';
import type { Channel, Promotion } from '@/types';
import SearchableMultiSelect from './SearchableMultiSelect';

interface ChannelPlan {
  channelId: string;
  angle: string;
  promotionIds: string[];
  notes?: string;
}

interface ChannelPlanEditorProps {
  channelPlans: ChannelPlan[];
  channels: Channel[];
  promotions: Promotion[];
  onChange: (plans: ChannelPlan[]) => void;
}

export default function ChannelPlanEditor({
  channelPlans,
  channels,
  promotions,
  onChange,
}: ChannelPlanEditorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ChannelPlan>({
    channelId: '',
    angle: '',
    promotionIds: [],
    notes: '',
  });

  const handleAdd = () => {
    if (!formData.channelId || !formData.angle) {
      return;
    }

    if (editingIndex !== null) {
      const updated = [...channelPlans];
      updated[editingIndex] = formData;
      onChange(updated);
      setEditingIndex(null);
    } else {
      onChange([...channelPlans, formData]);
    }

    setFormData({ channelId: '', angle: '', promotionIds: [], notes: '' });
    setShowAddForm(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(channelPlans[index]);
    setShowAddForm(true);
  };

  const handleRemove = (index: number) => {
    onChange(channelPlans.filter((_, i) => i !== index));
  };

  const availableChannels = channels.filter(
    (c) => !channelPlans.some((p) => p.channelId === c.id) || editingIndex !== null
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-white mb-2">
          Channel Plans & Angles
        </label>
        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setEditingIndex(null);
            setFormData({ channelId: '', angle: '', promotionIds: [], notes: '' });
          }}
          className="px-3 py-1 text-xs bg-np-blue-600 hover:bg-np-blue-500 text-white rounded-full transition-all"
          disabled={availableChannels.length === 0}
        >
          + Add Channel Plan
        </button>
      </div>

      {/* Existing Plans */}
      {channelPlans.length > 0 && (
        <div className="space-y-2">
          {channelPlans.map((plan, index) => {
            const channel = channels.find((c) => c.id === plan.channelId);
            return (
              <div
                key={index}
                className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">
                      {channel?.name || 'Unknown Channel'}
                    </div>
                    <div className="text-sm text-[#b3b3b3] mb-2">
                      <strong>Angle:</strong> {plan.angle}
                    </div>
                    {plan.promotionIds.length > 0 && (
                      <div className="text-xs text-[#b3b3b3] mb-1">
                        <strong>Promotions:</strong>{' '}
                        {plan.promotionIds
                          .map((id) => {
                            const promo = promotions.find((p) => p.id === id);
                            return promo?.name || id;
                          })
                          .join(', ')}
                      </div>
                    )}
                    {plan.notes && (
                      <div className="text-xs text-[#6b6b6b] italic">{plan.notes}</div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(index)}
                      className="text-xs px-2 py-1 text-np-blue-400 hover:bg-np-blue-600 hover:bg-opacity-20 rounded transition-all"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="text-xs px-2 py-1 text-[#e22134] hover:bg-[#e22134] hover:bg-opacity-20 rounded transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg space-y-3">
          <h5 className="text-sm font-semibold text-white">
            {editingIndex !== null ? 'Edit' : 'Add'} Channel Plan
          </h5>

          <div>
            <label className="block text-xs font-medium text-white mb-1">
              Channel <span className="text-[#e22134]">*</span>
            </label>
            <select
              value={formData.channelId}
              onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
              className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
              disabled={editingIndex !== null}
            >
              <option value="">Select channel...</option>
              {availableChannels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1">
              Marketing Angle <span className="text-[#e22134]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.angle}
              onChange={(e) => setFormData({ ...formData, angle: e.target.value })}
              placeholder="e.g., Focus on wellness and self-care"
              className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1">
              Promotions to Run
            </label>
            <SearchableMultiSelect
              label="Promotions to Run"
              placeholder="Select promotions for this channel..."
              options={promotions.map((p) => ({
                id: p.id,
                label: p.name,
                subtitle: `${p.discountType === 'percentage' ? `${p.discountValue}% off` : `$${p.discountValue} off`}`,
              }))}
              selectedIds={formData.promotionIds}
              onChange={(ids) => setFormData({ ...formData, promotionIds: ids })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Channel-specific notes..."
              className="w-full px-3 py-2 bg-[#121212] border border-[#2a2a2a] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 bg-np-blue-600 hover:bg-np-blue-500 text-white rounded-lg text-sm font-semibold transition-all"
            >
              {editingIndex !== null ? 'Update' : 'Add'} Plan
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingIndex(null);
                setFormData({ channelId: '', angle: '', promotionIds: [], notes: '' });
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

