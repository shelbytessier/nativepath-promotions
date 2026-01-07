'use client';

import { useState } from 'react';
import type { PriceTier } from '@/types';

interface PriceTierEditorProps {
  tiers: PriceTier[];
  onChange: (tiers: PriceTier[]) => void;
  basePrice: number; // For reference
}

export default function PriceTierEditor({ tiers, onChange, basePrice }: PriceTierEditorProps) {
  const [showAddTier, setShowAddTier] = useState(false);
  const [editingTier, setEditingTier] = useState<PriceTier | null>(null);
  const [tierForm, setTierForm] = useState({
    name: '',
    quantity: '',
    price: '',
    retailPrice: '',
    margin: '',
    includesFreeGift: false,
    freeGiftDescription: '',
    notes: '',
  });

  const handleAddTier = () => {
    const newTier: PriceTier = {
      id: Date.now().toString(),
      name: tierForm.name,
      quantity: tierForm.quantity ? parseInt(tierForm.quantity) : undefined,
      price: parseFloat(tierForm.price),
      retailPrice: tierForm.retailPrice ? parseFloat(tierForm.retailPrice) : undefined,
      margin: tierForm.margin ? parseFloat(tierForm.margin) : undefined,
      includesFreeGift: tierForm.includesFreeGift,
      freeGiftDescription: tierForm.freeGiftDescription || undefined,
      notes: tierForm.notes || undefined,
    };

    if (editingTier) {
      onChange(tiers.map((t) => (t.id === editingTier.id ? newTier : t)));
      setEditingTier(null);
    } else {
      onChange([...tiers, newTier]);
    }

    setTierForm({
      name: '',
      quantity: '',
      price: '',
      retailPrice: '',
      margin: '',
      includesFreeGift: false,
      freeGiftDescription: '',
      notes: '',
    });
    setShowAddTier(false);
  };

  const handleEditTier = (tier: PriceTier) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name,
      quantity: tier.quantity?.toString() || '',
      price: tier.price.toString(),
      retailPrice: tier.retailPrice?.toString() || '',
      margin: tier.margin?.toString() || '',
      includesFreeGift: tier.includesFreeGift || false,
      freeGiftDescription: tier.freeGiftDescription || '',
      notes: tier.notes || '',
    });
    setShowAddTier(true);
  };

  const handleDeleteTier = (tierId: string) => {
    onChange(tiers.filter((t) => t.id !== tierId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-txt-secondary">Pricing Tiers</h4>
        <button
          type="button"
          onClick={() => {
            setShowAddTier(true);
            setEditingTier(null);
            setTierForm({
              name: '',
              quantity: '',
              price: '',
              retailPrice: '',
              margin: '',
              includesFreeGift: false,
              freeGiftDescription: '',
              notes: '',
            });
          }}
          className="text-sm px-3 py-1 bg-np-blue-100 text-np-blue-700 rounded-lg hover:bg-np-blue-200 transition-all"
        >
          + Add Tier
        </button>
      </div>

      {/* Existing Tiers */}
      {tiers.length > 0 && (
        <div className="space-y-2 border border-border-subtle rounded-xl p-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex items-start justify-between p-3 bg-bg-subtle rounded-lg border border-border-subtle"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-txt-secondary">{tier.name}</span>
                  {tier.includesFreeGift && (
                    <span className="px-2 py-0.5 bg-ui-green-100 text-ui-green-800 text-xs rounded-full">
                      Free Gift
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-txt-tertiary">Price: </span>
                    <span className="font-semibold text-txt-secondary">${tier.price.toFixed(2)}</span>
                  </div>
                  {tier.retailPrice && (
                    <div>
                      <span className="text-txt-tertiary">Retail: </span>
                      <span className="font-semibold text-txt-secondary">${tier.retailPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {tier.margin !== undefined && (
                    <div>
                      <span className="text-txt-tertiary">Margin: </span>
                      <span className="font-semibold text-txt-secondary">{tier.margin.toFixed(1)}%</span>
                    </div>
                  )}
                  {tier.quantity && (
                    <div>
                      <span className="text-txt-tertiary">Qty: </span>
                      <span className="font-semibold text-txt-secondary">{tier.quantity}</span>
                    </div>
                  )}
                </div>
                {tier.freeGiftDescription && (
                  <div className="text-sm text-ui-green-700 mt-1">🎁 {tier.freeGiftDescription}</div>
                )}
                {tier.notes && (
                  <div className="text-xs text-txt-tertiary mt-1">{tier.notes}</div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => handleEditTier(tier)}
                  className="text-xs px-2 py-1 text-np-blue-600 hover:bg-np-blue-50 rounded transition-all"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTier(tier.id)}
                  className="text-xs px-2 py-1 text-ui-red-600 hover:bg-ui-red-50 rounded transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Tier Form */}
      {showAddTier && (
        <div className="border-2 border-np-blue-200 rounded-xl p-4 bg-np-blue-50">
          <h5 className="font-semibold text-txt-secondary mb-4">
            {editingTier ? 'Edit Pricing Tier' : 'Add Pricing Tier'}
          </h5>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1">
                Tier Name (e.g., "1 Bottle", "2 Bottles + Free Gift") <span className="text-ui-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={tierForm.name}
                onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
                placeholder="e.g., 3 Bottles + Free Shaker"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-txt-secondary mb-1">
                  Quantity (optional)
                </label>
                <input
                  type="number"
                  value={tierForm.quantity}
                  onChange={(e) => setTierForm({ ...tierForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-txt-secondary mb-1">
                  Price ($) <span className="text-ui-red-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={tierForm.price}
                  onChange={(e) => setTierForm({ ...tierForm, price: e.target.value })}
                  className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-txt-secondary mb-1">
                  Retail/Total Market Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tierForm.retailPrice}
                  onChange={(e) => setTierForm({ ...tierForm, retailPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-txt-secondary mb-1">
                  Margin (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tierForm.margin}
                  onChange={(e) => setTierForm({ ...tierForm, margin: e.target.value })}
                  className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="freeGift"
                checked={tierForm.includesFreeGift}
                onChange={(e) => setTierForm({ ...tierForm, includesFreeGift: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="freeGift" className="text-sm text-txt-secondary">
                Includes Free Gift
              </label>
            </div>
            {tierForm.includesFreeGift && (
              <div>
                <label className="block text-xs font-medium text-txt-secondary mb-1">
                  Free Gift Description
                </label>
                <input
                  type="text"
                  value={tierForm.freeGiftDescription}
                  onChange={(e) => setTierForm({ ...tierForm, freeGiftDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
                  placeholder="e.g., Free Shaker Bottle"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1">
                Notes
              </label>
              <textarea
                value={tierForm.notes}
                onChange={(e) => setTierForm({ ...tierForm, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-np-blue-500"
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddTier}
                className="px-4 py-2 bg-ui-orange-500 text-white rounded-lg hover:bg-ui-orange-600 transition-all text-sm font-medium"
              >
                {editingTier ? 'Update' : 'Add'} Tier
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTier(false);
                  setEditingTier(null);
                  setTierForm({
                    name: '',
                    quantity: '',
                    price: '',
                    retailPrice: '',
                    margin: '',
                    includesFreeGift: false,
                    freeGiftDescription: '',
                    notes: '',
                  });
                }}
                className="px-4 py-2 border border-border-default rounded-lg hover:bg-bg-subtle transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {tiers.length === 0 && !showAddTier && (
        <p className="text-sm text-txt-tertiary text-center py-4">
          No pricing tiers set. Add tiers to support multiple price points (e.g., 1 bottle, 2 bottles, bundle with free gift).
        </p>
      )}
    </div>
  );
}




