export type Channel = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export type ExternalPrice = {
  channel: 'amazon' | 'website' | 'landing-page';
  url?: string;
  asin?: string; // Amazon ASIN
  lastFetched?: string;
  currentPrice?: number;
  isMatch: boolean; // Whether it matches base price
  difference?: number; // Difference from base price
  error?: string; // Error message if fetch failed
};

export type Product = {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  basePrice: number;
  externalPrices?: ExternalPrice[]; // Prices from external sources
  createdAt: string;
  updatedAt: string;
};

export type PriceTier = {
  id: string;
  name: string; // e.g., "1 Bottle", "2 Bottles", "3 Bottles + Free Gift"
  quantity?: number; // Number of units in this tier
  price: number;
  retailPrice?: number; // Market/retail price if different
  margin?: number; // Margin percentage
  includesFreeGift?: boolean;
  freeGiftDescription?: string;
  notes?: string;
};

export type Price = {
  id: string;
  productId: string;
  channelId: string;
  // Support both single price (backward compatible) and multiple tiers
  price?: number; // Legacy single price - use tiers instead
  tiers?: PriceTier[]; // Multiple pricing tiers for the same product/channel
  effectiveDate: string;
  endDate?: string;
  createdAt: string;
  createdBy: string;
};

export type PromotionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'expired';

export type Promotion = {
  id: string;
  name: string;
  description?: string;
  status: PromotionStatus;
  startDate: string;
  endDate: string;
  productIds: string[];
  channelIds: string[];
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  proposedBy: string;
  proposedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  reason?: string; // Business case/reason for promotion
  notes?: string; // Additional notes
  createdAt: string;
  updatedAt: string;
};

export type EventImportance = 'high' | 'medium' | 'low';

export type CalendarEventStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type ChannelHolidayPlan = {
  channelId: string;
  angle: string; // Marketing angle/approach for this channel
  promotionIds: string[]; // Promotions this channel is running for this holiday
  notes?: string; // Channel-specific notes
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // Actual holiday/event date
  prepDate?: string; // When to start preparing assets
  launchDate?: string; // When to launch the promotion
  type: 'holiday' | 'promotion' | 'deadline';
  promotionId?: string; // Legacy - use channelPlans instead
  description?: string;
  importance?: EventImportance;
  status: CalendarEventStatus;
  channelIds?: string[]; // Which channels this event applies to (legacy)
  channelPlans?: ChannelHolidayPlan[]; // Channel-specific plans with angles and promotions
  proposedBy?: string;
  proposedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
};

export type AppData = {
  products: Product[];
  channels: Channel[];
  prices: Price[];
  promotions: Promotion[];
  calendarEvents: CalendarEvent[];
};

