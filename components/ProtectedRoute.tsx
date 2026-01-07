'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Don't protect login page
    if (pathname === '/login') {
      return;
    }

    // Check authentication
    if (typeof window !== 'undefined') {
      const auth = isAuthenticated();
      if (!auth) {
        router.push('/login');
      }
    }
  }, [router, pathname]);

  // Don't protect login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Wait for mount to avoid hydration issues
  if (!mounted) {
    return (
      <div className="h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check auth on client side
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    return (
      <div className="h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}

