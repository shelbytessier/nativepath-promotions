import type { Product, ExternalPrice } from '@/types';

/**
 * Fetches price from Amazon using ASIN
 * Note: In production, this would use Amazon Product Advertising API
 * For now, this is a placeholder that can be replaced with actual API calls
 */
export async function fetchAmazonPrice(asin: string): Promise<{ price: number; error?: string }> {
  try {
    // TODO: Replace with actual Amazon Product Advertising API call
    // Example: const response = await fetch(`https://api.amazon.com/product/${asin}`);
    
    // For now, return mock data - replace with real API call
    // In production, you'd use:
    // - Amazon Product Advertising API (requires credentials)
    // - Or web scraping (may violate ToS, use carefully)
    // - Or third-party services like Keepa, CamelCamelCamel API
    
    return { price: 0, error: 'Amazon API not configured. Add credentials in production.' };
  } catch (error) {
    return { price: 0, error: `Failed to fetch Amazon price: ${error}` };
  }
}

/**
 * Fetches price from a website/landing page URL
 * Supports Shopify stores (like nativepath.com) and regular websites
 */
export async function fetchWebsitePrice(url: string): Promise<{ price: number; error?: string }> {
  try {
    // Use server-side API route to avoid CORS issues
    const response = await fetch(`/api/fetch-price?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }
    
    const data = await response.json();
    
    if (data.error) {
      return { price: 0, error: data.error };
    }
    
    return { price: data.price || 0 };
  } catch (error) {
    return { price: 0, error: `Failed to fetch website price: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

/**
 * Syncs external prices for a product
 */
export async function syncProductPrices(product: Product): Promise<ExternalPrice[]> {
  if (!product.externalPrices || product.externalPrices.length === 0) {
    return [];
  }

  const syncedPrices: ExternalPrice[] = [];

  for (const externalPrice of product.externalPrices) {
    let currentPrice = 0;
    let error: string | undefined;

    try {
      if (externalPrice.channel === 'amazon' && externalPrice.asin) {
        const result = await fetchAmazonPrice(externalPrice.asin);
        currentPrice = result.price;
        error = result.error;
      } else if ((externalPrice.channel === 'website' || externalPrice.channel === 'landing-page') && externalPrice.url) {
        const result = await fetchWebsitePrice(externalPrice.url);
        currentPrice = result.price;
        error = result.error;
      }

      // Calculate difference
      const difference = currentPrice > 0 ? currentPrice - product.basePrice : undefined;
      const isMatch = currentPrice > 0 && Math.abs(difference || 0) < 0.01; // Within 1 cent

      syncedPrices.push({
        ...externalPrice,
        currentPrice: currentPrice > 0 ? currentPrice : undefined,
        lastFetched: new Date().toISOString(),
        isMatch,
        difference,
        error,
      });
    } catch (err) {
      syncedPrices.push({
        ...externalPrice,
        lastFetched: new Date().toISOString(),
        error: err instanceof Error ? err.message : 'Unknown error',
        isMatch: false,
      });
    }
  }

  return syncedPrices;
}

