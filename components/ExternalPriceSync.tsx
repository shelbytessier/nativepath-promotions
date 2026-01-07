'use client';

import { useState } from 'react';
import type { Product, ExternalPrice } from '@/types';
import { syncProductPrices } from '@/lib/priceSync';
import { getData, updateProduct } from '@/lib/storage';

interface ExternalPriceSyncProps {
  product: Product;
  onUpdate: () => void;
}

export default function ExternalPriceSync({ product, onUpdate }: ExternalPriceSyncProps) {
  const [syncing, setSyncing] = useState(false);
  const [externalPrices, setExternalPrices] = useState<ExternalPrice[]>(product.externalPrices || []);

  const handleSync = async () => {
    if (!product.externalPrices || product.externalPrices.length === 0) {
      return;
    }

    setSyncing(true);
    try {
      const syncedPrices = await syncProductPrices(product);
      setExternalPrices(syncedPrices);
      
      // Update product with synced prices
      const updatedProduct = {
        ...product,
        externalPrices: syncedPrices,
      };
      updateProduct(product.id, updatedProduct);
      onUpdate();
    } catch (error) {
      console.error('Failed to sync prices:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (externalPrices.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-white">External Prices</h5>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-3 py-1 text-xs bg-np-blue-600 hover:bg-np-blue-500 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? 'Syncing...' : '🔄 Sync'}
        </button>
      </div>
      
      <div className="space-y-2">
        {externalPrices.map((ep, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              ep.isMatch
                ? 'bg-np-blue-600 bg-opacity-10 border-np-blue-600 border-opacity-30'
                : ep.currentPrice && ep.difference
                  ? 'bg-[#e22134] bg-opacity-10 border-[#e22134] border-opacity-30'
                  : 'bg-[#1a1a1a] border-[#2a2a2a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-white uppercase">
                    {ep.channel === 'amazon' ? '🛒 Amazon' : ep.channel === 'website' ? '🌐 Website' : '📄 Landing Page'}
                  </span>
                  {ep.isMatch && (
                    <span className="text-xs px-2 py-0.5 bg-np-blue-600 bg-opacity-20 text-np-blue-400 rounded-full">
                      ✓ Match
                    </span>
                  )}
                  {ep.currentPrice && ep.difference && !ep.isMatch && (
                    <span className="text-xs px-2 py-0.5 bg-[#e22134] bg-opacity-20 text-[#e22134] rounded-full">
                      ⚠ Mismatch
                    </span>
                  )}
                </div>
                
                {ep.currentPrice ? (
                  <div className="space-y-1">
                    <div className={`text-lg font-bold ${ep.isMatch ? 'text-white' : 'text-[#e22134]'}`}>
                      ${ep.currentPrice.toFixed(2)}
                    </div>
                    {ep.difference && !ep.isMatch && (
                      <div className="text-xs text-[#b3b3b3]">
                        Expected: ${product.basePrice.toFixed(2)} | 
                        Diff: <span className="text-[#e22134]">
                          {ep.difference > 0 ? '+' : ''}${ep.difference.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : ep.error ? (
                  <div className="text-xs text-[#e22134]">{ep.error}</div>
                ) : (
                  <div className="text-xs text-[#6b6b6b]">Price not fetched</div>
                )}
                
                {ep.lastFetched && (
                  <div className="text-xs text-[#6b6b6b] mt-1">
                    Last synced: {new Date(ep.lastFetched).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





