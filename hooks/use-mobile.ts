import { useEffect, useState } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Scroll performance optimization hook
export function useScrollOptimization() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateScroll = () => {
      // Optimize scroll performance by batching updates
      if (!ticking) {
        requestAnimationFrame(() => {
          // Update scroll position
          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive event listener for better scroll performance
    window.addEventListener('scroll', updateScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScroll);
    };
  }, []);

  return null;
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  }) as T;
}
