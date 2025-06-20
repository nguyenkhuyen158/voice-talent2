'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    // Record page view
    const recordVisit = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };

    recordVisit();
  }, [pathname]);
}
