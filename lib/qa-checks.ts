// QA Check Configuration System

export interface QACheckRule {
  id: string;
  name: string;
  category: 'spelling' | 'offer' | 'pricing' | 'images' | 'links' | 'seo' | 'compliance' | 'content';
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  description: string;
  checkFunction: string; // Name of the check function to run
  channels: string[]; // Which channels this applies to (empty = all)
}

export interface QACheckResult {
  ruleId: string;
  passed: boolean;
  message?: string;
  location?: string;
  details?: string;
}

// Default QA Check Rules
export const defaultQARules: QACheckRule[] = [
  // Spelling & Grammar
  {
    id: 'spell-common-typos',
    name: 'Common Spelling Errors',
    category: 'spelling',
    severity: 'warning',
    enabled: true,
    description: 'Checks for common misspellings like "recieve", "occured", "seperate"',
    checkFunction: 'checkCommonTypos',
    channels: [],
  },
  {
    id: 'spell-repeated-words',
    name: 'Repeated Words',
    category: 'spelling',
    severity: 'info',
    enabled: true,
    description: 'Detects repeated words like "the the" or "and and"',
    checkFunction: 'checkRepeatedWords',
    channels: [],
  },
  {
    id: 'spell-product-names',
    name: 'Product Name Consistency',
    category: 'spelling',
    severity: 'warning',
    enabled: true,
    description: 'Ensures product names match official spelling (e.g., "Collagen Peptides" not "collagen peptide")',
    checkFunction: 'checkProductNames',
    channels: [],
  },

  // Offers & Pricing
  {
    id: 'offer-price-match',
    name: 'Offer Price Match',
    category: 'offer',
    severity: 'critical',
    enabled: true,
    description: 'Verifies page pricing matches offer system pricing',
    checkFunction: 'checkOfferPriceMatch',
    channels: [],
  },
  {
    id: 'offer-expiry-date',
    name: 'Offer Expiry Date',
    category: 'offer',
    severity: 'warning',
    enabled: true,
    description: 'Checks if offer expiry date is mentioned and accurate',
    checkFunction: 'checkOfferExpiry',
    channels: [],
  },
  {
    id: 'offer-code-valid',
    name: 'Promo Code Validation',
    category: 'offer',
    severity: 'critical',
    enabled: true,
    description: 'Validates that promo codes mentioned on page are active',
    checkFunction: 'checkPromoCode',
    channels: [],
  },
  {
    id: 'pricing-margin-check',
    name: 'Margin Threshold',
    category: 'pricing',
    severity: 'warning',
    enabled: true,
    description: 'Ensures margin is above 60% threshold',
    checkFunction: 'checkMarginThreshold',
    channels: [],
  },
  {
    id: 'pricing-compare-at',
    name: 'Compare-At Price',
    category: 'pricing',
    severity: 'warning',
    enabled: true,
    description: 'Validates compare-at pricing is legitimate and higher than sale price',
    checkFunction: 'checkCompareAtPrice',
    channels: [],
  },

  // Images
  {
    id: 'img-alt-text',
    name: 'Image Alt Text',
    category: 'images',
    severity: 'warning',
    enabled: true,
    description: 'Checks that all images have descriptive alt text',
    checkFunction: 'checkImageAltText',
    channels: [],
  },
  {
    id: 'img-product-match',
    name: 'Product Image Accuracy',
    category: 'images',
    severity: 'critical',
    enabled: true,
    description: 'Verifies product images match the actual product being sold',
    checkFunction: 'checkProductImageMatch',
    channels: [],
  },
  {
    id: 'img-broken-links',
    name: 'Broken Images',
    category: 'images',
    severity: 'critical',
    enabled: true,
    description: 'Detects images that fail to load (404 errors)',
    checkFunction: 'checkBrokenImages',
    channels: [],
  },
  {
    id: 'img-size-optimization',
    name: 'Image Size Optimization',
    category: 'images',
    severity: 'info',
    enabled: true,
    description: 'Checks if images are optimized for web (file size)',
    checkFunction: 'checkImageOptimization',
    channels: [],
  },

  // Links
  {
    id: 'link-checkout-working',
    name: 'Checkout Link Functional',
    category: 'links',
    severity: 'critical',
    enabled: true,
    description: 'Verifies checkout/CTA buttons link to working pages',
    checkFunction: 'checkCheckoutLink',
    channels: [],
  },
  {
    id: 'link-broken-404',
    name: 'Broken Links (404)',
    category: 'links',
    severity: 'critical',
    enabled: true,
    description: 'Scans for any broken internal or external links',
    checkFunction: 'checkBrokenLinks',
    channels: [],
  },
  {
    id: 'link-external-https',
    name: 'External Links HTTPS',
    category: 'links',
    severity: 'warning',
    enabled: true,
    description: 'Ensures external links use HTTPS protocol',
    checkFunction: 'checkExternalHTTPS',
    channels: [],
  },

  // SEO
  {
    id: 'seo-meta-title',
    name: 'Meta Title Length',
    category: 'seo',
    severity: 'warning',
    enabled: true,
    description: 'Checks meta title is between 50-60 characters',
    checkFunction: 'checkMetaTitle',
    channels: [],
  },
  {
    id: 'seo-meta-description',
    name: 'Meta Description Length',
    category: 'seo',
    severity: 'warning',
    enabled: true,
    description: 'Checks meta description is between 150-160 characters',
    checkFunction: 'checkMetaDescription',
    channels: [],
  },
  {
    id: 'seo-h1-tag',
    name: 'H1 Tag Present',
    category: 'seo',
    severity: 'warning',
    enabled: true,
    description: 'Verifies page has exactly one H1 tag',
    checkFunction: 'checkH1Tag',
    channels: [],
  },
  {
    id: 'seo-canonical-url',
    name: 'Canonical URL',
    category: 'seo',
    severity: 'info',
    enabled: true,
    description: 'Checks for canonical URL tag to prevent duplicate content',
    checkFunction: 'checkCanonicalURL',
    channels: [],
  },

  // Compliance
  {
    id: 'compliance-fda-disclaimer',
    name: 'FDA Disclaimer',
    category: 'compliance',
    severity: 'critical',
    enabled: true,
    description: 'Ensures FDA disclaimer is present on health claims',
    checkFunction: 'checkFDADisclaimer',
    channels: [],
  },
  {
    id: 'compliance-health-claims',
    name: 'Health Claims Review',
    category: 'compliance',
    severity: 'critical',
    enabled: true,
    description: 'Flags potentially problematic health claims',
    checkFunction: 'checkHealthClaims',
    channels: [],
  },
  {
    id: 'compliance-terms-conditions',
    name: 'Terms & Conditions Link',
    category: 'compliance',
    severity: 'warning',
    enabled: true,
    description: 'Verifies T&C link is present and working',
    checkFunction: 'checkTermsLink',
    channels: [],
  },
  {
    id: 'compliance-privacy-policy',
    name: 'Privacy Policy Link',
    category: 'compliance',
    severity: 'warning',
    enabled: true,
    description: 'Verifies privacy policy link is present and working',
    checkFunction: 'checkPrivacyLink',
    channels: [],
  },

  // Content Quality
  {
    id: 'content-cta-present',
    name: 'Clear CTA Present',
    category: 'content',
    severity: 'warning',
    enabled: true,
    description: 'Checks for clear call-to-action buttons',
    checkFunction: 'checkCTAPresent',
    channels: [],
  },
  {
    id: 'content-urgency-scarcity',
    name: 'Urgency/Scarcity Language',
    category: 'content',
    severity: 'info',
    enabled: true,
    description: 'Identifies urgency/scarcity tactics for review',
    checkFunction: 'checkUrgencyLanguage',
    channels: [],
  },
  {
    id: 'content-testimonials',
    name: 'Testimonial Authenticity',
    category: 'content',
    severity: 'warning',
    enabled: true,
    description: 'Checks that testimonials have proper disclaimers',
    checkFunction: 'checkTestimonials',
    channels: [],
  },

  // Channel-Specific Checks
  {
    id: 'email-unsubscribe-link',
    name: 'Unsubscribe Link',
    category: 'compliance',
    severity: 'critical',
    enabled: true,
    description: 'Ensures email has unsubscribe link (CAN-SPAM compliance)',
    checkFunction: 'checkUnsubscribeLink',
    channels: ['Email'],
  },
  {
    id: 'email-preheader-text',
    name: 'Preheader Text',
    category: 'content',
    severity: 'warning',
    enabled: true,
    description: 'Checks for compelling preheader text',
    checkFunction: 'checkPreheaderText',
    channels: ['Email'],
  },
  {
    id: 'social-character-limit',
    name: 'Character Limit',
    category: 'content',
    severity: 'warning',
    enabled: true,
    description: 'Validates content fits within platform character limits',
    checkFunction: 'checkCharacterLimit',
    channels: ['Facebook', 'Instagram', 'Twitter'],
  },
  {
    id: 'social-hashtags',
    name: 'Hashtag Usage',
    category: 'content',
    severity: 'info',
    enabled: true,
    description: 'Checks for appropriate hashtag usage',
    checkFunction: 'checkHashtags',
    channels: ['Facebook', 'Instagram', 'Twitter'],
  },
];

