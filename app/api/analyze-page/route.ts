import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { url, checksToRun } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('Launching Puppeteer to analyze:', url);

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Go to the page
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Get page content
    const bodyText = await page.evaluate(() => document.body.innerText);

    // Run checks and find positions
    const results = await page.evaluate((checks) => {
      const issues: any[] = [];

      // Helper to find element position
      function getElementPosition(element: Element) {
        const rect = element.getBoundingClientRect();
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const bodyHeight = document.body.scrollHeight;
        const bodyWidth = document.body.scrollWidth;
        const absoluteY = rect.top + scrollY;
        const absoluteX = rect.left + window.pageXOffset;
        
        return {
          x: Math.min(Math.max((absoluteX / bodyWidth) * 100, 10), 90),
          y: Math.min(Math.max((absoluteY / bodyHeight) * 100, 5), 95)
        };
      }

      // Helper to find text in DOM
      function findTextElement(searchText: string): Element | null {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        );

        let node;
        while (node = walker.nextNode()) {
          if (node.textContent && node.textContent.toLowerCase().includes(searchText.toLowerCase())) {
            return node.parentElement;
          }
        }
        return null;
      }

      // 1. SPELLING CHECKS - Scan ALL text for common typos
      const allText = document.body.innerText;
      const spellingChecks = [
        { wrong: 'protien', correct: 'protein' },
        { wrong: 'pepitdes', correct: 'peptides' },
        { wrong: 'colegen', correct: 'collagen' },
        { wrong: 'recieve', correct: 'receive' },
        { wrong: 'occured', correct: 'occurred' },
        { wrong: 'acheive', correct: 'achieve' },
        { wrong: 'seperate', correct: 'separate' },
        { wrong: 'definately', correct: 'definitely' },
      ];

      spellingChecks.forEach((check) => {
        // Only flag if the misspelling actually exists on the page
        if (allText.toLowerCase().includes(check.wrong.toLowerCase())) {
          const element = findTextElement(check.wrong);
          if (element) {
            const position = getElementPosition(element);
            const context = element.textContent?.substring(0, 100) || '';
            
            issues.push({
              type: 'spelling',
              severity: 'critical',
              category: 'Content',
              message: `Spelling Error: "${check.wrong}" should be "${check.correct}"`,
              context: context,
              position: position,
            });
          }
        }
      });

      // 2. DISEASE CLAIMS - Only flag if actually found
      const prohibitedTerms = ['fracture', 'fractures', 'diabetes', 'cancer', 'heart disease', 'alzheimer'];
      prohibitedTerms.forEach((term) => {
        if (allText.toLowerCase().includes(term.toLowerCase())) {
          const element = findTextElement(term);
          if (element) {
            const position = getElementPosition(element);
            const context = element.textContent?.substring(0, 150) || '';
            
            issues.push({
              type: 'disease-claim',
              severity: 'critical',
              category: 'Compliance',
              message: `CRITICAL: Disease Claim - Remove "${term}"`,
              context: context,
              position: position,
            });
          }
        }
      });

      // 3. ADDRESS CHECK
      const footer = document.querySelector('footer') || document.body;
      const footerText = footer.textContent || '';
      const hasCorrectAddress = footerText.includes('1395 Brickell Ave') || footerText.includes('Miami, FL 33131');
      
      if (!hasCorrectAddress && footerText.match(/\d{3,5}\s+[A-Z]/)) {
        const position = getElementPosition(footer);
        issues.push({
          type: 'address',
          severity: 'critical',
          category: 'Compliance',
          message: 'Wrong or Missing Address - Must use: 1395 Brickell Ave. Suite 800 Miami, FL 33131',
          context: 'Footer',
          position: position,
        });
      }

      // 4. "THE PATH" CAPITALIZATION - Only if found
      if (allText.includes('the path') || allText.includes('the Path')) {
        const element = findTextElement('the path');
        if (element && !element.textContent?.includes('The Path')) {
          const position = getElementPosition(element);
          issues.push({
            type: 'capitalization',
            severity: 'warning',
            category: 'Content',
            message: '"The Path" should always be capitalized',
            context: element.textContent?.substring(0, 100) || '',
            position: position,
          });
        }
      }

      // 5. "BREAK EVEN" PHRASE
      if (allText.toLowerCase().includes('break even') || allText.toLowerCase().includes('break-even')) {
        const element = findTextElement('break even') || findTextElement('break-even');
        if (element) {
          const position = getElementPosition(element);
          issues.push({
            type: 'prohibited-phrase',
            severity: 'warning',
            category: 'Content',
            message: 'Remove "break even" or "break-even" phrase',
            context: element.textContent?.substring(0, 100) || '',
            position: position,
          });
        }
      }

      // 6. TESTIMONIAL DISCLAIMER
      const hasTestimonial = allText.toLowerCase().includes('testimonial') || 
                            allText.toLowerCase().includes('customer review') ||
                            allText.toLowerCase().includes('verified buyer');
      const hasDisclaimer = allText.includes('Customer results have not been independently verified') ||
                           allText.includes('Results may vary');
      
      if (hasTestimonial && !hasDisclaimer) {
        const element = findTextElement('testimonial') || findTextElement('review');
        if (element) {
          const position = getElementPosition(element);
          issues.push({
            type: 'missing-disclaimer',
            severity: 'critical',
            category: 'Compliance',
            message: 'CRITICAL: Missing testimonial disclaimer - Add: (Customer results have not been independently verified. Results may vary.)',
            context: 'Testimonials section',
            position: position,
          });
        }
      }

      // 7. "UP TO" OR "AS LOW AS" LANGUAGE
      const hasSavingsClaim = /save \d+%|off \d+%|\$\d+ off/i.test(allText);
      const hasQualifier = /up to|as low as|select bundles/i.test(allText);
      
      if (hasSavingsClaim && !hasQualifier) {
        const element = findTextElement('save') || findTextElement('off');
        if (element) {
          const position = getElementPosition(element);
          issues.push({
            type: 'missing-qualifier',
            severity: 'warning',
            category: 'Content',
            message: 'Add "up to" or "as low as" language when making savings claims',
            context: element.textContent?.substring(0, 100) || '',
            position: position,
          });
        }
      }

      // 8. NATIVEPATH BRANDING (not "Native Path")
      if (allText.includes('Native Path') && !allText.includes('NativePath')) {
        const element = findTextElement('Native Path');
        if (element) {
          const position = getElementPosition(element);
          issues.push({
            type: 'branding',
            severity: 'warning',
            category: 'Content',
            message: 'Use "NativePath" (one word), not "Native Path"',
            context: element.textContent?.substring(0, 100) || '',
            position: position,
          });
        }
      }

      // 9. MISSING ALT TEXT ON IMAGES
      const images = Array.from(document.querySelectorAll('img'));
      const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '');
      
      if (imagesWithoutAlt.length > 0) {
        const firstImage = imagesWithoutAlt[0];
        const position = getElementPosition(firstImage);
        issues.push({
          type: 'accessibility',
          severity: 'warning',
          category: 'SEO',
          message: `${imagesWithoutAlt.length} image(s) missing alt text`,
          context: 'Accessibility issue',
          position: position,
        });
      }

      // 10. MULTIPLE H1 TAGS
      const h1Tags = Array.from(document.querySelectorAll('h1'));
      if (h1Tags.length > 1) {
        const position = getElementPosition(h1Tags[1]);
        issues.push({
          type: 'seo',
          severity: 'warning',
          category: 'SEO',
          message: `Multiple H1 tags found (${h1Tags.length}). Should only have one.`,
          context: 'SEO issue',
          position: position,
        });
      }

      return issues;
    }, checksToRun || {});

    await browser.close();

    console.log('Analysis complete. Found', results.length, 'issues');

    return NextResponse.json({
      success: true,
      bodyText: bodyText.substring(0, 500), // First 500 chars for reference
      issues: results,
    });

  } catch (error: any) {
    console.error('Puppeteer analysis error:', error);
    return NextResponse.json(
      { error: `Analysis failed: ${error.message}` },
      { status: 500 }
    );
  }
}

