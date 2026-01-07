import type { AppData, Product, Channel, Price, Promotion, CalendarEvent } from '@/types';

const STORAGE_KEY = 'nativepath-promotions-data';

// Default data structure
const defaultData: AppData = {
  products: [],
  channels: [],
  prices: [],
  promotions: [],
  calendarEvents: [],
};

// Initialize with some sample data for demo purposes
const sampleData: AppData = {
  products: [
    {
      id: '1',
      name: 'Collagen 25s',
      sku: 'COL-25',
      description: 'Premium grass-fed collagen peptides',
      basePrice: 33.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Collagen 56s',
      sku: 'COL-56',
      description: 'Premium grass-fed collagen peptides - 56 servings',
      basePrice: 49.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Hydrate',
      sku: 'HYD-30',
      description: 'Electrolyte hydration supplement',
      basePrice: 29.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Creatine',
      sku: 'CRE-60',
      description: 'Creatine monohydrate supplement',
      basePrice: 34.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  channels: [
    {
      id: '1',
      name: 'Website',
      description: 'Direct-to-consumer website',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Amazon',
      description: 'Amazon marketplace',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Retail',
      description: 'Physical retail stores',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Email Marketing',
      description: 'Email campaigns',
      createdAt: new Date().toISOString(),
    },
  ],
  prices: [],
  promotions: [],
  calendarEvents: [
    {
      id: '1',
      title: 'New Year\'s',
      date: '2026-01-01',
      prepDate: '2025-11-15',
      launchDate: '2025-12-15',
      type: 'holiday',
      description: 'New Year wellness resolutions promotion',
      importance: 'high',
      status: 'approved',
      proposedBy: 'System',
      proposedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Valentine\'s Day',
      date: '2026-02-14',
      prepDate: '2025-12-01',
      launchDate: '2026-01-15',
      type: 'holiday',
      description: 'Valentine\'s Day promotion planning',
      importance: 'high',
      status: 'approved',
      proposedBy: 'System',
      proposedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Black Friday / Cyber Monday',
      date: '2025-11-28',
      prepDate: '2025-08-01',
      launchDate: '2025-11-15',
      type: 'holiday',
      description: 'Black Friday/Cyber Monday - biggest sales event of the year',
      importance: 'high',
      status: 'approved',
      proposedBy: 'System',
      proposedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Memorial Day',
      date: '2026-05-26',
      prepDate: '2026-04-01',
      launchDate: '2026-05-01',
      type: 'holiday',
      description: 'Memorial Day weekend sale',
      importance: 'medium',
      status: 'approved',
      proposedBy: 'System',
      proposedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: '4th of July',
      date: '2026-07-04',
      prepDate: '2026-05-15',
      launchDate: '2026-06-15',
      type: 'holiday',
      description: 'Independence Day summer sale',
      importance: 'medium',
      status: 'approved',
      proposedBy: 'System',
      proposedAt: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'Labor Day',
      date: '2026-09-01',
      prepDate: '2026-07-15',
      launchDate: '2026-08-15',
      type: 'holiday',
      description: 'Labor Day end of summer sale',
      importance: 'medium',
      status: 'approved',
      proposedBy: 'System',
      proposedAt: new Date().toISOString(),
    },
    {
      id: '7',
      title: 'Halloween',
      date: '2025-10-31',
      prepDate: '2025-08-15',
      launchDate: '2025-09-15',
      type: 'holiday',
      description: 'Halloween wellness promotion',
      importance: 'low',
      status: 'approved',
      proposedBy: 'System',
      proposedAt: new Date().toISOString(),
    },
    {
      id: '8',
      title: 'Thanksgiving',
      date: '2025-11-27',
      prepDate: '2025-09-01',
      launchDate: '2025-11-01',
      type: 'holiday',
      description: 'Thanksgiving wellness promotion',
      importance: 'medium',
      status: 'approved',
      proposedBy: 'System',
      proposedAt: new Date().toISOString(),
    },
    {
      id: '9',
      title: 'Christmas / Holiday Season',
      date: '2025-12-25',
      prepDate: '2025-09-15',
      launchDate: '2025-11-01',
      type: 'holiday',
      description: 'Christmas and holiday season promotion',
      importance: 'high',
      status: 'approved',
      proposedBy: 'System',
      proposedAt: new Date().toISOString(),
    },
  ],
};

export function loadData(): AppData {
  if (typeof window === 'undefined') {
    return defaultData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with sample data on first load
    const initialData = sampleData;
    saveData(initialData);
    return initialData;
  } catch (error) {
    console.error('Error loading data:', error);
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export function getData(): AppData {
  return loadData();
}

export function updateData(updater: (data: AppData) => AppData): void {
  const currentData = loadData();
  const updatedData = updater(currentData);
  saveData(updatedData);
}

// Helper functions for specific data types
export function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  updateData((data) => ({
    ...data,
    products: [...data.products, newProduct],
  }));

  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  let updatedProduct: Product | null = null;

  updateData((data) => {
    const productIndex = data.products.findIndex((p) => p.id === id);
    if (productIndex === -1) return data;

    updatedProduct = {
      ...data.products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return {
      ...data,
      products: [
        ...data.products.slice(0, productIndex),
        updatedProduct,
        ...data.products.slice(productIndex + 1),
      ],
    };
  });

  return updatedProduct;
}

export function addChannel(channel: Omit<Channel, 'id' | 'createdAt'>): Channel {
  const newChannel: Channel = {
    ...channel,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  updateData((data) => ({
    ...data,
    channels: [...data.channels, newChannel],
  }));

  return newChannel;
}

export function addPrice(price: Omit<Price, 'id' | 'createdAt'>): Price {
  // Get current user if available
  let createdBy = price.createdBy;
  if (typeof window !== 'undefined') {
    try {
      const { getCurrentUser } = require('./auth');
      const user = getCurrentUser();
      if (user) {
        createdBy = user.name;
      }
    } catch {
      // Auth module not available, use provided value
    }
  }

  const newPrice: Price = {
    ...price,
    createdBy,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  updateData((data) => ({
    ...data,
    prices: [...data.prices, newPrice],
  }));

  return newPrice;
}

export function getPromotion(id: string): Promotion | undefined {
  if (typeof window === 'undefined') return undefined;
  const data = getData();
  return data.promotions.find((p) => p.id === id);
}

export function addPromotion(
  promotion: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'proposedAt'>
): Promotion {
  const newPromotion: Promotion = {
    ...promotion,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // More unique ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    proposedAt: new Date().toISOString(),
  };

  updateData((data) => ({
    ...data,
    promotions: [...data.promotions, newPromotion],
  }));

  return newPromotion;
}

export function updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
  let updatedPromotion: Promotion | null = null;

  updateData((data) => {
    const promotionIndex = data.promotions.findIndex((p) => p.id === id);
    if (promotionIndex === -1) return data;

    updatedPromotion = {
      ...data.promotions[promotionIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return {
      ...data,
      promotions: [
        ...data.promotions.slice(0, promotionIndex),
        updatedPromotion,
        ...data.promotions.slice(promotionIndex + 1),
      ],
    };
  });

  return updatedPromotion;
}

export function addCalendarEvent(
  event: Omit<CalendarEvent, 'id' | 'proposedAt'>
): CalendarEvent {
  const currentUser = typeof window !== 'undefined' ? (() => {
    try {
      const { getCurrentUser } = require('./auth');
      return getCurrentUser();
    } catch {
      return null;
    }
  })() : null;

  const newEvent: CalendarEvent = {
    ...event,
    id: Date.now().toString(),
    status: event.status || 'pending',
    proposedBy: currentUser?.name || 'Unknown',
    proposedAt: new Date().toISOString(),
  };

  updateData((data) => ({
    ...data,
    calendarEvents: [...data.calendarEvents, newEvent],
  }));

  return newEvent;
}

export function updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
  let updatedEvent: CalendarEvent | null = null;

  updateData((data) => {
    const eventIndex = data.calendarEvents.findIndex((e) => e.id === id);
    if (eventIndex === -1) return data;

    updatedEvent = {
      ...data.calendarEvents[eventIndex],
      ...updates,
    };

    return {
      ...data,
      calendarEvents: [
        ...data.calendarEvents.slice(0, eventIndex),
        updatedEvent,
        ...data.calendarEvents.slice(eventIndex + 1),
      ],
    };
  });

  return updatedEvent;
}

