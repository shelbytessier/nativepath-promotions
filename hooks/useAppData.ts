'use client';

import { useEffect, useState } from 'react';
import { getData } from '@/lib/storage';
import type { AppData } from '@/types';

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setData(getData());
  };

  useEffect(() => {
    setData(getData());
    setLoading(false);
  }, []);

  return { data, loading, refresh };
}





