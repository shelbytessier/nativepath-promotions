import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the page content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new NextResponse(
        `Failed to fetch page: ${response.status} ${response.statusText}`,
        { status: response.status }
      );
    }

    let html = await response.text();

    // Inject a script to communicate with parent and find element positions
    const injectedScript = '<script>' +
      'window.addEventListener("DOMContentLoaded", function() {' +
        'window.findTextPosition = function(searchText) {' +
          'var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);' +
          'var node;' +
          'while (node = walker.nextNode()) {' +
            'var text = node.textContent.toLowerCase();' +
            'if (text.includes(searchText.toLowerCase())) {' +
              'var parent = node.parentElement;' +
              'if (parent) {' +
                'var rect = parent.getBoundingClientRect();' +
                'var bodyHeight = document.body.scrollHeight;' +
                'var scrollY = window.pageYOffset || document.documentElement.scrollTop;' +
                'var absoluteY = rect.top + scrollY;' +
                'return { x: 50, y: Math.min(Math.max((absoluteY / bodyHeight) * 100, 5), 90) };' +
              '}' +
            '}' +
          '}' +
          'return null;' +
        '};' +
        'window.addEventListener("message", function(event) {' +
          'if (event.data.type === "FIND_TEXT") {' +
            'var position = window.findTextPosition(event.data.text);' +
            'window.parent.postMessage({ type: "TEXT_POSITION", text: event.data.text, position: position }, "*");' +
          '}' +
        '});' +
        'window.parent.postMessage({ type: "PAGE_READY" }, "*");' +
      '});' +
      '</script>';

    // Inject the script before </head> or </body>
    if (html.includes('</head>')) {
      html = html.replace('</head>', injectedScript + '</head>');
    } else if (html.includes('</body>')) {
      html = html.replace('</body>', injectedScript + '</body>');
    } else {
      html = html + injectedScript;
    }

    // Fix relative URLs to absolute
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    
    html = html.replace(/src="\/([^"]+)"/g, `src="${baseUrl}/$1"`);
    html = html.replace(/href="\/([^"]+)"/g, `href="${baseUrl}/$1"`);
    html = html.replace(/url\(\/([^)]+)\)/g, `url(${baseUrl}/$1)`);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new NextResponse(
      `Error proxying page: ${error.message}`,
      { status: 500 }
    );
  }
}

