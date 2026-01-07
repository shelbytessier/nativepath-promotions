'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getData, addPromotion, updatePromotion, getPromotion } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import type { AppData, Product, Channel, Promotion } from '@/types';
import SearchableMultiSelect from '@/components/SearchableMultiSelect';

export default function RequestPromotionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promotionId = searchParams.get('id'); // For editing drafts
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  
  const [data, setData] = useState<AppData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reason: '',
    startDate: '',
    endDate: '',
    productIds: [] as string[],
    channelIds: [] as string[],
    discountType: 'percentage' as 'percentage' | 'fixed' | 'bogo',
    discountValue: '',
    notes: '',
  });

  useEffect(() => {
    setData(getData());
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Load existing draft if editing
    if (promotionId) {
      const promotion = getPromotion(promotionId);
      if (promotion && promotion.status === 'draft') {
        setEditingPromotion(promotion);
        setFormData({
          name: promotion.name,
          description: promotion.description || '',
          reason: promotion.reason || '',
          startDate: promotion.startDate,
          endDate: promotion.endDate,
          productIds: promotion.productIds,
          channelIds: promotion.channelIds,
          discountType: promotion.discountType,
          discountValue: promotion.discountType === 'bogo' ? '' : promotion.discountValue.toString(),
          notes: promotion.notes || '',
        });
        setLastSaved(new Date(promotion.updatedAt));
      }
    }
  }, [router, promotionId]);

  // Auto-save as draft every 30 seconds
  useEffect(() => {
    if (autoSaveTimer.current) {
      clearInterval(autoSaveTimer.current);
    }

    autoSaveTimer.current = setInterval(() => {
      if (formData.name || formData.productIds.length > 0 || formData.channelIds.length > 0) {
        saveDraft();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current);
      }
    };
  }, [formData]);

  const saveDraft = async (silent = true) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return;
    }

    // Don't save if there's no meaningful data
    if (!formData.name && formData.productIds.length === 0 && formData.channelIds.length === 0) {
      return;
    }

    if (!silent) {
      setSaving(true);
    }

    const promotionData = {
      name: formData.name || 'Untitled Promotion',
      description: formData.description || undefined,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || new Date().toISOString().split('T')[0],
      productIds: formData.productIds,
      channelIds: formData.channelIds,
      discountType: formData.discountType,
      discountValue: formData.discountType === 'bogo' ? 0 : (formData.discountValue ? parseFloat(formData.discountValue) : 0),
      status: 'draft' as const,
      proposedBy: currentUser.name,
      reason: formData.reason || undefined,
      notes: formData.notes || undefined,
    };

    try {
      if (editingPromotion) {
        updatePromotion(editingPromotion.id, promotionData);
        const updated = getPromotion(editingPromotion.id);
        if (updated) setEditingPromotion(updated);
      } else {
        const newPromotion = addPromotion(promotionData);
        setEditingPromotion(newPromotion);
        // Update URL to include the ID for future auto-saves
        router.replace(`/promotions/request?id=${newPromotion.id}`, { scroll: false });
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      if (!silent) {
        setTimeout(() => setSaving(false), 500);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const promotionData = {
      name: formData.name,
      description: formData.description || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      productIds: formData.productIds,
      channelIds: formData.channelIds,
      discountType: formData.discountType,
      discountValue: formData.discountType === 'bogo' ? 0 : parseFloat(formData.discountValue),
      status: 'pending' as const,
      proposedBy: currentUser.name,
      reason: formData.reason || undefined,
      notes: formData.notes || undefined,
    };

    // Update existing draft or create new
    if (editingPromotion) {
      updatePromotion(editingPromotion.id, promotionData);
    } else {
      addPromotion(promotionData);
    }

    setSubmitSuccess(true);
    setSubmitting(false);

    // Redirect to promotions page after 2 seconds
    setTimeout(() => {
      router.push('/promotions');
    }, 2000);
  };


  if (!data) {
    return (
      <div className="p-8">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="p-8">
          <div className="bg-[#181818] rounded-xl p-8 text-center border border-[#2a2a2a]">
            <div className="mb-4">
              <div className="w-16 h-16 bg-ui-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-ui-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Promotion Request Submitted!
              </h2>
              <p className="text-white">
                Your promotion request has been submitted and is pending approval.
              </p>
            </div>
            <p className="text-sm text-[#b3b3b3]">
              Redirecting to promotions page...
            </p>
          </div>
      </div>
    );
  }

  return (
    <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-5xl font-black text-white tracking-tight">
              Request a Promotion
            </h1>
            {lastSaved && (
              <div className="text-xs text-white">
                {saving ? (
                  <span className="text-[#1db954]">💾 Saving...</span>
                ) : (
                  <span>💾 Saved {lastSaved.toLocaleTimeString()}</span>
                )}
              </div>
            )}
          </div>
          <div className="bg-[#1a1a1a] border border-[#1db954] border-opacity-30 rounded-lg p-4 mb-4">
            <p className="text-sm text-white font-semibold mb-2">💾 Auto-Save Enabled</p>
            <p className="text-sm text-white mb-1">
              • <strong>Auto-save:</strong> Your work is automatically saved as draft every 30 seconds
            </p>
            <p className="text-sm text-white mb-1">
              • <strong>Save Draft:</strong> Click "Save Draft" to manually save anytime
            </p>
            <p className="text-sm text-[#b3b3b3]">
              • <strong>Submit:</strong> When ready, click "Submit for Approval" to send for review
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#181818] rounded-xl p-8 space-y-6 border border-[#2a2a2a]">
          {/* Promotion Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Promotion Name <span className="text-ui-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Black Friday Sale, Summer Wellness Month"
              className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-np-blue-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Promotion Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe what this promotion is about..."
              className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-np-blue-500 transition-all"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Start Date <span className="text-ui-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-np-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                End Date <span className="text-ui-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-np-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Products */}
          <SearchableMultiSelect
            label="Select Products"
            required
            placeholder="Search and select products..."
            options={data.products.map((p) => ({
              id: p.id,
              label: p.name,
              subtitle: p.sku ? `SKU: ${p.sku} - $${p.basePrice.toFixed(2)}` : `$${p.basePrice.toFixed(2)}`,
            }))}
            selectedIds={formData.productIds}
            onChange={(selectedIds) => setFormData({ ...formData, productIds: selectedIds })}
          />

          {/* Channels */}
          <SearchableMultiSelect
            label="Select Channels"
            required
            placeholder="Search and select channels..."
            options={data.channels.map((c) => ({
              id: c.id,
              label: c.name,
              subtitle: c.description || undefined,
            }))}
            selectedIds={formData.channelIds}
            onChange={(selectedIds) => setFormData({ ...formData, channelIds: selectedIds })}
          />

          {/* Discount Type and Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Discount Type <span className="text-ui-red-600">*</span>
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType: e.target.value as 'percentage' | 'fixed' | 'bogo',
                  })
                }
                className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-np-blue-500 transition-all"
              >
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed">Fixed Amount Off ($)</option>
                <option value="bogo">Buy One Get One (BOGO)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Discount Value <span className="text-ui-red-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required={formData.discountType !== 'bogo'}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={
                  formData.discountType === 'percentage'
                    ? 'e.g., 20 for 20%'
                    : formData.discountType === 'fixed'
                      ? 'e.g., 10 for $10 off'
                      : 'N/A for BOGO'
                }
                disabled={formData.discountType === 'bogo'}
                  className="w-full px-4 py-3 border-2 border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-transparent transition-all disabled:bg-bg-subtle disabled:text-txt-tertiary"
              />
              {formData.discountType === 'bogo' && (
                <p className="text-xs text-txt-tertiary mt-1">
                  Buy One Get One promotion - no discount value needed
                </p>
              )}
            </div>
          </div>

          {/* Reason/Business Case */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Why is this promotion needed? <span className="text-ui-red-600">*</span>
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              placeholder="Explain the business case, holiday/event, competitive pressure, or other reason for this promotion..."
              className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-np-blue-500 transition-all"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Any additional information, special requirements, or considerations..."
              className="w-full px-4 py-3 bg-[#1a1a1a] border-2 border-[#2a2a2a] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-np-blue-500 focus:border-np-blue-500 transition-all"
            />
          </div>

          {/* Validation Messages - Only show when trying to submit */}
          {(!formData.name || !formData.startDate || !formData.endDate || 
            formData.productIds.length === 0 || formData.channelIds.length === 0 || 
            (formData.discountType !== 'bogo' && !formData.discountValue) || !formData.reason) && (
            <div className="bg-[#1db954] bg-opacity-20 border border-[#1db954] rounded-lg p-4">
              <p className="text-sm font-bold text-white mb-2">⚠️ Complete these fields to submit for approval:</p>
              <ul className="text-sm text-white space-y-1 list-disc list-inside">
                {!formData.name && <li>Promotion name is required</li>}
                {!formData.startDate && <li>Start date is required</li>}
                {!formData.endDate && <li>End date is required</li>}
                {formData.productIds.length === 0 && <li>At least one product must be selected</li>}
                {formData.channelIds.length === 0 && <li>At least one channel must be selected</li>}
                {formData.discountType !== 'bogo' && !formData.discountValue && <li>Discount value is required</li>}
                {!formData.reason && <li>Business case/reason is required</li>}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={() => saveDraft(false)}
              disabled={saving || (!formData.name && formData.productIds.length === 0 && formData.channelIds.length === 0)}
              className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#282828] text-white rounded-full transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-[#2a2a2a]"
            >
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button
              type="submit"
              disabled={
                submitting ||
                !formData.name ||
                !formData.startDate ||
                !formData.endDate ||
                formData.productIds.length === 0 ||
                formData.channelIds.length === 0 ||
                (formData.discountType !== 'bogo' && !formData.discountValue) ||
                !formData.reason
              }
              className="flex-1 px-6 py-3 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full hover:scale-105 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? 'Submitting...' : '✅ Submit for Approval'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/promotions')}
              className="px-6 py-3 border-2 border-border-default rounded-xl hover:bg-bg-subtle transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
    </div>
  );
}