// QA Check Functions (simplified mock implementations)
export const qaCheckFunctions = {
  checkCommonTypos: (content: string): QACheckResult => {
    const typos = ['recieve', 'occured', 'seperate', 'definately', 'occassion'];
    const found = typos.find(typo => content.toLowerCase().includes(typo));
    return {
      ruleId: 'spell-common-typos',
      passed: !found,
      message: found ? `Potential spelling error: "${found}"` : undefined,
      location: 'Content scan',
    };
  },

  checkRepeatedWords: (content: string): QACheckResult => {
    const repeated = /\b(\w+)\s+\1\b/gi.exec(content);
    return {
      ruleId: 'spell-repeated-words',
      passed: !repeated,
      message: repeated ? `Repeated word found: "${repeated[1]} ${repeated[1]}"` : undefined,
      location: 'Content scan',
    };
  },

  checkProductNames: (content: string): QACheckResult => {
    const productNames = ['Collagen Peptides', 'Hydrate', 'Probiotics 30B'];
    // Simplified check - in reality would be more sophisticated
    return {
      ruleId: 'spell-product-names',
      passed: true,
      location: 'Content scan',
    };
  },

  checkOfferPriceMatch: (content: string, offerData?: any): QACheckResult => {
    // Mock: Would compare page price to offer system
    const hasPrice = /\$\d+\.\d{2}/.test(content);
    return {
      ruleId: 'offer-price-match',
      passed: hasPrice,
      message: hasPrice ? undefined : 'No pricing found on page',
      location: 'Pricing section',
    };
  },

  checkOfferExpiry: (content: string): QACheckResult => {
    const hasExpiry = /expires|valid until|offer ends/i.test(content);
    return {
      ruleId: 'offer-expiry-date',
      passed: hasExpiry,
      message: hasExpiry ? undefined : 'No offer expiry date mentioned',
      location: 'Offer details',
    };
  },

  checkPromoCode: (content: string): QACheckResult => {
    const codeMatch = /code:?\s*([A-Z0-9-]+)/i.exec(content);
    return {
      ruleId: 'offer-code-valid',
      passed: true,
      message: codeMatch ? `Promo code found: ${codeMatch[1]}` : undefined,
      location: 'Checkout section',
    };
  },

  checkMarginThreshold: (content: string, productData?: any): QACheckResult => {
    // Mock: Would calculate actual margin
    return {
      ruleId: 'pricing-margin-check',
      passed: true,
      location: 'Pricing calculator',
    };
  },

  checkCompareAtPrice: (content: string): QACheckResult => {
    const hasCompareAt = /was \$|originally \$|retail \$/i.test(content);
    return {
      ruleId: 'pricing-compare-at',
      passed: true,
      message: hasCompareAt ? 'Compare-at pricing detected' : undefined,
      location: 'Pricing section',
    };
  },

  checkImageAltText: (content: string): QACheckResult => {
    // Mock: Would scan HTML for img tags without alt
    return {
      ruleId: 'img-alt-text',
      passed: true,
      location: 'Image scan',
    };
  },

  checkProductImageMatch: (content: string): QACheckResult => {
    return {
      ruleId: 'img-product-match',
      passed: true,
      location: 'Product images',
    };
  },

  checkBrokenImages: (content: string): QACheckResult => {
    return {
      ruleId: 'img-broken-links',
      passed: true,
      location: 'Image scan',
    };
  },

  checkImageOptimization: (content: string): QACheckResult => {
    return {
      ruleId: 'img-size-optimization',
      passed: true,
      location: 'Image scan',
    };
  },

  checkCheckoutLink: (content: string): QACheckResult => {
    const hasCheckout = /checkout|buy now|add to cart/i.test(content);
    return {
      ruleId: 'link-checkout-working',
      passed: hasCheckout,
      message: hasCheckout ? undefined : 'No checkout CTA found',
      location: 'CTA buttons',
    };
  },

  checkBrokenLinks: (content: string): QACheckResult => {
    return {
      ruleId: 'link-broken-404',
      passed: true,
      location: 'Link scan',
    };
  },

  checkExternalHTTPS: (content: string): QACheckResult => {
    const httpLinks = /href=["']http:\/\//gi.test(content);
    return {
      ruleId: 'link-external-https',
      passed: !httpLinks,
      message: httpLinks ? 'Non-HTTPS external links detected' : undefined,
      location: 'External links',
    };
  },

  checkMetaTitle: (content: string): QACheckResult => {
    // Mock: Would check actual meta tag
    return {
      ruleId: 'seo-meta-title',
      passed: true,
      location: 'Page head',
    };
  },

  checkMetaDescription: (content: string): QACheckResult => {
    return {
      ruleId: 'seo-meta-description',
      passed: true,
      location: 'Page head',
    };
  },

  checkH1Tag: (content: string): QACheckResult => {
    const h1Count = (content.match(/<h1/gi) || []).length;
    return {
      ruleId: 'seo-h1-tag',
      passed: h1Count === 1,
      message: h1Count === 0 ? 'No H1 tag found' : h1Count > 1 ? `Multiple H1 tags found (${h1Count})` : undefined,
      location: 'Page structure',
    };
  },

  checkCanonicalURL: (content: string): QACheckResult => {
    return {
      ruleId: 'seo-canonical-url',
      passed: true,
      location: 'Page head',
    };
  },

  checkFDADisclaimer: (content: string): QACheckResult => {
    const hasFDA = /these statements have not been evaluated|fda disclaimer/i.test(content);
    return {
      ruleId: 'compliance-fda-disclaimer',
      passed: hasFDA,
      message: hasFDA ? undefined : 'FDA disclaimer not found',
      location: 'Footer/disclaimers',
    };
  },

  checkHealthClaims: (content: string): QACheckResult => {
    const problematicClaims = ['cure', 'treat', 'prevent disease', 'diagnose'];
    const found = problematicClaims.find(claim => content.toLowerCase().includes(claim));
    return {
      ruleId: 'compliance-health-claims',
      passed: !found,
      message: found ? `Potentially problematic claim: "${found}"` : undefined,
      location: 'Content scan',
    };
  },

  checkTermsLink: (content: string): QACheckResult => {
    const hasTerms = /terms.{0,20}conditions|t&c/i.test(content);
    return {
      ruleId: 'compliance-terms-conditions',
      passed: hasTerms,
      message: hasTerms ? undefined : 'Terms & Conditions link not found',
      location: 'Footer',
    };
  },

  checkPrivacyLink: (content: string): QACheckResult => {
    const hasPrivacy = /privacy.{0,20}policy/i.test(content);
    return {
      ruleId: 'compliance-privacy-policy',
      passed: hasPrivacy,
      message: hasPrivacy ? undefined : 'Privacy Policy link not found',
      location: 'Footer',
    };
  },

  checkCTAPresent: (content: string): QACheckResult => {
    const ctaWords = ['buy now', 'shop now', 'get started', 'order now', 'add to cart'];
    const hasCTA = ctaWords.some(cta => content.toLowerCase().includes(cta));
    return {
      ruleId: 'content-cta-present',
      passed: hasCTA,
      message: hasCTA ? undefined : 'No clear CTA found',
      location: 'Content scan',
    };
  },

  checkUrgencyLanguage: (content: string): QACheckResult => {
    const urgencyWords = ['limited time', 'only.*left', 'hurry', 'expires soon', 'last chance'];
    const found = urgencyWords.find(word => new RegExp(word, 'i').test(content));
    return {
      ruleId: 'content-urgency-scarcity',
      passed: true,
      message: found ? `Urgency language detected: "${found}"` : undefined,
      location: 'Content scan',
    };
  },

  checkTestimonials: (content: string): QACheckResult => {
    const hasTestimonial = /testimonial|review|customer said/i.test(content);
    const hasDisclaimer = /results may vary|individual results/i.test(content);
    return {
      ruleId: 'content-testimonials',
      passed: !hasTestimonial || hasDisclaimer,
      message: hasTestimonial && !hasDisclaimer ? 'Testimonials found without disclaimer' : undefined,
      location: 'Testimonials section',
    };
  },

  checkUnsubscribeLink: (content: string): QACheckResult => {
    const hasUnsubscribe = /unsubscribe|opt.{0,5}out/i.test(content);
    return {
      ruleId: 'email-unsubscribe-link',
      passed: hasUnsubscribe,
      message: hasUnsubscribe ? undefined : 'Unsubscribe link not found (CAN-SPAM violation)',
      location: 'Email footer',
    };
  },

  checkPreheaderText: (content: string): QACheckResult => {
    return {
      ruleId: 'email-preheader-text',
      passed: true,
      location: 'Email header',
    };
  },

  checkCharacterLimit: (content: string, channel?: string): QACheckResult => {
    const limits: { [key: string]: number } = {
      'Twitter': 280,
      'Facebook': 63206,
      'Instagram': 2200,
    };
    const limit = channel ? limits[channel] : 280;
    const length = content.length;
    return {
      ruleId: 'social-character-limit',
      passed: length <= limit,
      message: length > limit ? `Content exceeds ${channel} limit (${length}/${limit} characters)` : undefined,
      location: 'Content length',
    };
  },

  checkHashtags: (content: string): QACheckResult => {
    const hashtags = content.match(/#\w+/g) || [];
    const tooMany = hashtags.length > 10;
    return {
      ruleId: 'social-hashtags',
      passed: !tooMany,
      message: tooMany ? `Too many hashtags (${hashtags.length}). Recommended: 3-5` : hashtags.length > 0 ? `${hashtags.length} hashtags found` : undefined,
      location: 'Content scan',
    };
  },
};

// Run QA checks on content
export function runQAChecks(
  content: string,
  channel: string = 'Web',
  enabledRules?: QACheckRule[]
): QACheckResult[] {
  const rules = enabledRules || defaultQARules.filter(rule => rule.enabled);
  const applicableRules = rules.filter(
    rule => rule.channels.length === 0 || rule.channels.includes(channel)
  );

  const results: QACheckResult[] = [];

  for (const rule of applicableRules) {
    const checkFn = qaCheckFunctions[rule.checkFunction as keyof typeof qaCheckFunctions];
    if (checkFn) {
      try {
        const result = checkFn(content, channel);
        if (!result.passed) {
          results.push({
            ...result,
            ruleId: rule.id,
          });
        }
      } catch (error) {
        console.error(`Error running check ${rule.id}:`, error);
      }
    }
  }

  return results;
}

// Get rules for a specific channel
export function getRulesForChannel(channel: string): QACheckRule[] {
  return defaultQARules.filter(
    rule => rule.channels.length === 0 || rule.channels.includes(channel)
  );
}

// Get rule by ID
export function getRuleById(ruleId: string): QACheckRule | undefined {
  return defaultQARules.find(rule => rule.id === ruleId);
}

