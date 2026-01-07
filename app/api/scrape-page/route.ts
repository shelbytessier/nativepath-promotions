import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the page content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch page: ${response.status} ${response.statusText}` 
      }, { status: response.status });
    }

    const html = await response.text();

    // Extract useful information
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
    const metaDescription = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
    const h1Tags = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi)?.map(tag => tag.replace(/<[^>]+>/g, '')) || [];
    
    // Extract all text content (simplified)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract images
    const images = Array.from(html.matchAll(/<img[^>]*>/gi)).map(match => {
      const imgTag = match[0];
      const src = imgTag.match(/src=["']([^"']+)["']/i)?.[1] || '';
      const alt = imgTag.match(/alt=["']([^"']+)["']/i)?.[1] || '';
      return { src, alt, hasAlt: !!alt };
    });

    // Extract links
    const links = Array.from(html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi)).map(match => {
      return match[1];
    });

    // Extract prices
    const prices = Array.from(textContent.matchAll(/\$\d+(?:\.\d{2})?/g)).map(match => match[0]);

    return NextResponse.json({
      success: true,
      data: {
        url,
        title,
        metaDescription,
        h1Tags,
        textContent: textContent.substring(0, 10000), // Limit to first 10k chars
        images,
        links,
        prices,
        htmlLength: html.length,
      }
    });

  } catch (error: any) {
    console.error('Scraping error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to scrape page' 
    }, { status: 500 });
  }
}

