import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to fetch price from a URL
 * Supports Shopify stores (nativepath.com) and regular websites
 * This runs server-side to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Validate URL
    const urlObj = new URL(url);
    const isShopify = urlObj.hostname.includes('nativepath.com') || 
                      urlObj.hostname.includes('.myshopify.com') ||
                      urlObj.hostname.includes('shopify');

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extract price from HTML
    let price = 0;

    if (isShopify) {
      // Shopify-specific selectors
      // Try JSON-LD structured data first (most reliable)
      const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      if (jsonLdMatch) {
        for (const script of jsonLdMatch) {
          try {
            const jsonStr = script.replace(/<script[^>]*>|<\/script>/gi, '').trim();
            const data = JSON.parse(jsonStr);
            
            // Handle different JSON-LD structures
            if (data['@type'] === 'Product' || Array.isArray(data)) {
              const product = Array.isArray(data) ? data.find((item: any) => item['@type'] === 'Product') : data;
              if (product?.offers) {
                const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
                if (offer?.price) {
                  price = parseFloat(offer.price);
                  break;
                }
              }
            }
          } catch (e) {
            // Continue to next script tag
          }
        }
      }

      // Fallback: Try common Shopify price selectors
      if (!price) {
        const priceSelectors = [
          /<span[^>]*class=["'][^"']*price[^"']*["'][^>]*>[\s\S]*?\$([\d,]+\.?\d*)/i,
          /<span[^>]*data-product-price=["']([\d,]+\.?\d*)/i,
          /"price":\s*"([\d,]+\.?\d*)"/i,
          /price["']:\s*([\d,]+\.?\d*)/i,
          /"price"\s*:\s*([\d,]+\.?\d*)/i,
          /\$\s*([\d,]+\.?\d*)/g,
        ];

        for (const pattern of priceSelectors) {
          const matches = html.match(pattern);
          if (matches && matches.length > 0) {
            // Get the last match (usually the final price, not crossed out)
            const priceStr = matches[matches.length - 1].replace(/[^0-9.]/g, '');
            const parsed = parseFloat(priceStr);
            if (!isNaN(parsed) && parsed > 0) {
              price = parsed;
              break;
            }
          }
        }
      }

      // Additional fallback: Look for Shopify's product JSON
      if (!price) {
        const productJsonMatch = html.match(/var\s+product\s*=\s*({[\s\S]*?});/i);
        if (productJsonMatch) {
          try {
            const productData = JSON.parse(productJsonMatch[1]);
            if (productData.price) {
              price = parseFloat(productData.price) / 100; // Shopify prices are often in cents
            } else if (productData.variants?.[0]?.price) {
              price = parseFloat(productData.variants[0].price) / 100;
            }
          } catch (e) {
            // Continue
          }
        }
      }
    } else {
      // Generic website scraping
      // Look for common price patterns
      const pricePatterns = [
        /<span[^>]*class=["'][^"']*price[^"']*["'][^>]*>[\s\S]*?\$([\d,]+\.?\d*)/i,
        /<div[^>]*class=["'][^"']*price[^"']*["'][^>]*>[\s\S]*?\$([\d,]+\.?\d*)/i,
        /\$\s*([\d,]+\.?\d*)/g,
      ];

      for (const pattern of pricePatterns) {
        const matches = html.match(pattern);
        if (matches && matches.length > 0) {
          const priceStr = matches[matches.length - 1].replace(/[^0-9.]/g, '');
          const parsed = parseFloat(priceStr);
          if (!isNaN(parsed) && parsed > 0 && parsed < 10000) {
            price = parsed;
            break;
          }
        }
      }
    }

    if (!price || price === 0) {
      return NextResponse.json({
        price: 0,
        error: 'Could not find price on page. The page structure may have changed or the product may be unavailable.',
      });
    }

    return NextResponse.json({ price });
  } catch (error) {
    console.error('Price fetch error:', error);
    return NextResponse.json(
      { 
        price: 0,
        error: `Failed to fetch price: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}

