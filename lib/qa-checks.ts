// QA Check Configuration System - Based on NativePath RTN & ACQ Checklists

export interface QACheckRule {
  id: string;
  name: string;
  category: 'general' | 'email' | 'sms' | 'landing-page' | 'product-specific' | 'compliance';
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  description: string;
  checkFunction: string;
  channels: string[]; // 'RTN' (Email/SMS) or 'ACQ' (Amazon/YouTube/Meta/Affiliates) or both
}

export interface QACheckResult {
  ruleId: string;
  passed: boolean;
  message?: string;
  location?: string;
  details?: string;
}

// Default QA Check Rules - Based on RTN & ACQ Checklists
export const defaultQARules: QACheckRule[] = [
  // ==================== GENERAL (Both RTN & ACQ) ====================
  {
    id: 'gen-the-path-capitalized',
    name: 'Always capitalize The Path',
    category: 'general',
    severity: 'warning',
    enabled: true,
    description: 'Ensures "The Path" is always capitalized correctly',
    checkFunction: 'checkThePathCapitalization',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'gen-no-disease-claims',
    name: 'No disease claims',
    category: 'general',
    severity: 'critical',
    enabled: true,
    description: 'No disease claims - fractures, fatty liver, or actual names of diseases (diabetes, etc.)',
    checkFunction: 'checkDiseaseClaims',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'gen-no-break-even',
    name: 'Remove "break even" phrase',
    category: 'general',
    severity: 'warning',
    enabled: true,
    description: 'Remove the phrase "we barely break even (break-even)"',
    checkFunction: 'checkBreakEvenPhrase',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'gen-pricing-verification',
    name: 'Pricing verification',
    category: 'general',
    severity: 'critical',
    enabled: true,
    description: 'Use the Pricing Structures By Product document to verify pricing is right on sales pages',
    checkFunction: 'checkPricingStructure',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'gen-up-to-language',
    name: '"Up to" or "as low as" language',
    category: 'general',
    severity: 'warning',
    enabled: true,
    description: 'Make sure we use "up to" or "as low as" language at least once throughout the promo copy and CTA',
    checkFunction: 'checkUpToLanguage',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'gen-testimonial-disclaimer',
    name: 'Testimonial disclaimer',
    category: 'general',
    severity: 'critical',
    enabled: true,
    description: 'If there are testimonials, always include: (Customer results have not been independently verified. Results may vary.)',
    checkFunction: 'checkTestimonialDisclaimer',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'gen-fl-address',
    name: 'Florida address (not CA)',
    category: 'general',
    severity: 'critical',
    enabled: true,
    description: 'Check that the address in the footer is FL, not CA address. Updated Address: 1395 Brickell Ave. Suite 800 Miami, FL 33131',
    checkFunction: 'checkFloridaAddress',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'gen-free-shipping-checkout',
    name: 'Free shipping at checkout',
    category: 'general',
    severity: 'critical',
    enabled: true,
    description: 'Free shipping offer actually does not charge shipping at checkout',
    checkFunction: 'checkFreeShipping',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'gen-math-accuracy',
    name: 'Math accuracy',
    category: 'general',
    severity: 'critical',
    enabled: true,
    description: 'All math adds up at checkout and on sales ads',
    checkFunction: 'checkMathAccuracy',
    channels: ['RTN', 'ACQ'],
  },

  // ==================== EMAIL (RTN) ====================
  {
    id: 'email-from-name',
    name: 'From Name correct',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Check From Name (correct spelling, matches copy doc, any names that aren\'t NativePath/Dr. Chad/Chris should have "- NativePath" or "- NP" after them)',
    checkFunction: 'checkFromName',
    channels: ['RTN'],
  },
  {
    id: 'email-subject-preview',
    name: 'Subject Line & Preview Text',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Check Subject Line & Preview Text (correct spelling, matches copy doc, personalization pulling through correctly)',
    checkFunction: 'checkSubjectPreview',
    channels: ['RTN'],
  },
  {
    id: 'email-header-image',
    name: 'Correct email header',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Verify the correct NativePath email header is being used',
    checkFunction: 'checkEmailHeader',
    channels: ['RTN'],
  },
  {
    id: 'email-grammar-spelling',
    name: 'Grammar and spelling',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Check email for grammatical errors and spelling. Make sure it matches what it is in the copy doc (bolding/spacing/italics/links/etc.)',
    checkFunction: 'checkGrammarSpelling',
    channels: ['RTN'],
  },
  {
    id: 'email-mobile-desktop',
    name: 'Mobile & desktop display',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Make sure the email is displaying correctly on desktop and mobile with no weird breaks/spacing issues',
    checkFunction: 'checkMobileDesktop',
    channels: ['RTN'],
  },
  {
    id: 'email-personalization',
    name: 'Name personalization',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Check that name personalization inside the email copy is pulling through correctly',
    checkFunction: 'checkPersonalization',
    channels: ['RTN'],
  },
  {
    id: 'email-employee-reviews',
    name: 'Employee reviews noted',
    category: 'email',
    severity: 'critical',
    enabled: true,
    description: 'Employee reviews on Amazon, SMS, Email, and all landing pages must be noted with company affiliation',
    checkFunction: 'checkEmployeeReviews',
    channels: ['RTN'],
  },
  {
    id: 'email-links-working',
    name: 'All links working',
    category: 'email',
    severity: 'critical',
    enabled: true,
    description: 'Check that all links are working properly - going to correct sales page/offer, C1 has the correct date/campaign/segment/split',
    checkFunction: 'checkLinksWorking',
    channels: ['RTN'],
  },
  {
    id: 'email-abandon-code',
    name: 'Abandon code present',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'There should be an abandon code when you inspect the page in Chrome (not visible at bottom)',
    checkFunction: 'checkAbandonCode',
    channels: ['RTN'],
  },
  {
    id: 'email-lp-personalization',
    name: 'Landing page personalization',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Personalization is pulling through on the sales page [fn]',
    checkFunction: 'checkLPPersonalization',
    channels: ['RTN'],
  },
  {
    id: 'email-pricing-congruent',
    name: 'Pricing congruent',
    category: 'email',
    severity: 'critical',
    enabled: true,
    description: 'Pricing and checkout are congruent with the email copy',
    checkFunction: 'checkPricingCongruent',
    channels: ['RTN'],
  },
  {
    id: 'email-test-order',
    name: 'Place test order',
    category: 'email',
    severity: 'critical',
    enabled: true,
    description: 'Place a test order with a test credit card (pinned to rtn-channel in Slack)',
    checkFunction: 'checkTestOrder',
    channels: ['RTN'],
  },
  {
    id: 'email-upsells-downsells',
    name: 'Check upsells/downsells',
    category: 'email',
    severity: 'critical',
    enabled: true,
    description: 'Go through the entire sales funnel to check upsells/downsells - check copy and promo math is accurate',
    checkFunction: 'checkUpsellsDownsells',
    channels: ['RTN'],
  },
  {
    id: 'email-reject-hitpath',
    name: 'Reject sales in HitPath',
    category: 'email',
    severity: 'critical',
    enabled: true,
    description: 'Reject sales in HitPath after test order',
    checkFunction: 'checkRejectHitPath',
    channels: ['RTN'],
  },
  {
    id: 'email-website-no-hyperlink',
    name: 'Website mention no hyperlink',
    category: 'email',
    severity: 'info',
    enabled: true,
    description: 'If we mention the website in the copy, and it is not the main marketing touchpoint, we do not need to hyperlink it',
    checkFunction: 'checkWebsiteHyperlink',
    channels: ['RTN'],
  },
  {
    id: 'email-disclaimer',
    name: 'Email disclaimer present',
    category: 'email',
    severity: 'critical',
    enabled: true,
    description: 'Emails should always include the standard disclaimer',
    checkFunction: 'checkEmailDisclaimer',
    channels: ['RTN'],
  },
  {
    id: 'email-signoff',
    name: 'Correct sign-off',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Use this sign-off: "As always–to being & staying on The Path together, Dr. Chad Walding, DPT, ISSA Nutrition Specialist, Co-Founder NativePath"',
    checkFunction: 'checkSignoff',
    channels: ['RTN'],
  },
  {
    id: 'email-krista-to-julia',
    name: 'Krista changed to Julia',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Emails listed as "from Krista" should be changed to "Julia - NativePath" and make sure the reply to goes to cs@nativepath.com',
    checkFunction: 'checkKristaToJulia',
    channels: ['RTN'],
  },
  {
    id: 'email-canceled-spelling',
    name: 'American spelling of canceled',
    category: 'email',
    severity: 'info',
    enabled: true,
    description: 'Only use the American version of Cancel/Canceled (1 l; 2 l\'s is the British version)',
    checkFunction: 'checkCanceledSpelling',
    channels: ['RTN'],
  },
  {
    id: 'email-discount-language',
    name: 'Discount language restricted',
    category: 'email',
    severity: 'warning',
    enabled: true,
    description: 'Discount language is restricted to $ off (no % off); must not be listed in CTAs, only mentioned in copy',
    checkFunction: 'checkDiscountLanguage',
    channels: ['RTN'],
  },
  {
    id: 'email-no-urgent-language',
    name: 'No urgent language',
    category: 'email',
    severity: 'critical',
    enabled: true,
    description: 'Remove all "urgent" or "urgent warning" language from email swipes, sms sends, and landing pages',
    checkFunction: 'checkUrgentLanguage',
    channels: ['RTN'],
  },

  // ==================== SMS (RTN) ====================
  {
    id: 'sms-grammar-spelling',
    name: 'Grammar and spelling',
    category: 'sms',
    severity: 'warning',
    enabled: true,
    description: 'Check the copy for spelling and grammar issues',
    checkFunction: 'checkGrammarSpelling',
    channels: ['RTN'],
  },
  {
    id: 'sms-up-to-language',
    name: '"Up To" language',
    category: 'sms',
    severity: 'warning',
    enabled: true,
    description: 'Ensure that verbiage like "Up To", "Select Bundles", or "As Low As" are included in the copy',
    checkFunction: 'checkUpToLanguage',
    channels: ['RTN'],
  },
  {
    id: 'sms-personalization',
    name: 'Personalization',
    category: 'sms',
    severity: 'warning',
    enabled: true,
    description: 'Check that any personalization is pulling through correctly',
    checkFunction: 'checkPersonalization',
    channels: ['RTN'],
  },
  {
    id: 'sms-employee-reviews',
    name: 'Employee reviews noted',
    category: 'sms',
    severity: 'critical',
    enabled: true,
    description: 'Any employee reviews must be noted with company affiliation',
    checkFunction: 'checkEmployeeReviews',
    channels: ['RTN'],
  },
  {
    id: 'sms-links-working',
    name: 'Links working',
    category: 'sms',
    severity: 'critical',
    enabled: true,
    description: 'Check that all links are working properly - going to the correct page/promo, C1 in link has the correct date/segment/campaign/split',
    checkFunction: 'checkLinksWorking',
    channels: ['RTN'],
  },
  {
    id: 'sms-qa-landing-page',
    name: 'QA landing page',
    category: 'sms',
    severity: 'critical',
    enabled: true,
    description: 'QA landing page (Use the same steps as email for checking SMS landing pages)',
    checkFunction: 'checkLandingPage',
    channels: ['RTN'],
  },

  // ==================== LANDING PAGE (Both RTN & ACQ) ====================
  {
    id: 'lp-oxford-comma',
    name: 'Oxford comma',
    category: 'landing-page',
    severity: 'info',
    enabled: true,
    description: 'Please adhere to the oxford comma in lists',
    checkFunction: 'checkOxfordComma',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'lp-shipping-time',
    name: 'Shipping time (7-10 days)',
    category: 'landing-page',
    severity: 'warning',
    enabled: true,
    description: 'Shipping takes 7-10 days',
    checkFunction: 'checkShippingTime',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'lp-aov-copy',
    name: 'AOV copy highest unit',
    category: 'landing-page',
    severity: 'info',
    enabled: true,
    description: 'AOV copy should use language with the highest unit value',
    checkFunction: 'checkAOVCopy',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'lp-new-labels',
    name: 'New label designs',
    category: 'landing-page',
    severity: 'critical',
    enabled: true,
    description: 'ALL product inventory should be live with new label designs',
    checkFunction: 'checkNewLabels',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'lp-sans-serif-font',
    name: 'Sans serif font (Poppins)',
    category: 'landing-page',
    severity: 'info',
    enabled: true,
    description: 'The landing page font should be a sans serif (we typically use Poppins)',
    checkFunction: 'checkSansSerifFont',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'lp-customer-review-dates',
    name: 'Customer review dates',
    category: 'landing-page',
    severity: 'warning',
    enabled: true,
    description: 'When customer reviews include the date, ensure they are not dated past 1.5 years',
    checkFunction: 'checkReviewDates',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'lp-references-ingredients',
    name: 'References & ingredients match',
    category: 'landing-page',
    severity: 'critical',
    enabled: true,
    description: 'When there are References and/or Ingredients listed at the bottom of the page, always check to make sure it\'s the right label/references',
    checkFunction: 'checkReferencesIngredients',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'lp-no-recently-sold',
    name: 'No recently sold counters',
    category: 'landing-page',
    severity: 'warning',
    enabled: true,
    description: 'Remove Recently Sold Counters on buying options',
    checkFunction: 'checkRecentlySold',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'lp-abandon-code-rtn',
    name: 'Abandon codes (RTN only)',
    category: 'landing-page',
    severity: 'warning',
    enabled: true,
    description: 'Abandon codes should be present on all sales/landing pages and align with product offer (RTN only, NOT ACQ)',
    checkFunction: 'checkAbandonCodeRTN',
    channels: ['RTN'],
  },
  {
    id: 'lp-no-abandon-code-acq',
    name: 'No abandon codes (ACQ)',
    category: 'landing-page',
    severity: 'info',
    enabled: true,
    description: 'Abandon codes are NOT on ACQ pages',
    checkFunction: 'checkNoAbandonCodeACQ',
    channels: ['ACQ'],
  },

  // ==================== PRODUCT-SPECIFIC (Both RTN & ACQ) ====================
  {
    id: 'prod-krill-shellfish-faq',
    name: 'Krill shellfish allergy FAQ',
    category: 'product-specific',
    severity: 'critical',
    enabled: true,
    description: 'ALL Krill pages need to have shellfish allergy FAQ copy',
    checkFunction: 'checkKrillShellfish',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'prod-balance-ashwagandha',
    name: 'Native Balance: Ashwagandha',
    category: 'product-specific',
    severity: 'critical',
    enabled: true,
    description: 'Most updated formula: Ashwagandha',
    checkFunction: 'checkBalanceAshwagandha',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'prod-turmeric-boswellia',
    name: 'Total Turmeric: Boswellia',
    category: 'product-specific',
    severity: 'critical',
    enabled: true,
    description: 'Most updated formula: Boswellia extract (remove any mention of Black Seed Oil)',
    checkFunction: 'checkTurmericBoswellia',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'prod-d3k2-dosage',
    name: 'Vitamin D3+K2: Dosage',
    category: 'product-specific',
    severity: 'critical',
    enabled: true,
    description: 'Most updated formula: 2,000IUs of Vitamin D3 and 200mcg of Vitamin K2',
    checkFunction: 'checkD3K2Dosage',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'prod-berberine-formula',
    name: 'Berberine: Updated formula',
    category: 'product-specific',
    severity: 'critical',
    enabled: true,
    description: 'Most updated formula: Chromium and bitter melon (remove any mention of Oregon Grape)',
    checkFunction: 'checkBerberineFormula',
    channels: ['RTN', 'ACQ'],
  },
  {
    id: 'prod-berberine-labels',
    name: 'Berberine labels updated',
    category: 'product-specific',
    severity: 'critical',
    enabled: true,
    description: 'Berberine labels should have the new ingredients listed (i.e. bitter melon instead of oregon grape)',
    checkFunction: 'checkBerberineLabels',
    channels: ['RTN'],
  },
  {
    id: 'prod-turmeric-labels',
    name: 'Total Turmeric labels updated',
    category: 'product-specific',
    severity: 'critical',
    enabled: true,
    description: 'Total Turmeric labels should have new ingredients listed (i.e. Boswellia extract instead of Black Seed Oil)',
    checkFunction: 'checkTurmericLabels',
    channels: ['RTN'],
  },
  {
    id: 'prod-balance-labels',
    name: 'Update Balance labels',
    category: 'product-specific',
    severity: 'critical',
    enabled: true,
    description: 'Update Balance labels should include Ashwagandha',
    checkFunction: 'checkBalanceLabels',
    channels: ['RTN'],
  },

  // ==================== ACQ SPECIFIC ====================
  {
    id: 'acq-place-all-orders',
    name: 'Place order on every option',
    category: 'landing-page',
    severity: 'critical',
    enabled: true,
    description: 'Place an order on every product option to ensure they\'re all working properly',
    checkFunction: 'checkAllProductOptions',
    channels: ['ACQ'],
  },
];

// QA Check Functions (simplified implementations)
export const qaCheckFunctions = {
  checkThePathCapitalization: (content: string): QACheckResult => {
    const incorrectPath = /the path(?![A-Z])/g.test(content.toLowerCase());
    return {
      ruleId: 'gen-the-path-capitalized',
      passed: !incorrectPath,
      message: incorrectPath ? '"The Path" should always be capitalized' : undefined,
      location: 'Content scan',
    };
  },

  checkDiseaseClaims: (content: string): QACheckResult => {
    const diseaseClaims = ['fracture', 'fatty liver', 'diabetes', 'cancer', 'heart disease', 'alzheimer'];
    const found = diseaseClaims.find(claim => content.toLowerCase().includes(claim));
    return {
      ruleId: 'gen-no-disease-claims',
      passed: !found,
      message: found ? `Disease claim detected: "${found}"` : undefined,
      location: 'Content scan',
    };
  },

  checkBreakEvenPhrase: (content: string): QACheckResult => {
    const hasBreakEven = /break.?even/i.test(content);
    return {
      ruleId: 'gen-no-break-even',
      passed: !hasBreakEven,
      message: hasBreakEven ? 'Remove "break even" phrase' : undefined,
      location: 'Content scan',
    };
  },

  checkPricingStructure: (content: string): QACheckResult => {
    // This would need to integrate with the actual pricing spreadsheet
    return {
      ruleId: 'gen-pricing-verification',
      passed: true,
      message: 'Manual verification required: Check Pricing Structures By Product document',
      location: 'Pricing section',
    };
  },

  checkUpToLanguage: (content: string): QACheckResult => {
    const hasUpTo = /up to|as low as|select bundles/i.test(content);
    return {
      ruleId: 'gen-up-to-language',
      passed: hasUpTo,
      message: hasUpTo ? undefined : 'Add "up to" or "as low as" language',
      location: 'CTA/Copy',
    };
  },

  checkTestimonialDisclaimer: (content: string): QACheckResult => {
    const hasTestimonial = /testimonial|review|customer said/i.test(content);
    const hasDisclaimer = /customer results have not been independently verified|results may vary/i.test(content);
    return {
      ruleId: 'gen-testimonial-disclaimer',
      passed: !hasTestimonial || hasDisclaimer,
      message: hasTestimonial && !hasDisclaimer ? 'Add testimonial disclaimer: (Customer results have not been independently verified. Results may vary.)' : undefined,
      location: 'Testimonials',
    };
  },

  checkFloridaAddress: (content: string): QACheckResult => {
    const hasFLAddress = /1395 Brickell Ave|Miami, FL 33131/i.test(content);
    const hasCAAddress = /California|CA \d{5}/i.test(content);
    return {
      ruleId: 'gen-fl-address',
      passed: hasFLAddress && !hasCAAddress,
      message: hasCAAddress ? 'Update to FL address: 1395 Brickell Ave. Suite 800 Miami, FL 33131' : !hasFLAddress ? 'Add FL address' : undefined,
      location: 'Footer',
    };
  },

  checkFreeShipping: (content: string): QACheckResult => {
    return {
      ruleId: 'gen-free-shipping-checkout',
      passed: true,
      message: 'Manual verification required: Test checkout to ensure free shipping',
      location: 'Checkout',
    };
  },

  checkMathAccuracy: (content: string): QACheckResult => {
    return {
      ruleId: 'gen-math-accuracy',
      passed: true,
      message: 'Manual verification required: Verify all math at checkout',
      location: 'Pricing/Checkout',
    };
  },

  checkFromName: (content: string): QACheckResult => {
    return {
      ruleId: 'email-from-name',
      passed: true,
      message: 'Manual verification required: Check From Name matches copy doc',
      location: 'Email header',
    };
  },

  checkSubjectPreview: (content: string): QACheckResult => {
    return {
      ruleId: 'email-subject-preview',
      passed: true,
      message: 'Manual verification required: Check Subject & Preview Text',
      location: 'Email header',
    };
  },

  checkEmailHeader: (content: string): QACheckResult => {
    return {
      ruleId: 'email-header-image',
      passed: true,
      message: 'Manual verification required: Verify correct NativePath header image',
      location: 'Email header',
    };
  },

  checkGrammarSpelling: (content: string): QACheckResult => {
    // Basic typo check
    const commonTypos = ['recieve', 'occured', 'seperate', 'definately'];
    const found = commonTypos.find(typo => content.toLowerCase().includes(typo));
    return {
      ruleId: 'email-grammar-spelling',
      passed: !found,
      message: found ? `Spelling error: "${found}"` : 'Manual review recommended',
      location: 'Content',
    };
  },

  checkMobileDesktop: (content: string): QACheckResult => {
    return {
      ruleId: 'email-mobile-desktop',
      passed: true,
      message: 'Manual verification required: Test on mobile and desktop',
      location: 'Display',
    };
  },

  checkPersonalization: (content: string): QACheckResult => {
    const hasPersonalization = /\{\{|\[fn\]|%first_name%/i.test(content);
    return {
      ruleId: 'email-personalization',
      passed: true,
      message: hasPersonalization ? 'Personalization detected - verify it pulls through correctly' : undefined,
      location: 'Content',
    };
  },

  checkEmployeeReviews: (content: string): QACheckResult => {
    return {
      ruleId: 'email-employee-reviews',
      passed: true,
      message: 'Manual verification required: Check employee reviews have company affiliation noted',
      location: 'Reviews',
    };
  },

  checkLinksWorking: (content: string): QACheckResult => {
    return {
      ruleId: 'email-links-working',
      passed: true,
      message: 'Manual verification required: Test all links and verify C1 parameters',
      location: 'Links',
    };
  },

  checkAbandonCode: (content: string): QACheckResult => {
    return {
      ruleId: 'email-abandon-code',
      passed: true,
      message: 'Manual verification required: Inspect page for abandon code',
      location: 'Page code',
    };
  },

  checkLPPersonalization: (content: string): QACheckResult => {
    return {
      ruleId: 'email-lp-personalization',
      passed: true,
      message: 'Manual verification required: Check [fn] personalization on landing page',
      location: 'Landing page',
    };
  },

  checkPricingCongruent: (content: string): QACheckResult => {
    return {
      ruleId: 'email-pricing-congruent',
      passed: true,
      message: 'Manual verification required: Verify pricing matches email copy',
      location: 'Pricing',
    };
  },

  checkTestOrder: (content: string): QACheckResult => {
    return {
      ruleId: 'email-test-order',
      passed: true,
      message: 'Manual verification required: Place test order with test credit card',
      location: 'Checkout',
    };
  },

  checkUpsellsDownsells: (content: string): QACheckResult => {
    return {
      ruleId: 'email-upsells-downsells',
      passed: true,
      message: 'Manual verification required: Test entire sales funnel',
      location: 'Sales funnel',
    };
  },

  checkRejectHitPath: (content: string): QACheckResult => {
    return {
      ruleId: 'email-reject-hitpath',
      passed: true,
      message: 'Manual action required: Reject test sales in HitPath',
      location: 'HitPath',
    };
  },

  checkWebsiteHyperlink: (content: string): QACheckResult => {
    return {
      ruleId: 'email-website-no-hyperlink',
      passed: true,
      message: 'Manual review: If website mentioned (not main CTA), ensure it\'s not hyperlinked',
      location: 'Links',
    };
  },

  checkEmailDisclaimer: (content: string): QACheckResult => {
    const hasDisclaimer = /these statements have not been evaluated/i.test(content);
    return {
      ruleId: 'email-disclaimer',
      passed: hasDisclaimer,
      message: hasDisclaimer ? undefined : 'Add standard email disclaimer',
      location: 'Footer',
    };
  },

  checkSignoff: (content: string): QACheckResult => {
    const hasCorrectSignoff = /As always.?to being & staying on The Path together[\s\S]*Dr\. Chad Walding/i.test(content);
    return {
      ruleId: 'email-signoff',
      passed: hasCorrectSignoff,
      message: hasCorrectSignoff ? undefined : 'Use correct sign-off: "As always–to being & staying on The Path together, Dr. Chad Walding, DPT, ISSA Nutrition Specialist, Co-Founder NativePath"',
      location: 'Email footer',
    };
  },

  checkKristaToJulia: (content: string): QACheckResult => {
    const hasKrista = /from.*krista/i.test(content);
    return {
      ruleId: 'email-krista-to-julia',
      passed: !hasKrista,
      message: hasKrista ? 'Change "from Krista" to "Julia - NativePath" and reply-to: cs@nativepath.com' : undefined,
      location: 'Email header',
    };
  },

  checkCanceledSpelling: (content: string): QACheckResult => {
    const hasBritishSpelling = /cancelled/i.test(content);
    return {
      ruleId: 'email-canceled-spelling',
      passed: !hasBritishSpelling,
      message: hasBritishSpelling ? 'Use American spelling: "canceled" (one L)' : undefined,
      location: 'Content',
    };
  },

  checkDiscountLanguage: (content: string): QACheckResult => {
    const hasPercentOff = /\d+%\s*off/i.test(content);
    return {
      ruleId: 'email-discount-language',
      passed: !hasPercentOff,
      message: hasPercentOff ? 'Use $ off instead of % off; no % in CTAs' : undefined,
      location: 'CTAs/Copy',
    };
  },

  checkUrgentLanguage: (content: string): QACheckResult => {
    const hasUrgent = /urgent|urgent warning/i.test(content);
    return {
      ruleId: 'email-no-urgent-language',
      passed: !hasUrgent,
      message: hasUrgent ? 'Remove "urgent" or "urgent warning" language' : undefined,
      location: 'Content',
    };
  },

  checkLandingPage: (content: string): QACheckResult => {
    return {
      ruleId: 'sms-qa-landing-page',
      passed: true,
      message: 'Manual verification required: QA landing page using email checklist',
      location: 'Landing page',
    };
  },

  checkOxfordComma: (content: string): QACheckResult => {
    return {
      ruleId: 'lp-oxford-comma',
      passed: true,
      message: 'Manual review: Verify oxford comma usage in lists',
      location: 'Content',
    };
  },

  checkShippingTime: (content: string): QACheckResult => {
    const hasShipping = /shipping.*\d+.*days/i.test(content);
    const correctShipping = /7-10 days/i.test(content);
    return {
      ruleId: 'lp-shipping-time',
      passed: !hasShipping || correctShipping,
      message: hasShipping && !correctShipping ? 'Update shipping time to 7-10 days' : undefined,
      location: 'Shipping info',
    };
  },

  checkAOVCopy: (content: string): QACheckResult => {
    return {
      ruleId: 'lp-aov-copy',
      passed: true,
      message: 'Manual review: Ensure AOV copy uses highest unit value',
      location: 'Product copy',
    };
  },

  checkNewLabels: (content: string): QACheckResult => {
    return {
      ruleId: 'lp-new-labels',
      passed: true,
      message: 'Manual verification required: Verify new label designs are used',
      location: 'Product images',
    };
  },

  checkSansSerifFont: (content: string): QACheckResult => {
    return {
      ruleId: 'lp-sans-serif-font',
      passed: true,
      message: 'Manual review: Verify sans serif font (Poppins) is used',
      location: 'Page styling',
    };
  },

  checkReviewDates: (content: string): QACheckResult => {
    return {
      ruleId: 'lp-customer-review-dates',
      passed: true,
      message: 'Manual review: Ensure customer reviews are not older than 1.5 years',
      location: 'Reviews',
    };
  },

  checkReferencesIngredients: (content: string): QACheckResult => {
    return {
      ruleId: 'lp-references-ingredients',
      passed: true,
      message: 'Manual verification required: Verify references/ingredients match label',
      location: 'References section',
    };
  },

  checkRecentlySold: (content: string): QACheckResult => {
    const hasRecentlySold = /recently sold|just sold|\d+ sold/i.test(content);
    return {
      ruleId: 'lp-no-recently-sold',
      passed: !hasRecentlySold,
      message: hasRecentlySold ? 'Remove "Recently Sold" counters' : undefined,
      location: 'Buying options',
    };
  },

  checkAbandonCodeRTN: (content: string): QACheckResult => {
    return {
      ruleId: 'lp-abandon-code-rtn',
      passed: true,
      message: 'Manual verification required: Check abandon code is present (RTN only)',
      location: 'Page code',
    };
  },

  checkNoAbandonCodeACQ: (content: string): QACheckResult => {
    return {
      ruleId: 'lp-no-abandon-code-acq',
      passed: true,
      message: 'Manual verification required: Ensure NO abandon codes on ACQ pages',
      location: 'Page code',
    };
  },

  checkKrillShellfish: (content: string): QACheckResult => {
    const isKrill = /krill/i.test(content);
    const hasFAQ = /safe to take krill oil[\s\S]*shellfish allergy/i.test(content);
    return {
      ruleId: 'prod-krill-shellfish-faq',
      passed: !isKrill || hasFAQ,
      message: isKrill && !hasFAQ ? 'Add Krill shellfish allergy FAQ' : undefined,
      location: 'FAQ section',
    };
  },

  checkBalanceAshwagandha: (content: string): QACheckResult => {
    const isBalance = /native balance|balance/i.test(content);
    const hasAshwagandha = /ashwagandha/i.test(content);
    return {
      ruleId: 'prod-balance-ashwagandha',
      passed: !isBalance || hasAshwagandha,
      message: isBalance && !hasAshwagandha ? 'Native Balance: Ensure Ashwagandha is mentioned' : undefined,
      location: 'Ingredients',
    };
  },

  checkTurmericBoswellia: (content: string): QACheckResult => {
    const isTurmeric = /total turmeric|turmeric/i.test(content);
    const hasBoswellia = /boswellia/i.test(content);
    const hasBlackSeed = /black seed oil/i.test(content);
    return {
      ruleId: 'prod-turmeric-boswellia',
      passed: !isTurmeric || (hasBoswellia && !hasBlackSeed),
      message: isTurmeric && hasBlackSeed ? 'Remove Black Seed Oil, use Boswellia extract' : isTurmeric && !hasBoswellia ? 'Add Boswellia extract' : undefined,
      location: 'Ingredients',
    };
  },

  checkD3K2Dosage: (content: string): QACheckResult => {
    const isD3K2 = /vitamin d3.*k2|d3.*k2/i.test(content);
    const correctDosage = /2,?000\s*iu[\s\S]*vitamin d3[\s\S]*200\s*mcg[\s\S]*k2/i.test(content);
    return {
      ruleId: 'prod-d3k2-dosage',
      passed: !isD3K2 || correctDosage,
      message: isD3K2 && !correctDosage ? 'Verify dosage: 2,000IUs Vitamin D3 and 200mcg Vitamin K2' : undefined,
      location: 'Ingredients',
    };
  },

  checkBerberineFormula: (content: string): QACheckResult => {
    const isBerberine = /berberine/i.test(content);
    const hasChromium = /chromium/i.test(content);
    const hasBitterMelon = /bitter melon/i.test(content);
    const hasOregonGrape = /oregon grape/i.test(content);
    return {
      ruleId: 'prod-berberine-formula',
      passed: !isBerberine || (hasChromium && hasBitterMelon && !hasOregonGrape),
      message: isBerberine && hasOregonGrape ? 'Remove Oregon Grape, use Chromium and bitter melon' : isBerberine && (!hasChromium || !hasBitterMelon) ? 'Add Chromium and bitter melon' : undefined,
      location: 'Ingredients',
    };
  },

  checkBerberineLabels: (content: string): QACheckResult => {
    return {
      ruleId: 'prod-berberine-labels',
      passed: true,
      message: 'Manual verification required: Check Berberine labels have bitter melon (not oregon grape)',
      location: 'Product labels',
    };
  },

  checkTurmericLabels: (content: string): QACheckResult => {
    return {
      ruleId: 'prod-turmeric-labels',
      passed: true,
      message: 'Manual verification required: Check Total Turmeric labels have Boswellia (not Black Seed Oil)',
      location: 'Product labels',
    };
  },

  checkBalanceLabels: (content: string): QACheckResult => {
    return {
      ruleId: 'prod-balance-labels',
      passed: true,
      message: 'Manual verification required: Check Update Balance labels include Ashwagandha',
      location: 'Product labels',
    };
  },

  checkAllProductOptions: (content: string): QACheckResult => {
    return {
      ruleId: 'acq-place-all-orders',
      passed: true,
      message: 'Manual verification required: Place order on EVERY product option (ACQ)',
      location: 'Checkout',
    };
  },
};

// Run QA checks on content
export function runQAChecks(
  content: string,
  channel: string = 'RTN',
  enabledRules?: QACheckRule[]
): QACheckResult[] {
  // Map channel names to RTN or ACQ
  const channelMap: { [key: string]: 'RTN' | 'ACQ' } = {
    'Email': 'RTN',
    'SMS': 'RTN',
    'Web': 'ACQ',
    'Amazon': 'ACQ',
    'YouTube': 'ACQ',
    'Meta': 'ACQ',
    'Facebook': 'ACQ',
    'Instagram': 'ACQ',
    'Affiliates': 'ACQ',
    'RTN': 'RTN',
    'ACQ': 'ACQ',
  };

  const mappedChannel = channelMap[channel] || 'RTN';
  
  const rules = enabledRules || defaultQARules.filter(rule => rule.enabled);
  const applicableRules = rules.filter(
    rule => rule.channels.length === 0 || rule.channels.includes(mappedChannel)
  );

  const results: QACheckResult[] = [];

  for (const rule of applicableRules) {
    const checkFn = qaCheckFunctions[rule.checkFunction as keyof typeof qaCheckFunctions];
    if (checkFn) {
      try {
        const result = checkFn(content);
        if (!result.passed || result.message) {
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
export function getRulesForChannel(channel: 'RTN' | 'ACQ'): QACheckRule[] {
  return defaultQARules.filter(
    rule => rule.channels.length === 0 || rule.channels.includes(channel)
  );
}

// Get rule by ID
export function getRuleById(ruleId: string): QACheckRule | undefined {
  return defaultQARules.find(rule => rule.id === ruleId);
}
